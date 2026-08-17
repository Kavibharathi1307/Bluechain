import { Router } from 'express'
import Alert from '../models/Alert.js'
import { optionalAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/alerts
router.get('/', optionalAuth, async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ id: -1 })
    res.json(alerts)
  } catch (err) {
    console.error('Fetch alerts error:', err)
    res.status(500).json({ error: 'Failed to fetch alerts' })
  }
})

// GET /api/alerts/project/:projectId
router.get('/project/:projectId', optionalAuth, async (req, res) => {
  try {
    const alerts = await Alert.find({ siteId: req.params.projectId })
    res.json(alerts)
  } catch (err) {
    console.error('Fetch project alerts error:', err)
    res.status(500).json({ error: 'Failed to fetch alerts' })
  }
})

export default router
