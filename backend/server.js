import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js'
import evidenceRoutes from './routes/evidence.js'
import alertRoutes from './routes/alerts.js'
import auditRoutes from './routes/audit.js'
import impactRoutes from './routes/impact.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'], credentials: true }))
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/evidence', evidenceRoutes)
app.use('/api/alerts', alertRoutes)
app.use('/api/audit', auditRoutes)
app.use('/api/impact', impactRoutes)

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`BlueChain backend running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  })
