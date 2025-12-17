// Hugging Face API client using fetch (no deprecated HfInference)

function getApiKey(): string {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY must be set in environment variables');
  }
  return apiKey;
}

// Function to query Hugging Face models using fetch
export async function queryHuggingFaceModel(
  model: string,
  inputs: string,
  parameters?: {
    max_new_tokens?: number;
    temperature?: number;
    top_p?: number;
    do_sample?: boolean;
    return_full_text?: boolean;
  }
) {
  // Use Router API hf-inference endpoint
  const url = `https://router.huggingface.co/hf-inference/models/${model}`;
  const apiKey = getApiKey();
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      inputs: inputs,
      parameters: parameters || {},
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return result;
}

// Helper function for google/flan-t5-base (text-to-text model)
export async function queryFlanT5Base(
  prompt: string,
  maxLength: number = 200
) {
  const result = await queryHuggingFaceModel(
    'google/flan-t5-base',
    prompt,
    {
      max_new_tokens: maxLength,
      temperature: 0.7,
      do_sample: true,
    }
  );
  
  // flan-t5-base returns an array with generated_text
  if (Array.isArray(result) && result[0]?.generated_text) {
    return result[0].generated_text;
  }
  if (result.generated_text) {
    return result.generated_text;
  }
  return result[0]?.generated_text || '';
}

// Helper function for tiiuae/falcon-7b-instruct (text generation model)
export async function queryFalcon7B(
  prompt: string,
  maxTokens: number = 200
) {
  const result = await queryHuggingFaceModel(
    'tiiuae/falcon-7b-instruct',
    prompt,
    {
      max_new_tokens: maxTokens,
      temperature: 0.7,
      top_p: 0.9,
      do_sample: true,
      return_full_text: false,
    }
  );
  
  // falcon returns generated_text directly or in an array
  if (Array.isArray(result) && result[0]?.generated_text) {
    return result[0].generated_text;
  }
  if (result.generated_text) {
    return result.generated_text;
  }
  return result[0]?.generated_text || '';
}
