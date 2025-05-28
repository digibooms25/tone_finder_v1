import * as YoutubeTranscriptModule from 'npm:youtube-transcript@1.0.6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { videoId } = await req.json();

    if (!videoId) {
      return new Response(
        JSON.stringify({ 
          error: 'Video ID is required',
          details: 'Please provide a valid YouTube video URL' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Add retries for transcript fetching with exponential backoff
    let transcript;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        // Try to get the transcript list first to check availability
        const transcriptList = await YoutubeTranscriptModule.YoutubeTranscript.listTranscripts(videoId);
        
        try {
          // Try to get English transcript first
          transcript = await transcriptList.findTranscript(['en']);
        } catch {
          try {
            // Try auto-generated English transcript
            transcript = await transcriptList.findTranscript(['en-US', 'en-GB', 'en-AU']);
          } catch {
            // Try any available transcript and translate to English
            const transcripts = await transcriptList.getTranscripts();
            if (transcripts.length > 0) {
              transcript = await transcripts[0].translate('en');
            }
          }
        }

        if (transcript) {
          transcript = await transcript.fetch();
          break;
        }

        throw new Error('No available transcripts found');
      } catch (error) {
        attempts++;
        console.error(`Attempt ${attempts} failed:`, error);
        
        if (attempts === maxAttempts) {
          throw error;
        }
        
        // Exponential backoff with jitter
        const baseDelay = 1000 * Math.pow(2, attempts);
        const jitter = Math.random() * 1000;
        await sleep(baseDelay + jitter);
      }
    }
    
    if (!transcript || transcript.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No transcript available',
          details: 'No captions were found for this video. Please ensure the video has captions enabled, or try a different video.' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Combine transcript parts into a single text
    const fullTranscript = transcript
      .map(part => part.text)
      .join(' ')
      // Clean up common transcript artifacts
      .replace(/\[.*?\]/g, '') // Remove bracketed content
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/(\w)\s+([.,!?])/g, '$1$2') // Fix spacing around punctuation
      .replace(/[^\w\s.,!?'-]/g, '') // Remove special characters except basic punctuation
      .replace(/(\w)'(\w)/g, '$1$2') // Remove apostrophes between words
      .replace(/\s+/g, ' ') // Final whitespace cleanup
      .trim();

    // Validate transcript length (approximately 2 minutes of speech)
    const minWords = 200; // Average speaking rate is ~100-130 words per minute
    const wordCount = fullTranscript.split(/\s+/).length;

    if (wordCount < minWords) {
      return new Response(
        JSON.stringify({ 
          error: 'Transcript too short',
          details: `The video transcript is too short for analysis. Please use a video with at least 2 minutes of speaking content (found ${wordCount} words, need at least ${minWords}).` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        transcript: fullTranscript,
        wordCount
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Transcript fetch error:', error);

    // Handle specific error types
    if (error.message?.includes('Could not get transcripts') || 
        error.message?.includes('No transcript available') ||
        error.message?.includes('Subtitles are disabled') ||
        error.message?.includes('No available transcripts found')) {
      return new Response(
        JSON.stringify({ 
          error: 'No transcript available',
          details: 'No captions were found for this video. Please ensure the video has captions enabled, or try a different video.'
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (error.message?.includes('Invalid video id') || 
        error.message?.includes('Video id not found') ||
        error.message?.includes('Video unavailable')) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid video ID',
          details: 'The provided YouTube URL is invalid or the video is unavailable. Please check the URL and try again.'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch transcript',
        details: 'An unexpected error occurred while fetching the transcript. Please try again later.',
        message: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});