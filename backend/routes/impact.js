import { Router } from 'express'
import RestorationProject from '../models/RestorationProject.js'
import Evidence from '../models/Evidence.js'
import Alert from '../models/Alert.js'
import { optionalAuth } from '../middleware/auth.js'

const router = Router()

const PROGRESS_OFFSETS = {
  'SR-001': 8, 'SR-002': -3, 'SR-003': -7, 'SR-004': -12, 'SR-005': 5, 'SR-006': -2,
}

const HISTORY = {
  'SR-001': { initial: 62, previous: 82, target: 92, targetHealth: 88 },
  'SR-002': { initial: 50, previous: 75, target: 82, targetHealth: 82 },
  'SR-003': { initial: 45, previous: 62, target: 75, targetHealth: 78 },
  'SR-004': { initial: 55, previous: 61, target: 70, targetHealth: 72 },
  'SR-005': { initial: 48, previous: 74, target: 88, targetHealth: 85 },
  'SR-006': { initial: 42, previous: 68, target: 80, targetHealth: 80 },
}

// GET /api/impact
router.get('/', optionalAuth, async (req, res) => {
  try {
    const projects = await RestorationProject.find().sort({ id: 1 })
    const totalRestorationArea = projects.reduce((sum, p) => sum + (p.areaHa || 0), 0)
    const totalPlantsReported = projects.reduce((sum, p) => sum + (p.plantsReported || 0), 0)
    const estimatedSurvivingPlants = projects.reduce(
      (sum, p) => sum + Math.round((p.plantsReported || 0) * ((p.estimatedSurvival || 0) / 100)),
      0,
    )
    const averageHealthScore = projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + (p.healthScore || 0), 0) / projects.length)
      : 0
    const projectsImproving = projects.filter(p => {
      const h = HISTORY[p.id]
      return h ? p.vegetationCover > h.previous : false
    }).length
    const projectsDeclining = projects.filter(p => {
      const h = HISTORY[p.id]
      return h ? p.vegetationCover < h.previous : false
    }).length
    const verifiedProjects = projects.filter(p => p.verificationStatus === 'verified').length

    res.json({
      totalRestorationArea,
      totalPlantsReported,
      estimatedSurvivingPlants,
      averageHealthScore,
      projectsImproving,
      projectsDeclining,
      verifiedProjects,
    })
  } catch (err) {
    console.error('Impact error:', err)
    res.status(500).json({ error: 'Failed to compute impact' })
  }
})

// GET /api/impact/projects
router.get('/projects', optionalAuth, async (req, res) => {
  try {
    const projects = await RestorationProject.find().sort({ id: 1 })
    const impactData = projects.map(p => {
      const progressOffset = PROGRESS_OFFSETS[p.id] || 0
      const targetProgress = Math.min(100, Math.max(20, (p.progress || 0) + 10))
      const adjustedProgress = Math.min(100, Math.max(0, (p.progress || 0) + progressOffset))
      const diff = adjustedProgress - targetProgress
      const targetStatus = diff > 3 ? 'ahead' : diff < -5 ? 'behind' : 'on-track'
      const h = HISTORY[p.id] || { initial: 40, previous: (p.vegetationCover || 0) - 5, target: 80, targetHealth: 80 }

      return {
        projectId: p.id,
        projectName: p.name,
        ecosystem: p.ecosystem,
        restorationArea: p.areaHa,
        estimatedPlantSurvival: Math.round((p.plantsReported || 0) * ((p.estimatedSurvival || 0) / 100)),
        vegetationCoverage: p.vegetationCover,
        healthScore: p.healthScore,
        restorationProgress: adjustedProgress,
        targetProgress,
        riskLevel: p.riskLevel,
        targetStatus,
        vegetationChange: (p.vegetationCover || 0) - h.previous,
        initialVegetation: h.initial,
        previousVegetation: h.previous,
        currentVegetation: p.vegetationCover,
        targetVegetation: h.target,
        targetHealthScore: h.targetHealth,
        digitalTwin: {
          area: p.areaHa,
          vegetationCoverage: p.vegetationCover,
          health: p.healthScore,
          risk: p.riskLevel,
          restorationProgress: adjustedProgress,
        },
      }
    })
    res.json(impactData)
  } catch (err) {
    console.error('Impact projects error:', err)
    res.status(500).json({ error: 'Failed to compute project impacts' })
  }
})

// GET /api/reports
router.get('/reports', optionalAuth, async (req, res) => {
  try {
    const projects = await RestorationProject.find().sort({ id: 1 })
    const allEvidence = await Evidence.find()
    const allAlerts = await Alert.find()

    const totalRestorationArea = projects.reduce((sum, p) => sum + (p.areaHa || 0), 0)
    const averageHealthScore = projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + (p.healthScore || 0), 0) / projects.length)
      : 0
    const verifiedProjects = projects.filter(p => p.verificationStatus === 'verified').length
    const activeAlerts = allAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').length

    res.json({
      projects: projects.map(p => ({
        id: p.id,
        name: p.name,
        ecosystem: p.ecosystem,
        healthScore: p.healthScore,
        riskLevel: p.riskLevel,
        verificationStatus: p.verificationStatus,
        progress: p.progress,
        areaHa: p.areaHa,
        vegetationCover: p.vegetationCover,
        carbonSequestered: p.carbonSequestered,
        plantsReported: p.plantsReported,
        estimatedSurvival: p.estimatedSurvival,
        speciesCount: p.speciesCount,
        status: p.status,
        region: p.region,
        state: p.state,
        startDate: p.startDate,
        projectManager: p.projectManager,
        description: p.description,
        phases: p.phases,
      })),
      summary: {
        totalProjects: projects.length,
        verifiedProjects,
        totalRestorationArea,
        averageHealthScore,
        activeAlerts,
        evidenceSubmissions: allEvidence.length,
        verifiedEvidence: allEvidence.filter(e => e.status === 'verified').length,
        needsReviewEvidence: allEvidence.filter(e => e.status === 'needs-review').length,
        rejectedEvidence: allEvidence.filter(e => e.status === 'rejected').length,
      },
      evidence: allEvidence.map(e => ({
        id: e.id,
        projectId: e.projectId,
        submittedBy: e.submittedBy,
        notes: e.notes,
        status: e.status,
        capturedAt: e.capturedAt,
        submittedAt: e.submittedAt,
        latitude: e.latitude,
        longitude: e.longitude,
        photoUrl: e.photoUrl,
        validationReasons: e.validationReasons,
      })),
      alerts: allAlerts.map(a => ({
        id: a.id,
        severity: a.severity,
        title: a.title,
        siteId: a.siteId,
        siteName: a.siteName,
        detail: a.detail,
        category: a.category,
        timestamp: a.timestamp,
        verified: a.verified,
      })),
    })
  } catch (err) {
    console.error('Reports error:', err)
    res.status(500).json({ error: 'Failed to generate reports' })
  }
})

export default router
