import mongoose from 'mongoose';
const accusationSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true, unique: true }, ownerId: { type: String, required: true },
  selectedSuspectId: { type: String, required: true }, reasoning: { type: String, maxlength: 1000, default: '' }, isCorrect: { type: Boolean, required: true }, submittedAt: { type: Date, default: Date.now }
});
export default mongoose.model('Accusation', accusationSchema);
