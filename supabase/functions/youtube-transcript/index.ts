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
    const { videoId, lang = "en" } = await req.json();
    if (!videoId) throw new Error("Missing videoId");

    const ytRes = await fetch(
      `https://www.youtube.com/api/timedtext?` +
      new URLSearchParams({ v: videoId, lang, fmt: "json3" })
    );
    if (!ytRes.ok) throw new Error(`YouTube API request failed with status ${ytRes.status}`);

    const data = await ytRes.json();
    if (!data || !data.events || data.events.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No transcript available',
          details: 'This video does not have captions enabled. Please try a different video that has captions or subtitles available.'
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Combine all transcript segments into a single text
    const fullTranscript = data.events
      .map((e: any) => e.segs.map((s: any) => s.utf8).join(""))
      .join(" ")
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

  } catch (err: any) {
    console.error("Transcript fetch error:", err);
    
    // Standardize error response structure with safe error messages
    const errorResponse = {
      error: 'Failed to fetch transcript',
      details: 'An unexpected error occurred while fetching the transcript. Please try again later.',
      code: err.message === 'Missing videoId' ? 'MISSING_VIDEO_ID' : 'FETCH_ERROR'
    };

    return new Response(
      JSON.stringify(errorResponse),
      { 
        status: err.message === 'Missing videoId' ? 400 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});