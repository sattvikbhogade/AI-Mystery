import mongoose from 'mongoose';
const jobSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true, index: true }, status: { type: String, enum: ['queued','processing','completed','failed'], default: 'queued' },
  currentStage: { type: String, default: 'queued' }, progress: { type: Number, default: 0 }, error: { type: String, default: null }, errorCode: { type: String, default: null }
}, { timestamps: true });
export default mongoose.model('GenerationJob', jobSchema);
