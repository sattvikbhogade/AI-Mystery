import { GoogleGenAI } from '@google/genai';
import { blueprintSchema, evidenceSchema } from '../../validators/case.js';

function client() {
  if (!process.env.GEMINI_API_KEY) throw new Error('Case generation is not configured. Add GEMINI_API_KEY to the server environment.');
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}
function parseJson(text) {
  return JSON.parse(text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''));
}
async function generateJson(prompt, schema, attempts = 2) {
  let issue = '';
  for (let i = 0; i < attempts; i += 1) {
    const response = await client().models.generateContent({
      model: process.env.GEMINI_TEXT_MODEL || 'gemini-3.8-flash',
      contents: `${prompt}\n\n${issue ? `Previous response had validation error: ${issue}. Return corrected JSON only.\n` : ''}Return only valid JSON.`,
      config: { responseMimeType: 'application/json', temperature: 0.75 }
    });
    try { return schema.parse(parseJson(response.text || '')); }
    catch (error) { issue = error.issues ? error.issues.map(x => `${x.path.join('.')}: ${x.message}`).join('; ') : error.message; }
  }
  throw new Error('The generated case did not pass validation. Please retry.');
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
