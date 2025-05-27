import OpenAI from 'openai';

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!openaiApiKey) {
  throw new Error('OpenAI API key is required');
}

export const openai = new OpenAI({
  apiKey: openaiApiKey,
  dangerouslyAllowBrowser: true,
});

const defaultScores = {
  formality: 0,
  brevity: 0,
  humor: 0,
  warmth: 0,
  directness: 0,
  expressiveness: 0,
};

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithExponentialBackoff = async <T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    if (retries === 0 || !isRetryableError(error) || isQuotaError(error)) {
      throw error;
    }
    
    await sleep(delay);
    return retryWithExponentialBackoff(operation, retries - 1, delay * 2);
  }
};

const isRetryableError = (error: any) => {
  // Don't retry quota errors
  if (isQuotaError(error)) {
    return false;
  }
  
  return error?.status === 500 || 
    error?.status === 502 || 
    error?.status === 503 || 
    error?.status === 504;
};

export const scoreFreeTextResponse = async (text: string): Promise<typeof defaultScores> => {
  if (!text.trim()) {
    throw new Error('Text is required for scoring');
  }

  try {
    const response = await retryWithExponentialBackoff(async () => {
      return await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert at analyzing writing style and tone. Score the following text on these traits:
- Formality (-1 very casual to +1 very formal)
- Brevity (-1 verbose to +1 concise)
- Humor (-1 serious to +1 playful)
- Warmth (-1 detached to +1 warm)
- Directness (-1 indirect to +1 direct)
- Expressiveness (-1 reserved to +1 expressive)

Respond with ONLY a JSON object containing numeric scores between -1 and 1 for each trait.`
          },
          { role: 'user', content: text }
        ]
      });
    });

    const content = response.choices[0]?.message.content;
    if (!content) {
      return defaultScores;
    }

    const scores = JSON.parse(content);
    const normalizedScores = { ...defaultScores };

    Object.entries(scores).forEach(([trait, score]) => {
      if (trait in defaultScores && typeof score === 'number' && !isNaN(score)) {
        normalizedScores[trait as keyof typeof defaultScores] = Math.max(-1, Math.min(1, score));
      }
    });

    return normalizedScores;
  } catch (error) {
    console.error('Error scoring free text:', error);
    if (isQuotaError(error)) {
      throw new OpenAIQuotaError('OpenAI API quota exceeded. Please try again in a few minutes. If the problem persists, you may need to check your OpenAI API plan limits.');
    }
    return defaultScores;
  }
};

export class OpenAIQuotaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpenAIQuotaError';
  }
}

const isQuotaError = (error: any) => {
  // Check for both the status code and message content
  return (
    error?.status === 429 || 
    (error?.message && (
      error.message.toLowerCase().includes('quota') ||
      error.message.toLowerCase().includes('rate limit') ||
      error.message.toLowerCase().includes('capacity')
    )) ||
    (error?.error?.message && (
      error.error.message.toLowerCase().includes('quota') ||
      error.error.message.toLowerCase().includes('rate limit') ||
      error.error.message.toLowerCase().includes('capacity')
    ))
  );
};

export const generateToneSummary = async (traits: typeof defaultScores): Promise<{
  title: string;
  summary: string;
  prompt: string;
} | null> => {
  try {
    const response = await retryWithExponentialBackoff(async () => {
      return await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Create a writing style analysis with:
1. A unique title ("The [Adjective] [Noun]")
2. A friendly summary explaining trait combinations
3. A clear prompt starting with "Write in a tone that is..."

Respond with a JSON object containing "title", "summary", and "prompt" keys.`
          },
          { role: 'user', content: JSON.stringify(traits) }
        ],
        temperature: 0.8
      });
    });

    const content = response.choices[0]?.message.content;
    if (!content) {
      return null;
    }

    const result = JSON.parse(content);
    if (!result.title || !result.summary || !result.prompt) {
      return null;
    }

    return result;
  } catch (error) {
    console.error('Error generating tone summary:', error);
    if (isQuotaError(error)) {
      throw new OpenAIQuotaError('OpenAI API quota exceeded. Please try again in a few minutes. If the problem persists, you may need to check your OpenAI API plan limits.');
    }
    throw error;
  }
};

export const generateToneExamples = async (traits: typeof defaultScores): Promise<string[] | null> => {
  try {
    const response = await retryWithExponentialBackoff(async () => {
      return await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Create three examples (3-5 sentences each) demonstrating the given tone:
1. A professional email
2. A social media post
3. A customer service response

Respond with a JSON object containing an "examples" array with three strings.`
          },
          { role: 'user', content: JSON.stringify(traits) }
        ],
        temperature: 0.7
      });
    });

    const content = response.choices[0]?.message.content;
    if (!content) {
      return null;
    }

    const result = JSON.parse(content);
    if (!Array.isArray(result.examples) || result.examples.length !== 3) {
      return null;
    }

    return result.examples;
  } catch (error) {
    console.error('Error generating tone examples:', error);
    if (isQuotaError(error)) {
      throw new OpenAIQuotaError('OpenAI API quota exceeded. Please try again in a few minutes. If the problem persists, you may need to check your OpenAI API plan limits.');
    }
    throw error;
  }
};