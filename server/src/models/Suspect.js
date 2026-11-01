import mongoose from 'mongoose';
const suspectSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true, index: true }, suspectId: { type: String, required: true },
  name: { type: String, required: true }, age: Number, occupation: String, relationship: String, background: String, motive: String, alibi: String,
  imageUrl: { type: String, default: '' }, isCulprit: { type: Boolean, default: false, select: false }
}, { timestamps: true });
suspectSchema.index({ caseId: 1, suspectId: 1 }, { unique: true });
export default mongoose.model('Suspect', suspectSchema);
