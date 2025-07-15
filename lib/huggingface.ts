import { HfInference } from '@huggingface/inference';

if (!process.env.HUGGINGFACE_API_KEY) {
  throw new Error('HUGGINGFACE_API_KEY is not set in environment variables');
}

export const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export default hf; 