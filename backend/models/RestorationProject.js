import mongoose from 'mongoose'

const timelinePhaseSchema = new mongoose.Schema({
  id: String,
  label: String,
  status: { type: String, enum: ['completed', 'in-progress', 'planned'] },
  date: String,
  detail: String,
}, { _id: false })

const activityItemSchema = new mongoose.Schema({
  id: String,
  type: { type: String, enum: ['verification', 'planting', 'survey', 'alert', 'maintenance'] },
  title: String,
  detail: String,
  timestamp: String,
  actor: String,
}, { _id: false })

const geoPointSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
}, { _id: false })

const restorationProjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  region: String,
  state: String,
  areaHa: Number,
  ecosystem: { type: String, enum: ['Mangroves', 'Coral Reef', 'Wetland', 'Estuary', 'Seagrass'] },
  healthScore: Number,
  healthStatus: { type: String, enum: ['excellent', 'good', 'moderate', 'at-risk'] },
  status: { type: String, enum: ['Active', 'Monitoring', 'At Risk'] },
  vegetationCover: Number,
  speciesCount: Number,
  carbonSequestered: Number,
  progress: Number,
  lastVerified: String,
  description: String,
  riskLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
  verificationStatus: { type: String, enum: ['verified', 'pending', 'in-review'] },
  plantsReported: Number,
  estimatedSurvival: Number,
  coordinates: geoPointSchema,
  startDate: String,
  projectManager: String,
  phases: [timelinePhaseSchema],
  recentActivity: [activityItemSchema],
}, { timestamps: true })

restorationProjectSchema.index({ id: 1 }, { unique: true })

export default mongoose.model('RestorationProject', restorationProjectSchema)
