import { YoutubeTranscript } from 'npm:youtube-transcript@1.0.6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Add retries for transcript fetching
    let transcript;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        transcript = await YoutubeTranscript.fetchTranscript(videoId);
        break;
      } catch (error) {
        attempts++;
        if (attempts === maxAttempts) {
          throw error;
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }
    
    if (!transcript || transcript.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No transcript available',
          details: 'This video either has no captions or they are disabled. Please try a different video with available captions.' 
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
      .trim();

    // Validate transcript length
    if (fullTranscript.length < 100) {
      return new Response(
        JSON.stringify({ 
          error: 'Transcript too short',
          details: 'The video transcript is too short for analysis. Please use a video with at least 2 minutes of speaking content.' 
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
        wordCount: fullTranscript.split(/\s+/).length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Transcript fetch error:', error);

    // Handle specific error types
    if (error.message?.includes('Could not get transcripts')) {
      return new Response(
        JSON.stringify({ 
          error: 'Transcript unavailable',
          details: 'Could not access captions for this video. Please ensure the video has English captions enabled.'
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (error.message?.includes('Invalid video id')) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid video ID',
          details: 'The provided YouTube URL is invalid. Please check the URL and try again.'
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
        details: 'An unexpected error occurred. Please try again later.'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});