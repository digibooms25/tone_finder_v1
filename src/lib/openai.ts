import OpenAI from 'openai';

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!openaiApiKey) {
  console.error('OpenAI API key is not set in environment variables');
  throw new Error('OpenAI API key is required');
}

export const openai = new OpenAI({
  apiKey: openaiApiKey,
  dangerouslyAllowBrowser: true, // Note: In production, API calls should be made from a backend
});

export const scoreFreeTextResponse = async (
  text: string,
  context?: { previousAnswers?: Record<string, string | string[]> }
): Promise<{
  formality: number;
  brevity: number;
  humor: number;
  warmth: number;
  directness: number;
  expressiveness: number;
}> => {
  if (!text.trim()) {
    throw new Error('Text is required for scoring');
  }

  const defaultScores = {
    formality: 0,
    brevity: 0,
    humor: 0,
    warmth: 0,
    directness: 0,
    expressiveness: 0,
  };

  try {
    const systemPrompt = `You are an expert at analyzing writing style and tone. Analyze the following text for these traits:

1. Formality (-1 very casual to +1 very formal)
   - Consider: greeting style, word choice, punctuation, contractions
   - Example casual: "Hey! What's up?"
   - Example formal: "Dear Sir/Madam,"

2. Brevity (-1 verbose to +1 concise)
   - Consider: sentence length, redundancy, use of modifiers
   - Example verbose: "I would like to take this opportunity to express my sincere gratitude"
   - Example concise: "Thank you"

3. Humor (-1 serious to +1 playful)
   - Consider: wordplay, emojis, informal expressions
   - Example serious: "The project deadline is approaching"
   - Example playful: "Time to slay this deadline! 💪"

4. Warmth (-1 detached to +1 warm)
   - Consider: empathy, personal connection, encouraging language
   - Example detached: "Your request has been processed"
   - Example warm: "I understand how you feel, and I'm here to help"

5. Directness (-1 indirect to +1 direct)
   - Consider: passive vs active voice, hedging language
   - Example indirect: "It might be worth considering..."
   - Example direct: "Do this"

6. Expressiveness (-1 reserved to +1 expressive)
   - Consider: emotion, emphasis, punctuation variety
   - Example reserved: "The results were positive"
   - Example expressive: "The results were incredible!!!"

Score each trait from -1 to +1, where:
-1 = strongly exhibits the negative trait
0 = neutral or balanced
+1 = strongly exhibits the positive trait

You must respond with ONLY a JSON object containing numeric scores between -1 and 1 for each trait. Example:
{
  "formality": 0.5,
  "brevity": -0.3,
  "humor": 0.8,
  "warmth": 0.2,
  "directness": -0.4,
  "expressiveness": 0.6
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: text
        }
      ]
    });

    const content = response.choices[0]?.message.content;
    if (!content) {
      console.error('Empty response from OpenAI');
      return defaultScores;
    }

    let scores;
    try {
      scores = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      return defaultScores;
    }
    
    // Validate and normalize scores
    const traits = ['formality', 'brevity', 'humor', 'warmth', 'directness', 'expressiveness'];
    const normalizedScores = { ...defaultScores };

    for (const trait of traits) {
      const score = scores[trait];
      if (typeof score === 'number' && !isNaN(score)) {
        normalizedScores[trait as keyof typeof defaultScores] = Math.max(-1, Math.min(1, score));
      } else {
        console.error(`Invalid score for ${trait}:`, score);
      }
    }

    return normalizedScores;
  } catch (error) {
    console.error('Error scoring free text:', error);
    return defaultScores;
  }
};

export const generateToneSummary = async (
  traits: {
    formality: number;
    brevity: number;
    humor: number;
    warmth: number;
    directness: number;
    expressiveness: number;
  }
): Promise<{ title: string; summary: string; prompt: string }> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert at analyzing writing styles and creating personalized tone descriptions. Based on the provided trait scores, generate three components:

1. A unique, creative title that captures the essence of this writing style
   - Should be descriptive and memorable
   - Format: "The [Adjective] [Noun]" where noun could be Communicator/Voice/Writer/etc.
   - Examples: "The Empathetic Storyteller", "The Strategic Diplomat", "The Dynamic Innovator"
   - NEVER use generic titles like "Your Writing Style Analysis"

2. A friendly, conversational summary that:
   - Explains how their traits work together
   - Highlights unique combinations
   - Suggests where this style works best
   - Uses natural, engaging language

3. A clear, specific prompt for AI writing assistants that:
   - Starts with "Write in a tone that is..."
   - Describes key characteristics
   - Provides specific examples or comparisons
   - Keeps it detailed but concise

Respond with a JSON object containing "title", "summary", and "prompt" keys.`
        },
        {
          role: 'user',
          content: JSON.stringify(traits)
        }
      ],
      temperature: 0.8
    });

    const content = response.choices[0]?.message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const result = JSON.parse(content);
    
    // Validate response format
    if (!result.title || !result.summary || !result.prompt) {
      throw new Error('Invalid response format from OpenAI');
    }
    
    // Ensure we never return a generic title
    if (result.title === 'Your Writing Style Analysis') {
      result.title = 'The Balanced Communicator';
    }

    return result;
  } catch (error) {
    console.error('Error generating tone summary:', error);
    throw error;
  }
};

export const generateToneExamples = async (
  traits: {
    formality: number;
    brevity: number;
    humor: number;
    warmth: number;
    directness: number;
    expressiveness: number;
  }
): Promise<string[]> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert at writing in different tones. Create three examples that demonstrate the given trait scores in different contexts:

1. A professional email to a colleague
2. A social media post about a personal achievement
3. A customer service response to a complaint

Consider trait interactions:
- How formality balances with warmth
- How humor works with professionalism
- How directness combines with expressiveness

Each example should:
- Be 3-5 sentences
- Naturally incorporate the tone
- Feel authentic to the context
- Demonstrate trait combinations

Respond with a JSON object containing an "examples" array with three strings.`
        },
        {
          role: 'user',
          content: JSON.stringify(traits)
        }
      ],
      temperature: 0.7
    });

    const content = response.choices[0]?.message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const result = JSON.parse(content);
    
    // Validate response format
    if (!Array.isArray(result.examples) || result.examples.length !== 3) {
      throw new Error('Invalid examples format from OpenAI');
    }

    return result.examples;
  } catch (error) {
    console.error('Error generating tone examples:', error);
    throw error;
  }
};