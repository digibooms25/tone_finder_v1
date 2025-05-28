import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { videoId } = await req.json();
    if (!videoId) {
      return new Response(
        JSON.stringify({
          error: 'Missing video ID',
          details: 'Please provide a valid YouTube video ID'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // First, fetch the caption tracks available for the video
    const trackListUrl = `https://youtube.com/watch?v=${videoId}`;
    const response = await fetch(trackListUrl);
    const html = await response.text();

    // Extract caption track data from the YouTube page
    const captionTrackPattern = /"captionTracks":\[(.*?)\]/;
    const match = html.match(captionTrackPattern);
    
    if (!match) {
      return new Response(
        JSON.stringify({
          error: 'No captions available',
          details: 'This video does not have any captions or subtitles available.'
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse the caption tracks and find the English one (or first available)
    const captionTracks = JSON.parse(`[${match[1]}]`);
    const englishTrack = captionTracks.find((track: any) => 
      track.languageCode === 'en' || track.vssId.includes('.en')
    ) || captionTracks[0];

    if (!englishTrack || !englishTrack.baseUrl) {
      return new Response(
        JSON.stringify({
          error: 'No suitable captions found',
          details: 'Could not find appropriate captions for this video.'
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Fetch the actual transcript
    const transcriptResponse = await fetch(englishTrack.baseUrl);
    const transcriptXml = await transcriptResponse.text();

    // Extract text from XML
    const textPattern = /<text[^>]*>(.*?)<\/text>/g;
    let transcript = '';
    let match2;
    
    while ((match2 = textPattern.exec(transcriptXml)) !== null) {
      // Decode HTML entities and add to transcript
      const text = match2[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      transcript += text + ' ';
    }

    // Clean up the transcript
    transcript = transcript
      .replace(/\[.*?\]/g, '') // Remove bracketed content
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/(\w)\s+([.,!?])/g, '$1$2') // Fix spacing around punctuation
      .replace(/[^\w\s.,!?'-]/g, '') // Remove special characters except basic punctuation
      .replace(/(\w)'(\w)/g, '$1$2') // Remove apostrophes between words
      .replace(/\s+/g, ' ') // Final whitespace cleanup
      .trim();

    // Validate transcript length
    const minWords = 200;
    const wordCount = transcript.split(/\s+/).length;

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
        transcript,
        wordCount
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (err) {
    console.error('Transcript fetch error:', err);

    return new Response(
      JSON.stringify({
        error: 'Failed to fetch transcript',
        details: 'An unexpected error occurred while fetching the transcript. Please try again later.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});