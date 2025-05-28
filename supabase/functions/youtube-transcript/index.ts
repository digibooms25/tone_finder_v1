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
    if (!ytRes.ok) throw new Error(`YouTube returned ${ytRes.status}`);

    const { events } = await ytRes.json();
    if (!events || events.length === 0) {
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
    const fullTranscript = events
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
    
    if (err.message?.includes('Missing videoId')) {
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

    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch transcript',
        details: 'An unexpected error occurred while fetching the transcript. Please try again later.',
        message: err.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});