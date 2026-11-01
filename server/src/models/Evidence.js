import mongoose from 'mongoose';
const evidenceSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true, index: true }, evidenceId: { type: String, required: true },
  type: { type: String, enum: ['whatsapp','image','cctv','document','witness_statement','report'], required: true }, title: String, description: String,
  content: { type: mongoose.Schema.Types.Mixed, default: {} }, mediaUrl: { type: String, default: null }, timestamp: Date, relatedSuspectIds: [String],
  isCritical: { type: Boolean, default: false, select: false }, clueExplanation: { type: String, default: '', select: false }
}, { timestamps: true });
evidenceSchema.index({ caseId: 1, evidenceId: 1 }, { unique: true });
export default mongoose.model('Evidence', evidenceSchema);
