import { GoogleGenAI } from '@google/genai';
import { blueprintSchema, evidenceSchema } from '../../validators/case.js';

const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [1000, 2000, 4000];

export class GeminiRequestError extends Error {
  constructor(message, code, status = null) {
    super(message);
    this.name = 'GeminiRequestError';
    this.code = code;
    this.status = status;
  }
}

function client() {
  if (!process.env.GEMINI_API_KEY) throw new GeminiRequestError('Gemini API key is not configured.', 'GEMINI_AUTH', 401);
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    // Retries are handled below so each API request has a single, observable attempt.
    httpOptions: { timeout: 90000, retryOptions: { attempts: 1 } }
  });
}

function errorDetail(error) {
  return String(error?.message || 'Unknown Gemini API error').slice(0, 1000);
}

export function extractGeminiStatus(error) {
  const candidates = [error?.status, error?.statusCode, error?.response?.status, error?.response?.statusCode];
  for (const candidate of candidates) {
    const status = Number(candidate);
    if (Number.isInteger(status) && status >= 100 && status <= 599) return status;
  }
  const detail = errorDetail(error);
  if (/too many requests|resource_exhausted/i.test(detail)) return 429;
  if (/service unavailable/i.test(detail)) return 503;
  if (/internal server error/i.test(detail)) return 500;
  if (/gateway timeout/i.test(detail)) return 504;
  const match = detail.match(/(?:HTTP(?:\s+status)?|status(?:\s+code)?|code)\D{0,12}(4\d\d|5\d\d)/i);
  return match ? Number(match[1]) : null;
}

function errorCode(error, status) {
  const code = String(error?.error?.status || error?.statusText || error?.code || '').toUpperCase();
  if (status === 429 || code.includes('RESOURCE_EXHAUSTED')) return 'GEMINI_RATE_LIMIT';
  if (status === 401 || status === 403 || code.includes('UNAUTHENTICATED') || code.includes('PERMISSION_DENIED')) return 'GEMINI_AUTH';
  if (status === 503 || status === 500 || status === 504 || status === null) return 'GEMINI_UNAVAILABLE';
  return 'GEMINI_REQUEST_FAILED';
}

function isTemporaryNetworkError(error) {
  const code = String(error?.code || error?.cause?.code || '').toUpperCase();
  return ['ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN', 'ECONNREFUSED', 'ENETUNREACH', 'EHOSTUNREACH', 'UND_ERR_CONNECT_TIMEOUT', 'UND_ERR_SOCKET'].includes(code)
    || error?.name === 'AbortError'
    || /temporary network|fetch failed|network error|timed? ?out|operation was aborted/i.test(errorDetail(error));
}

function retryable(error, status) {
  return [429, 500, 503].includes(status) || isTemporaryNetworkError(error);
}

function safeMessage(code) {
  if (code === 'GEMINI_RATE_LIMIT') return 'The API request limit was reached. Please wait before trying again.';
  if (code === 'GEMINI_AUTH') return 'There is a Gemini API configuration or permission issue. Check the server API key and model access.';
  if (code === 'GEMINI_UNAVAILABLE') return 'Gemini is temporarily unavailable. Please try again shortly.';
  return 'Gemini could not generate this case. Please try again.';
}

function logFailure(error, model, attempt) {
  const status = extractGeminiStatus(error);
  const detail = errorDetail(error).replaceAll(process.env.GEMINI_API_KEY || '\0', '[redacted]');
  console.error('[Gemini] generateContent failed', {
    model,
    status: status ?? (isTemporaryNetworkError(error) ? 'NETWORK' : 'unknown'),
    geminiCode: error?.error?.status || error?.response?.data?.error?.status || error?.statusText || error?.code || null,
    attempt,
    maxAttempts: MAX_RETRIES + 1,
    message: detail
  });
  return status;
}

export async function requestWithGeminiRetry(operation, { model, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)), random = Math.random } = {}) {
  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      const status = logFailure(error, model, attempt);
      if (!retryable(error, status) || attempt > MAX_RETRIES) {
        const code = errorCode(error, status);
        throw new GeminiRequestError(safeMessage(code), code, status);
      }
      const baseDelay = RETRY_DELAYS_MS[attempt - 1];
      const jitteredDelay = Math.round(baseDelay * (0.8 + random() * 0.4));
      await sleep(jitteredDelay);
    }
  }
}

function parseJson(text) {
  return JSON.parse(text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''));
}

async function generateJson(prompt, schema, attempts = 2) {
  const model = process.env.GEMINI_TEXT_MODEL?.trim();
  if (!model) throw new Error('GEMINI_TEXT_MODEL must be set in server/.env.');
  const ai = client();
  let issue = '';
  for (let i = 0; i < attempts; i += 1) {
    const response = await requestWithGeminiRetry(() => ai.models.generateContent({
      model,
      contents: `${prompt}\n\n${issue ? `Previous response had validation error: ${issue}. Return corrected JSON only.\n` : ''}Return only valid JSON.`,
      config: { responseMimeType: 'application/json', thinkingConfig: { thinkingLevel: 'low' } }
    }), { model });
    try { return schema.parse(parseJson(response.text || '')); }
    catch (error) { issue = error.issues ? error.issues.map(x => `${x.path.join('.')}: ${x.message}`).join('; ') : error.message; }
  }
  throw new GeminiRequestError('The generated case failed validation. Please try generating another case.', 'INVALID_GENERATED_RESPONSE');
}

export async function generateBlueprint({ scenario, difficulty, category }) {
  const size = { easy: 'exactly 3 suspects and a concise simple timeline', medium: 'exactly 4 suspects and a layered timeline', hard: 'exactly 5 suspects and an intricate but fair timeline' }[difficulty];
  const prompt = `You are a mystery case architect. Create a solvable, fictional ${category} investigation from this premise: ${scenario}\nDifficulty: ${difficulty}; ${size}.\nRules: exactly one suspect has isCulprit true and their suspectId equals culpritSuspectId. Every suspect has a unique ID SUS-001 etc. One culprit only. All times are coherent and ISO 8601 with timezone. Use fictional adults, no real people. Keep actual method and full explanation private in these fields. At least two independent clues must be possible. Return fields title, description, location, incidentDate, victim (object or null), suspects, culpritSuspectId, motive, method, explanation, redHerrings, timeline.`;
  return generateJson(prompt, blueprintSchema);
}

export async function generateEvidence({ scenario, blueprint, difficulty }) {
  const count = { easy: '5 to 7', medium: '8 to 10', hard: '11 to 14' }[difficulty];
  const prompt = `Create ${count} pieces of playable fictional investigation evidence based ONLY on these approved facts. Original premise: ${scenario}\nBlueprint: ${JSON.stringify(blueprint)}\nEvery timestamp must be ISO 8601 and coherent. Evidence categories: whatsapp, image, cctv, document, witness_statement, report. Include at least two independent critical clues supporting culprit ${blueprint.culpritSuspectId}. Never reveal the culprit in public title or description. Red herrings need a logical private explanation. All relatedSuspectIds must be IDs from this list: ${blueprint.suspects.map(s=>s.suspectId).join(', ')}. For WhatsApp, content.messages is an array with sender, text, timestamp. For image/CCTV, content should be a visual description, not an invented generated image. Include unique evidence IDs EVD-001 etc, isCritical and private clueExplanation.`;
  return generateJson(prompt, evidenceSchema);
}
