import { Router } from 'express'
import RestorationProject from '../models/RestorationProject.js'
import { optionalAuth, authMiddleware } from '../middleware/auth.js'

const router = Router()

// GET /api/projects
router.get('/', optionalAuth, async (req, res) => {
  try {
    const projects = await RestorationProject.find().sort({ id: 1 })
    res.json(projects)
  } catch (err) {
    console.error('Fetch projects error:', err)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// GET /api/projects/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const project = await RestorationProject.findOne({ id: req.params.id })
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json(project)
  } catch (err) {
    console.error('Fetch project error:', err)
    res.status(500).json({ error: 'Failed to fetch project' })
  }
})

// POST /api/projects
router.post('/', authMiddleware, async (req, res) => {
  try {
    const project = await RestorationProject.create(req.body)
    res.status(201).json(project)
  } catch (err) {
    console.error('Create project error:', err)
    res.status(500).json({ error: 'Failed to create project' })
  }
})

// PUT /api/projects/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await RestorationProject.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true },
    )
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json(project)
  } catch (err) {
    console.error('Update project error:', err)
    res.status(500).json({ error: 'Failed to update project' })
  }
})

export default router
