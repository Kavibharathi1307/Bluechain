import mongoose from 'mongoose'

const evidenceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  projectId: { type: String, required: true, index: true },
  photoUrl: String,
  latitude: Number,
  longitude: Number,
  capturedAt: String,
  submittedBy: String,
  notes: String,
  status: { type: String, enum: ['verified', 'needs-review', 'rejected'], default: 'needs-review' },
  validationReasons: [String],
  submittedAt: { type: String, default: () => new Date().toISOString() },
}, { timestamps: true })

evidenceSchema.index({ id: 1 }, { unique: true })
evidenceSchema.index({ projectId: 1 })

export default mongoose.model('Evidence', evidenceSchema)
