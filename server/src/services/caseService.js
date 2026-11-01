import Case from '../models/Case.js';
import Suspect from '../models/Suspect.js';
import Evidence from '../models/Evidence.js';
import GenerationJob from '../models/GenerationJob.js';
import Accusation from '../models/Accusation.js';
import { generateBlueprint, generateEvidence, GeminiRequestError } from './ai/gemini.js';

const levels = { easy: 3, medium: 4, hard: 5 };
const evidenceCounts = { easy: [5,7], medium: [8,10], hard: [11,14] };
async function progress(job, currentStage, value) { job.currentStage = currentStage; job.progress = value; await job.save(); }
export async function createCase({ ownerId, scenario, category, difficulty }) {
  const active = await Case.findOne({ ownerId, scenario, generationStatus: { $in: ['queued','processing'] } });
  if (active) return active;
  const caseCode = `MR-${new Date().getFullYear()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
  const item = await Case.create({ ownerId, scenario, category, difficulty, caseCode, title: 'New investigation', status: 'generating', generationStatus: 'queued' });
  const job = await GenerationJob.create({ caseId: item._id });
  runGeneration(item, job).catch(async error => {
    console.error('Case generation failed:', error.message);
    const code = error.code || 'CASE_GENERATION_FAILED';
    const message = error instanceof GeminiRequestError ? error.message : 'The generated case failed validation. Please try again.';
    await Promise.all([
      Suspect.deleteMany({ caseId: item._id }),
      Evidence.deleteMany({ caseId: item._id }),
      Case.updateOne({ _id: item._id }, { status: 'failed', generationStatus: 'failed', generationError: message }),
      GenerationJob.updateOne({ _id: job._id }, { status: 'failed', currentStage: 'failed', error: message, errorCode: code })
    ]);
  });
  return item;
}
async function runGeneration(item, job) {
  job.status = 'processing'; await progress(job, 'building_blueprint', 10);
  const blueprint = await generateBlueprint(item);
  if (blueprint.suspects.length !== levels[item.difficulty] || blueprint.suspects.filter(s => s.isCulprit).length !== 1 || !blueprint.suspects.some(s => s.suspectId === blueprint.culpritSuspectId && s.isCulprit)) throw new Error('The generated suspect list failed consistency checks. Please retry.');
  await progress(job, 'generating_evidence', 55);
  const evidenceData = await generateEvidence({ scenario: item.scenario, blueprint, difficulty: item.difficulty });
  const [minimumEvidence, maximumEvidence] = evidenceCounts[item.difficulty];
  if (evidenceData.evidence.length < minimumEvidence || evidenceData.evidence.length > maximumEvidence) throw new Error('The generated evidence count did not match the selected difficulty. Please retry.');
  const suspectIds = new Set(blueprint.suspects.map(s => s.suspectId)); const seenEvidence = new Set();
  for (const clue of evidenceData.evidence) {
    if (seenEvidence.has(clue.evidenceId) || clue.relatedSuspectIds.some(id => !suspectIds.has(id))) throw new Error('Evidence references inconsistent case details. Please retry.');
    seenEvidence.add(clue.evidenceId);
  }
  const critical = evidenceData.evidence.filter(e => e.isCritical);
  const culpritClues = critical.filter(e => e.relatedSuspectIds.includes(blueprint.culpritSuspectId));
  if (culpritClues.length < 2 || new Set(culpritClues.map(e => e.type)).size < 2) throw new Error('The evidence did not provide enough independent critical clues. Please retry.');
  await progress(job, 'saving_case', 90);
  item.title = blueprint.title;
  item.publicData = { description: blueprint.description, victim: blueprint.victim || null, location: blueprint.location, incidentDate: new Date(blueprint.incidentDate), initialReport: blueprint.description };
  item.privateSolution = { culpritSuspectId: blueprint.culpritSuspectId, motive: blueprint.motive, method: blueprint.method, explanation: blueprint.explanation, redHerrings: blueprint.redHerrings };
  item.timeline = blueprint.timeline; await item.save();
  await Suspect.insertMany(blueprint.suspects.map(({ isCulprit, ...s }) => ({ ...s, isCulprit, caseId: item._id })));
  await Evidence.insertMany(evidenceData.evidence.map(e => ({ ...e, caseId: item._id, timestamp: e.timestamp ? new Date(e.timestamp) : null })));
  item.status = 'ready'; item.generationStatus = 'completed'; await item.save();
  job.status = 'completed'; job.error = null; job.errorCode = null; await progress(job, 'completed', 100);
}
export async function getJob(caseId) { return GenerationJob.findOne({ caseId }).lean(); }
export async function submitAccusation({ item, ownerId, selectedSuspectId, reasoning }) {
  const exists = await Accusation.findOne({ caseId: item._id });
  if (exists) { const error = new Error('An accusation has already been submitted for this case.'); error.status = 409; throw error; }
  const suspect = await Suspect.findOne({ caseId: item._id, suspectId: selectedSuspectId });
  if (!suspect) { const error = new Error('Choose a suspect from this case.'); error.status = 400; throw error; }
  const isCorrect = selectedSuspectId === item.privateSolution.culpritSuspectId;
  await Accusation.create({ caseId: item._id, ownerId, selectedSuspectId, reasoning, isCorrect });
  item.status = 'completed'; await item.save();
  const culprit = await Suspect.findOne({ caseId: item._id, suspectId: item.privateSolution.culpritSuspectId }).select('+isCulprit').lean();
  return { isCorrect, selectedSuspect: { suspectId: suspect.suspectId, name: suspect.name }, culprit: { suspectId: culprit.suspectId, name: culprit.name, occupation: culprit.occupation }, solution: item.privateSolution };
}
