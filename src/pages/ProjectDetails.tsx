import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  Droplet,
  Flower2,
  Link2,
  MapPin,
  ShieldQuestion,
  Sprout,
  User,
  Waves,
} from 'lucide-react'
import { fetchProjectById } from '../lib/projects'
import { fetchEvidenceByProject, submitEvidence, getEvidenceStats } from '../lib/evidence'
import { analyzeEvidence, calculateRestorationHealthScore, getAiStats } from '../lib/ai'
import {
  getVegetationHistory,
  computeDegradationTrend,
  getDegradationAlertsForProject,
  getAiRecommendationsForAlert,
} from '../lib/degradation'
import { fetchAuditRecordsByProject } from '../lib/audit'
import type { AiAnalysisResult, AuditRecord, DegradationAlert, EvidenceSubmission, RestorationSite } from '../types'
import { healthBarColor } from '../lib/ui'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import HealthScoreGauge from '../components/HealthScoreGauge'
import ProjectTimeline from '../components/ProjectTimeline'
import ActivityFeed from '../components/ActivityFeed'
import EvidenceForm from '../components/EvidenceForm'
import EvidenceList from '../components/EvidenceList'
import EvidenceStats from '../components/EvidenceStats'
import { AiHealthScoreCard } from '../components/AiAnalysisCard'
import DegradationSection from '../components/DegradationSection'
import AiRecommendations from '../components/AiRecommendations'
import {
  HealthBadge,
  RiskBadge,
  StatusBadge,
  VerificationBadge,
} from '../components/Badges'
import ProjectImpactSummary from '../components/ProjectImpactSummary'
import RestorationProgressChart from '../components/RestorationProgressChart'

function MetricTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Waves
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-ocean-50 text-ocean-700">
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
      </div>
      <p className="mt-3 text-xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>
      {hint && <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p>}
    </div>
  )
}

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<RestorationSite | null>(null)
  const [loading, setLoading] = useState(true)
  const [evidence, setEvidence] = useState<EvidenceSubmission[]>([])
  const [showEvidenceForm, setShowEvidenceForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [analyses, setAnalyses] = useState<Map<string, AiAnalysisResult>>(new Map())
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set())
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([])


  useEffect(() => {
    let active = true
    if (projectId) {
      setLoading(true)
      fetchProjectById(projectId).then((data) => {
        if (active) {
          setProject(data ?? null)
          setLoading(false)
        }
      })
    }
    return () => {
      active = false
    }
  }, [projectId])

  useEffect(() => {
    if (!projectId) return
    let active = true
    fetchEvidenceByProject(projectId).then((data) => {
      if (active) setEvidence(data)
    })
    return () => { active = false }
  }, [projectId])

  useEffect(() => {
    if (!projectId) return
    let active = true
    fetchAuditRecordsByProject(projectId).then((data) => {
      if (active) setAuditRecords(data)
    })
    return () => { active = false }
  }, [projectId])

  const handleEvidenceSubmit = async (data: {
    photoUrl: string
    latitude: number
    longitude: number
    capturedAt: string
    notes: string
  }) => {
    if (!projectId) return
    setSubmitting(true)
    try {
      const submission = await submitEvidence(
        {
          projectId,
          ...data,
          submittedBy: 'Dr. Rao',
        },
        evidence,
      )
      setEvidence((prev) => [...prev, submission])
      setShowEvidenceForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  const evidenceStats = getEvidenceStats(evidence)

  const handleAnalyze = async (evidenceId: string) => {
    const item = evidence.find((e) => e.id === evidenceId)
    if (!item || analyses.has(evidenceId)) return

    setAnalyzingIds((prev) => new Set(prev).add(evidenceId))
    try {
      const result = await analyzeEvidence(item)
      setAnalyses((prev) => new Map(prev).set(evidenceId, result))
    } finally {
      setAnalyzingIds((prev) => {
        const next = new Set(prev)
        next.delete(evidenceId)
        return next
      })
    }
  }

  const aiAnalyses = Array.from(analyses.values())
  const aiStats = getAiStats(aiAnalyses)
  const healthScore = calculateRestorationHealthScore(aiAnalyses, evidence)

  // Degradation detection (Phase 5)
  const vegetationHist = project ? getVegetationHistory(project.id) : undefined
  const degradationTrend = vegetationHist
    ? computeDegradationTrend(vegetationHist)
    : undefined
  const degradationAlerts = project
    ? getDegradationAlertsForProject(project.id)
    : []
  // Gather AI recommendations for all degradation alerts on this project
  const projectRecommendations: { alert: DegradationAlert; recommendations: ReturnType<typeof getAiRecommendationsForAlert> }[] =
    degradationAlerts.map((alert) => ({
      alert,
      recommendations: getAiRecommendationsForAlert(alert.id),
    }))

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] p-4 sm:p-6">
        <LoadingState label="Loading project details…" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-[1400px] p-4 sm:p-6">
        <Link
          to="/dashboard/projects"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 hover:text-ocean-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>
        <div className="mt-6">
          <EmptyState
            icon={ShieldQuestion}
            title="Project not found"
            description="We couldn't find a restoration project matching that ID. It may have been removed or the link is incorrect."
            actionLabel="Browse all projects"
            onAction={() => navigate('/dashboard/projects')}
          />
        </div>
      </div>
    )
  }

  const startYear = new Date(project.startDate).getFullYear()

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6">
      <Link
        to="/dashboard/projects"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 hover:text-ocean-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-lg shadow-ocean-900/20">
              <Waves className="h-7 w-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  {project.id}
                </span>
                <HealthBadge status={project.healthStatus} />
                <RiskBadge risk={project.riskLevel} />
                <VerificationBadge status={project.verificationStatus} />
                <StatusBadge status={project.status} />
              </div>
              <h2 className="mt-1.5 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                {project.name}
              </h2>
              <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {project.region}, {project.state}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Droplet className="h-3.5 w-3.5" />
                  {project.ecosystem}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Since {startYear}
                </span>
                <span className="inline-flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {project.projectManager}
                </span>
              </p>
              <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-slate-600">
                {project.description}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Program progress</span>
            <span className="font-bold text-slate-700">{project.progress}%</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${healthBarColor(project.healthScore)}`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <MetricTile
              icon={Waves}
              label="Restoration area"
              value={`${project.areaHa.toLocaleString()} ha`}
              hint={`${project.ecosystem} ecosystem`}
            />
            <MetricTile
              icon={Sprout}
              label="Plants reported"
              value={project.plantsReported.toLocaleString()}
              hint="Saplings / fragments planted"
            />
            <MetricTile
              icon={Flower2}
              label="Estimated survival"
              value={`${project.estimatedSurvival}%`}
              hint="Projected long-term survival"
            />
            <MetricTile
              icon={Waves}
              label="Vegetation cover"
              value={`${project.vegetationCover}%`}
              hint="Current canopy / coverage"
            />
            <MetricTile
              icon={Droplet}
              label="Species count"
              value={`${project.speciesCount}`}
              hint="Recorded species"
            />
            <MetricTile
              icon={Waves}
              label="Carbon sequestered"
              value={`${project.carbonSequestered.toLocaleString()} t`}
              hint="tCO₂e to date"
            />
          </div>

          <ProjectTimeline phases={project.phases} />
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex w-full items-center justify-between">
              <h3 className="text-[15px] font-bold text-slate-900">
                Health Score
              </h3>
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700 ring-1 ring-inset ring-teal-200">
                Composite Index
              </span>
            </div>
            <div className="mt-4">
              <HealthScoreGauge score={project.healthScore} />
            </div>
            <p className="mt-2 text-center text-xs text-slate-500">
              Last verified {project.lastVerified.toLowerCase()}
            </p>
          </div>

          <ActivityFeed items={project.recentActivity} />
        </div>
      </div>

      {/* Evidence & Verification section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Evidence &amp; Verification
            </h2>
            <p className="text-[13px] text-slate-500">
              Field submissions and verification status for this project
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowEvidenceForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-ocean-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ocean-700"
          >
            <Camera className="h-4 w-4" />
            Upload Evidence
          </button>
        </div>

        <EvidenceStats
          total={evidenceStats.total}
          verified={evidenceStats.verified}
          needsReview={evidenceStats.needsReview}
          rejected={evidenceStats.rejected}
        />

        <EvidenceList
          evidence={evidence}
          analyses={analyses}
          analyzingIds={analyzingIds}
          onAnalyze={handleAnalyze}
        />
      </div>

      {/* AI Analysis section */}
      {aiAnalyses.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              AI Analysis
            </h2>
            <p className="text-[13px] text-slate-500">
              AI-assisted vegetation analysis for submitted evidence
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-xl border border-violet-200 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Analyzed images
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">
                {aiStats.analyzed}
              </p>
            </div>
            <div className="rounded-xl border border-violet-200 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Avg. vegetation coverage
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">
                {aiStats.avgCoverage}
                <span className="text-sm font-semibold text-slate-400">%</span>
              </p>
            </div>
            <div className="rounded-xl border border-violet-200 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Avg. AI confidence
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">
                {aiStats.avgConfidence}
                <span className="text-sm font-semibold text-slate-400">%</span>
              </p>
            </div>
            <div className="rounded-xl border border-violet-200 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Degradation flags
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">
                {aiStats.degradationFlags}
              </p>
            </div>
          </div>

          <AiHealthScoreCard
            score={healthScore.score}
            breakdown={healthScore.breakdown}
          />
        </div>
      )}

      {/* Degradation & Risk section (Phase 5) */}
      {degradationTrend && (
        <DegradationSection
          trend={degradationTrend}
          alerts={degradationAlerts}
        />
      )}

      {/* Impact Summary (Phase 7) */}
      <ProjectImpactSummary projectId={project.id} />

      {/* Restoration Progress Chart (Phase 7) */}
      <RestorationProgressChart projectId={project.id} />

      {/* Digital Twin Preview (Phase 7) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-50 text-cyan-700">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/></svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Digital Twin</h2>
            <p className="text-[11px] text-slate-400">Prototype visualization of current restoration state</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-center">
            <p className="text-[10px] font-semibold uppercase text-slate-400">Area</p>
            <p className="mt-0.5 text-sm font-bold text-slate-800">{project.areaHa.toLocaleString()} ha</p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-center">
            <p className="text-[10px] font-semibold uppercase text-slate-400">Vegetation</p>
            <p className="mt-0.5 text-sm font-bold text-slate-800">{project.vegetationCover}%</p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-center">
            <p className="text-[10px] font-semibold uppercase text-slate-400">Health</p>
            <p className="mt-0.5 text-sm font-bold text-slate-800">{project.healthScore}</p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-center">
            <p className="text-[10px] font-semibold uppercase text-slate-400">Risk</p>
            <p className="mt-0.5 text-sm font-bold text-slate-800 capitalize">{project.riskLevel}</p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-center">
            <p className="text-[10px] font-semibold uppercase text-slate-400">Progress</p>
            <p className="mt-0.5 text-sm font-bold text-slate-800">{project.progress}%</p>
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] text-slate-400">
          Current State → Target State — Prototype estimate
        </p>
      </div>

      {/* AI Restoration Advisor (Phase 5) */}
      {projectRecommendations.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              AI Restoration Advisor
            </h2>
            <p className="text-[13px] text-slate-500">
              AI-assisted recommendations for addressing detected degradation
            </p>
          </div>

          {projectRecommendations.map(({ alert, recommendations }) => (
            <AiRecommendations
              key={alert.id}
              alert={alert}
              recommendations={recommendations}
            />
          ))}
        </div>
      )}

      {/* Blockchain Verification section (Phase 6) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ocean-50 text-ocean-700">
            <Link2 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900">
              Blockchain Verification
            </h2>
            <p className="text-[13px] text-slate-500">
              Simulated hash-chain audit trail for verified evidence
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Verification Status
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  {project.verificationStatus === 'verified'
                    ? 'Verified'
                    : project.verificationStatus === 'pending'
                      ? 'Pending'
                      : 'In Review'}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Audit Record ID
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  {auditRecords.length > 0 ? auditRecords[auditRecords.length - 1].recordId : 'None'}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Chain Integrity
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  {auditRecords.length > 0 ? 'VALID' : 'No records'}
                </p>
              </div>
            </div>

            {auditRecords.length > 0 && (
              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Timestamp
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {new Date(auditRecords[auditRecords.length - 1].timestamp).toLocaleString('en-IN')}
                </p>
              </div>
            )}

            <p className="mt-3 text-[11px] text-slate-400">
              Prototype / Simulated hash-chain — not a real blockchain.
            </p>
          </div>
        </div>
      </div>

      {showEvidenceForm && projectId && (
        <EvidenceForm
          projectId={projectId}
          onSubmit={handleEvidenceSubmit}
          onCancel={() => setShowEvidenceForm(false)}
          isSubmitting={submitting}
        />
      )}
    </div>
  )
}
