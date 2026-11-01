import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({ time: String, title: String, description: String }, { _id: false });
const caseSchema = new mongoose.Schema({
  caseCode: { type: String, unique: true, index: true }, ownerId: { type: String, required: true, index: true },
  title: { type: String, required: true }, scenario: { type: String, required: true }, category: { type: String, required: true },
  difficulty: { type: String, required: true }, status: { type: String, enum: ['generating','ready','completed','failed'], default: 'generating' },
  generationStatus: { type: String, enum: ['queued','processing','completed','failed'], default: 'queued' },
  publicData: { description: String, victim: mongoose.Schema.Types.Mixed, location: String, incidentDate: Date, initialReport: String },
  privateSolution: { culpritSuspectId: String, motive: String, method: String, explanation: String, redHerrings: String },
  timeline: [timelineSchema], generationError: { type: String, select: false }
}, { timestamps: true });
export default mongoose.model('Case', caseSchema);
