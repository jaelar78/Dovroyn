import { createHash } from 'node:crypto';

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';

export function createSafetyIdentifier(userId) {
  const digest = createHash('sha256').update(String(userId || 'anonymous')).digest('hex').slice(0, 48);
  return `dovroyn_${digest}`;
}

export async function createOpenAIResponse(body) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('dovroyn_openai_failure', { category: 'missing_api_key' });
    const error = new Error('OPENAI_API_KEY is not configured.');
    error.code = 'missing_api_key';
    throw error;
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ store: false, ...body }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload?.error?.message || 'OpenAI request failed.');
    error.status = response.status;
    error.code = payload?.error?.code || 'openai_request_failed';
    error.type = payload?.error?.type || 'openai_error';
    console.error('dovroyn_openai_failure', {
      category: 'provider_error',
      status: error.status,
      code: error.code,
      type: error.type,
    });
    throw error;
  }
  return payload;
}

export function extractOutputText(response) {
  if (typeof response?.output_text === 'string') return response.output_text;
  for (const item of response?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === 'string') return content.text;
    }
  }
  throw new Error('The model returned no text output.');
}
