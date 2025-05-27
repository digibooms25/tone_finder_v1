import OpenAI from 'openai';

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!openaiApiKey) {
  console.error('OpenAI API key is not set in environment variables');
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

Respond with ONLY a JSON object containing the scores.`;

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
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error scoring free text:', error);
    return {
      formality: 0,
      brevity: 0,
      humor: 0,
      warmth: 0,
      directness: 0,
      expressiveness: 0
    };
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
          content: `You are an expert at creating tone and style instructions. Based on the user's trait scores, generate:

1. A unique, personalized title that captures their writing style essence
   - Should be creative and specific to their traits
   - Format: "The [Adjective] [Communicator/Writer/Voice]" or similar pattern
   - Examples: 
     - "The Empathetic Storyteller"
     - "The Direct Problem-Solver"
     - "The Engaging Conversationalist"

2. A clear, specific prompt that will help AI writing assistants match their voice
   - Start with: "Write in a tone that is..."
   - Describe key characteristics
   - Provide specific examples or comparisons
   - Keep it detailed but concise (100-150 words)

3. A friendly, conversational summary that:
   - Highlights unique aspects of their tone
   - Explains how traits work together
   - Suggests where this tone would be effective

Respond with a JSON object containing "title", "summary", and "prompt" keys.`
        },
        {
          role: 'user',
          content: JSON.stringify(traits)
        }
      ]
    });

    const content = response.choices[0]?.message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating tone summary:', error);
    return {
      title: 'Your Writing Style Analysis',
      summary: 'We could not generate a summary of your tone at this time.',
      prompt: 'Write in a balanced, neutral tone.'
    };
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
      ]
    });

    const content = response.choices[0]?.message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(content).examples;
  } catch (error) {
    console.error('Error generating tone examples:', error);
    return [
      'This is an example of a professional email.',
      'This is an example of a social media post.',
      'This is an example of a customer service response.'
    ];
  }
};