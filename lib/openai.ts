import OpenAI from 'openai';

let openaiInstance: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiInstance;
}

// Use a getter to make it lazy - only initializes when accessed
export const openai = new Proxy({} as OpenAI, {
  get(_target, prop) {
    const instance = getOpenAI();
    const value = instance[prop as keyof OpenAI];
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});

export default openai; 