import { Router } from 'express'
import Evidence from '../models/Evidence.js'
import RestorationProject from '../models/RestorationProject.js'
import AuditRecord from '../models/AuditRecord.js'
import { optionalAuth } from '../middleware/auth.js'
import { createHash } from '../lib/hash.js'

const router = Router()
const GPS_BOUND = 0.5

// GET /api/evidence/project/:projectId
router.get('/project/:projectId', optionalAuth, async (req, res) => {
  try {
    const evidence = await Evidence.find({ projectId: req.params.projectId }).sort({ submittedAt: 1 })
    res.json(evidence)
  } catch (err) {
    console.error('Fetch evidence error:', err)
    res.status(500).json({ error: 'Failed to fetch evidence' })
  }
})

// POST /api/evidence
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { projectId, photoUrl, latitude, longitude, capturedAt, notes, submittedBy } = req.body

    if (!projectId || !photoUrl || !capturedAt || !notes) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // GPS validation
    const project = await RestorationProject.findOne({ id: projectId })
    const validationReasons = []

    if (project) {
      const { lat: cLat, lng: cLng } = project.coordinates
      if (
        latitude < cLat - GPS_BOUND || latitude > cLat + GPS_BOUND ||
        longitude < cLng - GPS_BOUND || longitude > cLng + GPS_BOUND
      ) {
        validationReasons.push('GPS location is outside the registered project area.')
      }
    }

    // Duplicate check
    const recentEvidence = await Evidence.find({
      projectId,
      capturedAt: {
        $gte: new Date(new Date(capturedAt).getTime() - 24 * 60 * 60 * 1000).toISOString(),
        $lte: new Date(new Date(capturedAt).getTime() + 24 * 60 * 60 * 1000).toISOString(),
      },
    })

    const DIST_THRESHOLD = 0.05
    for (const existing of recentEvidence) {
      const dist = Math.abs(latitude - existing.latitude) + Math.abs(longitude - existing.longitude)
      if (dist < DIST_THRESHOLD) {
        validationReasons.push(`Duplicate evidence: similar GPS location and date as ${existing.id}.`)
      }
    }

    const status = validationReasons.length > 0 ? 'needs-review' : 'verified'

    // Generate ID
    const count = await Evidence.countDocuments()
    const id = `EV-${String(count + 1).padStart(3, '0')}`
    const now = new Date().toISOString()

    const evidence = await Evidence.create({
      id,
      projectId,
      photoUrl,
      latitude,
      longitude,
      capturedAt,
      submittedBy: submittedBy || 'Unknown',
      notes,
      status,
      validationReasons,
      submittedAt: now,
    })

    // If verified, create audit record
    if (status === 'verified') {
      const lastRecord = await AuditRecord.findOne().sort({ createdAt: 1 }).limit(1)
      const previousHash = lastRecord ? lastRecord.currentHash : '0000000000000000000000000000000000000000000000000000000000000000'
      const auditCount = await AuditRecord.countDocuments()
      const recordId = `AR-${String(auditCount + 1).padStart(3, '0')}`
      const verifier = project?.projectManager || 'Verification Board'
      const auditTimestamp = new Date(Date.now() + 15 * 60 * 1000).toISOString()

      const currentHash = await createHash(
        [recordId, projectId, id, status, auditTimestamp, previousHash, verifier].join('|'),
      )

      await AuditRecord.create({
        recordId,
        projectId,
        evidenceId: id,
        verificationStatus: status,
        timestamp: auditTimestamp,
        previousHash,
        currentHash,
        verifier,
      })
    }

    res.status(201).json(evidence)
  } catch (err) {
    console.error('Submit evidence error:', err)
    res.status(500).json({ error: 'Failed to submit evidence' })
  }
})

export default router
