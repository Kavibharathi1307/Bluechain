export type HealthStatus = 'excellent' | 'good' | 'moderate' | 'at-risk'

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'

export type AlertCategory = 'water quality' | 'erosion' | 'deforestation' | 'biodiversity' | 'weather'

export type Ecosystem = 'Mangroves' | 'Coral Reef' | 'Wetland' | 'Estuary' | 'Seagrass'

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export type VerificationStatus = 'verified' | 'pending' | 'in-review'

export type PhaseStatus = 'completed' | 'in-progress' | 'planned'

export type ActivityType = 'verification' | 'planting' | 'survey' | 'alert' | 'maintenance'

export interface GeoPoint {
  lat: number
  lng: number
}

export interface TimelinePhase {
  id: string
  label: string
  status: PhaseStatus
  date: string
  detail: string
}

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  detail: string
  timestamp: string
  actor: string
}

export interface RestorationSite {
  id: string
  name: string
  region: string
  state: string
  areaHa: number
  ecosystem: Ecosystem
  healthScore: number
  healthStatus: HealthStatus
  status: 'Active' | 'Monitoring' | 'At Risk'
  vegetationCover: number
  speciesCount: number
  carbonSequestered: number
  progress: number
  lastVerified: string
  description: string
  riskLevel: RiskLevel
  verificationStatus: VerificationStatus
  plantsReported: number
  estimatedSurvival: number
  coordinates: GeoPoint
  startDate: string
  projectManager: string
  phases: TimelinePhase[]
  recentActivity: ActivityItem[]
}

export interface Alert {
  id: string
  severity: Severity
  category: AlertCategory
  title: string
  siteId: string
  siteName: string
  detail: string
  timestamp: string
  verified: boolean
}

export interface HealthBreakdown {
  label: string
  value: number
  delta: number
}

export interface StatSummary {
  label: string
  value: string
  delta: string
  deltaPositive: boolean
}

export interface TrendPoint {
  month: string
  vegetationCover: number
  speciesIndex: number
  waterQuality: number
}

// ---------------------------------------------------------------------------
// Evidence & Verification (Phase 3)
// ---------------------------------------------------------------------------

export type EvidenceStatus = 'verified' | 'needs-review' | 'rejected'

export interface EvidenceSubmission {
  id: string
  projectId: string
  photoUrl: string
  latitude: number
  longitude: number
  capturedAt: string
  submittedBy: string
  notes: string
  status: EvidenceStatus
  validationReasons: string[]
  submittedAt: string
}

// ---------------------------------------------------------------------------
// AI Analysis (Phase 4)
// ---------------------------------------------------------------------------

export type VegetationCondition = 'healthy' | 'moderate' | 'poor'

export interface AiAnalysisResult {
  evidenceId: string
  vegetationCondition: VegetationCondition
  vegetationCoverage: number
  confidence: number
  possibleDegradation: boolean
  explanation: string
  analyzedAt: string
}

export interface RestorationHealthScore {
  score: number
  breakdown: { label: string; value: number; weight: number }[]
}

// ---------------------------------------------------------------------------
// Degradation Detection (Phase 5)
// ---------------------------------------------------------------------------

export type TrendDirection = 'improving' | 'stable' | 'declining'

export interface VegetationHistory {
  projectId: string
  projectName: string
  previousCoverage: number
  currentCoverage: number
  measuredAt: string
  previousMeasuredAt: string
}

export interface DegradationTrend {
  projectId: string
  projectName: string
  previousCoverage: number
  currentCoverage: number
  percentageChange: number
  trend: TrendDirection
  riskLevel: RiskLevel
}

export interface DegradationAlert {
  id: string
  severity: Severity
  projectId: string
  projectName: string
  issue: string
  detectedAt: string
  recommendedAction: string
}

export interface AiRecommendation {
  id: string
  projectId: string
  degradationAlertId: string
  action: string
  rationale: string
}

// ---------------------------------------------------------------------------
// Tamper-Evident Audit Trail (Phase 6)
// ---------------------------------------------------------------------------

export type AuditVerificationStatus = 'verified' | 'pending' | 'rejected'

export interface AuditRecord {
  recordId: string
  projectId: string
  evidenceId: string
  verificationStatus: AuditVerificationStatus
  timestamp: string
  previousHash: string
  currentHash: string
  verifier: string
}

// ---------------------------------------------------------------------------
// Restoration Impact Intelligence (Phase 7)
// ---------------------------------------------------------------------------

export type TargetStatus = 'ahead' | 'on-track' | 'behind'

export interface ProjectImpactData {
  projectId: string
  projectName: string
  ecosystem: Ecosystem
  restorationArea: number
  estimatedPlantSurvival: number
  vegetationCoverage: number
  healthScore: number
  restorationProgress: number
  targetProgress: number
  riskLevel: RiskLevel
  targetStatus: TargetStatus
  vegetationChange: number
  initialVegetation: number
  previousVegetation: number
  currentVegetation: number
  targetVegetation: number
  targetHealthScore: number
  digitalTwin: {
    area: number
    vegetationCoverage: number
    health: number
    risk: RiskLevel
    restorationProgress: number
  }
}

export interface ImpactSummary {
  totalRestorationArea: number
  totalPlantsReported: number
  estimatedSurvivingPlants: number
  averageHealthScore: number
  projectsImproving: number
  projectsDeclining: number
  verifiedProjects: number
}
