import mongoose from 'mongoose'

const auditRecordSchema = new mongoose.Schema({
  recordId: { type: String, required: true, unique: true },
  projectId: { type: String, required: true, index: true },
  evidenceId: String,
  verificationStatus: { type: String, enum: ['verified', 'pending', 'rejected'] },
  timestamp: String,
  previousHash: String,
  currentHash: String,
  verifier: String,
}, { timestamps: true })

auditRecordSchema.index({ recordId: 1 }, { unique: true })
auditRecordSchema.index({ projectId: 1 })

export default mongoose.model('AuditRecord', auditRecordSchema)
