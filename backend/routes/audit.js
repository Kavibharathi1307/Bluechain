import { Router } from 'express'
import AuditRecord from '../models/AuditRecord.js'
import { optionalAuth } from '../middleware/auth.js'
import { verifyChain } from '../lib/hash.js'

const router = Router()

// GET /api/audit
router.get('/', optionalAuth, async (req, res) => {
  try {
    const records = await AuditRecord.find().sort({ timestamp: 1 })
    res.json(records)
  } catch (err) {
    console.error('Fetch audit records error:', err)
    res.status(500).json({ error: 'Failed to fetch audit records' })
  }
})

// GET /api/audit/project/:projectId
router.get('/project/:projectId', optionalAuth, async (req, res) => {
  try {
    const records = await AuditRecord.find({ projectId: req.params.projectId }).sort({ timestamp: 1 })
    res.json(records)
  } catch (err) {
    console.error('Fetch project audit error:', err)
    res.status(500).json({ error: 'Failed to fetch audit records' })
  }
})

// GET /api/audit/:recordId
router.get('/:recordId', optionalAuth, async (req, res) => {
  try {
    const record = await AuditRecord.findOne({ recordId: req.params.recordId })
    if (!record) return res.status(404).json({ error: 'Record not found' })
    res.json(record)
  } catch (err) {
    console.error('Fetch audit record error:', err)
    res.status(500).json({ error: 'Failed to fetch audit record' })
  }
})

// GET /api/audit/verify/integrity
router.get('/verify/integrity', optionalAuth, async (req, res) => {
  try {
    const records = await AuditRecord.find().sort({ timestamp: 1 })
    const result = await verifyChain(records)
    res.json(result)
  } catch (err) {
    console.error('Verify chain error:', err)
    res.status(500).json({ error: 'Failed to verify chain' })
  }
})

export default router
