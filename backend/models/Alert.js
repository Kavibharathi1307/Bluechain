import mongoose from 'mongoose'

const alertSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  severity: { type: String, enum: ['critical', 'high', 'medium', 'low', 'info'] },
  category: { type: String, enum: ['water quality', 'erosion', 'deforestation', 'biodiversity', 'weather'] },
  title: String,
  siteId: { type: String, index: true },
  siteName: String,
  detail: String,
  timestamp: String,
  verified: { type: Boolean, default: false },
}, { timestamps: true })

alertSchema.index({ id: 1 }, { unique: true })
alertSchema.index({ siteId: 1 })

export default mongoose.model('Alert', alertSchema)
