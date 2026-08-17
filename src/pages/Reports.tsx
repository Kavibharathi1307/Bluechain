import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileText,
  Info,
  Leaf,
  Link2,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar as RechartsRadar,
} from 'recharts'
import { fetchReportsApi } from '../lib/api'
import {
  healthColor,
  riskColor,
  verificationColor,
  evidenceStatusColor,
  evidenceStatusLabel,
  severityBadge,
} from '../lib/ui'

// ---------------------------------------------------------------------------
// Static chart data (not fetched from API)
// ---------------------------------------------------------------------------

const vegetationTrend = [
  { month: 'Jan', vegetationCover: 41, speciesIndex: 38, waterQuality: 52 },
  { month: 'Feb', vegetationCover: 45, speciesIndex: 40, waterQuality: 55 },
  { month: 'Mar', vegetationCover: 49, speciesIndex: 43, waterQuality: 51 },
  { month: 'Apr', vegetationCover: 47, speciesIndex: 45, waterQuality: 48 },
  { month: 'May', vegetationCover: 53, speciesIndex: 47, waterQuality: 52 },
  { month: 'Jun', vegetationCover: 58, speciesIndex: 50, waterQuality: 56 },
  { month: 'Jul', vegetationCover: 64, speciesIndex: 54, waterQuality: 60 },
  { month: 'Aug', vegetationCover: 69, speciesIndex: 58, waterQuality: 58 },
  { month: 'Sep', vegetationCover: 73, speciesIndex: 62, waterQuality: 63 },
  { month: 'Oct', vegetationCover: 76, speciesIndex: 66, waterQuality: 61 },
  { month: 'Nov', vegetationCover: 80, speciesIndex: 70, waterQuality: 65 },
  { month: 'Dec', vegetationCover: 84, speciesIndex: 74, waterQuality: 68 },
]

const ecosystemDistribution = [
  { name: 'Mangroves', value: 54, color: '#0d9488' },
  { name: 'Wetland', value: 22, color: '#10b981' },
  { name: 'Coral Reef', value: 12, color: '#06b6d4' },
  { name: 'Estuary', value: 8, color: '#f59e0b' },
  { name: 'Seagrass', value: 4, color: '#6366f1' },
]

const healthBreakdown = [
  { label: 'Vegetation Cover', value: 78, delta: +4.2 },
  { label: 'Species Diversity', value: 72, delta: +2.1 },
  { label: 'Water Quality', value: 64, delta: -3.4 },
  { label: 'Sediment Stability', value: 81, delta: +1.8 },
  { label: 'Blue Carbon Uptake', value: 76, delta: +5.0 },
]

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ReportType =
  | 'project-status'
  | 'restoration-impact'
  | 'evidence-verification'
  | 'risk-alerts'
  | 'blockchain-audit'

type ViewMode = 'dashboard' | 'preview' | 'project-report'

interface ReportData {
  projects: any[]
  summary: {
    totalProjects: number
    verifiedProjects: number
    totalRestorationArea: number
    averageHealthScore: number
    activeAlerts: number
    evidenceSubmissions: number
    verifiedEvidence: number
    needsReviewEvidence: number
    rejectedEvidence: number
  }
  evidence: any[]
  alerts: any[]
}

// ---------------------------------------------------------------------------
// Report type definitions
// ---------------------------------------------------------------------------

const REPORT_TYPES: {
  id: ReportType
  title: string
  description: string
  icon: typeof FileText
  color: string
  bgColor: string
}[] = [
  {
    id: 'project-status',
    title: 'Project Status Report',
    description:
      'Comprehensive status overview of all restoration projects including progress, health, and milestones.',
    icon: BarChart3,
    color: 'text-ocean-700',
    bgColor: 'bg-ocean-50',
  },
  {
    id: 'restoration-impact',
    title: 'Restoration Impact Report',
    description:
      'Environmental impact metrics covering vegetation recovery, carbon sequestration, and biodiversity gains.',
    icon: Leaf,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
  },
  {
    id: 'evidence-verification',
    title: 'Evidence & Verification Report',
    description:
      'Detailed evidence submission audit trail with verification status and validation outcomes.',
    icon: FileCheck,
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
  },
  {
    id: 'risk-alerts',
    title: 'Risk & Alerts Report',
    description:
      'Active risk assessments, degradation alerts, and recommended mitigation actions across projects.',
    icon: AlertTriangle,
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
  },
  {
    id: 'blockchain-audit',
    title: 'Blockchain Audit Report',
    description:
      'Tamper-evident audit trail with hash-chain verification status for all anchored evidence.',
    icon: ShieldCheck,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
  },
]

// ---------------------------------------------------------------------------
// Dashboard stat cards
// ---------------------------------------------------------------------------

function ReportStatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = 'ocean',
}: {
  icon: typeof FileText
  label: string
  value: string | number
  hint?: string
  accent?: string
}) {
  const iconBg =
    accent === 'emerald'
      ? 'bg-emerald-50 text-emerald-700'
      : accent === 'violet'
        ? 'bg-violet-50 text-violet-700'
        : accent === 'rose'
          ? 'bg-rose-50 text-rose-700'
          : accent === 'amber'
            ? 'bg-amber-50 text-amber-700'
            : 'bg-ocean-50 text-ocean-700'

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className={`grid h-8 w-8 place-items-center rounded-lg ${iconBg}`}>
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
      </div>
      <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>
      {hint && <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Chart styling constants
// ---------------------------------------------------------------------------

const AXIS_PROPS = { stroke: '#94a3b8', fontSize: 11, tickLine: false }
const TOOLTIP_STYLE = {
  contentStyle: {
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    fontSize: 12,
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  },
}
const COLORS = ['#0d9488', '#06b6d4', '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b']

// ---------------------------------------------------------------------------
// Export helpers (frontend-only mock download)
// ---------------------------------------------------------------------------

function generatePlainTextReport(title: string, content: string): string {
  const divider = '='.repeat(60)
  const date = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return [
    divider,
    '  BlueChain - Coastal Restoration Monitoring',
    divider,
    '',
    `  Report: ${title}`,
    `  Generated: ${date}`,
    '',
    divider,
    '',
    content,
    '',
    divider,
    '',
    '  DISCLAIMER: This report contains prototype/mock data generated',
    '  for demonstration purposes only. It does NOT represent real',
    '  environmental measurements or scientifically validated data.',
    '',
    divider,
  ].join('\n')
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ---------------------------------------------------------------------------
// Report disclaimer
// ---------------------------------------------------------------------------

function ReportDisclaimer() {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
      <p className="text-[12px] leading-relaxed text-amber-800">
        <strong>Prototype / Mock Data Disclaimer</strong> - All values shown in this
        report are prototype estimates for demonstration purposes. They do NOT
        represent real environmental measurements, scientifically validated data, or
        carbon-credit calculations.
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Report Header (used inside every preview)
// ---------------------------------------------------------------------------

function ReportHeader({
  title,
  type,
}: {
  title: string
  type: string
}) {
  const date = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-ocean-50 text-ocean-700">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              BlueChain
            </h2>
            <p className="text-[13px] text-slate-500">
              Coastal Restoration Monitoring Platform
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {type}
          </p>
          <p className="text-sm font-bold text-slate-900">{title}</p>
          <p className="mt-0.5 text-[12px] text-slate-500">
            Generated: {date}
          </p>
        </div>
      </div>
      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-[12px] text-slate-400">
          Report ID: RPT-{Date.now().toString(36).toUpperCase()} - All
          projects included - Prototype data
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// DetailRow helper
// ---------------------------------------------------------------------------

function DetailRow({
  label,
  value,
  children,
}: {
  label: string
  value?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12px] font-medium text-slate-500">{label}</span>
      {children ?? (
        <span className="text-[12px] font-semibold text-slate-800">
          {value}
        </span>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Project Status Preview
// ---------------------------------------------------------------------------

function ProjectStatusPreview({ reportData }: { reportData: ReportData }) {
  const sites = reportData.projects

  const projectChartData = sites.map((s: any) => ({
    name: s.name.split(' ').slice(0, 2).join(' '),
    health: s.healthScore,
    vegetation: s.vegetationCover,
    progress: s.progress,
  }))

  return (
    <div className="space-y-5">
      <ReportHeader title="Project Status Report" type="Quarterly Overview" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <ReportStatCard icon={FileText} label="Total Projects" value={sites.length} accent="ocean" />
        <ReportStatCard icon={CheckCircle2} label="Verified" value={`${reportData.summary.verifiedProjects} of ${sites.length}`} accent="emerald" />
        <ReportStatCard icon={Leaf} label="Total Area" value={`${reportData.summary.totalRestorationArea.toLocaleString()} ha`} accent="emerald" />
        <ReportStatCard icon={BarChart3} label="Avg Health" value={reportData.summary.averageHealthScore} accent="ocean" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="mb-4 text-[15px] font-bold text-slate-900">
          Project Health Comparison
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectChartData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} domain={[0, 100]} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="health" name="Health Score" fill="#0d9488" radius={[4, 4, 0, 0]} />
            <Bar dataKey="vegetation" name="Vegetation %" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="mb-4 text-[15px] font-bold text-slate-900">Project Details</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-4 py-2.5 font-semibold text-slate-500">Project</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Ecosystem</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Health</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Risk</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Progress</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Verification</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site: any, i: number) => (
                <tr key={site.id} className={`border-b border-slate-50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                  <td className="px-4 py-2.5">
                    <span className="font-semibold text-slate-800">{site.id}</span>
                    <span className="ml-2 text-slate-500">{site.name}</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{site.ecosystem}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${healthColor(site.healthStatus)}`}>
                      {site.healthScore}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${riskColor(site.riskLevel)}`}>
                      {site.riskLevel.charAt(0).toUpperCase() + site.riskLevel.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-ocean-500" style={{ width: `${site.progress}%` }} />
                      </div>
                      <span className="text-[11px] text-slate-500">{site.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${verificationColor(site.verificationStatus)}`}>
                      {site.verificationStatus.charAt(0).toUpperCase() + site.verificationStatus.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Restoration Impact Preview
// ---------------------------------------------------------------------------

function RestorationImpactPreview({ reportData }: { reportData: ReportData }) {
  const sites = reportData.projects
  const impactSummary = reportData.summary

  const impactChartData = sites.map((p: any) => ({
    name: p.name.split(' ').slice(0, 2).join(' '),
    area: p.areaHa,
    survival: Math.round((p.plantsReported || 0) * ((p.estimatedSurvival || 0) / 100)),
  }))

  const radarData = healthBreakdown.map((h) => ({
    metric: h.label,
    value: h.value,
    fullMark: 100,
  }))

  return (
    <div className="space-y-5">
      <ReportHeader title="Restoration Impact Report" type="Environmental Impact Assessment" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ReportStatCard icon={Leaf} label="Total Restoration Area" value={`${impactSummary.totalRestorationArea.toLocaleString()} ha`} accent="emerald" />
        <ReportStatCard icon={CheckCircle2} label="Avg Health Score" value={impactSummary.averageHealthScore} accent="ocean" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="mb-4 text-[15px] font-bold text-slate-900">Restoration Area by Project</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={impactChartData} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" {...AXIS_PROPS} />
              <YAxis dataKey="name" type="category" {...AXIS_PROPS} width={100} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="area" name="Area (ha)" fill="#0d9488" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="mb-4 text-[15px] font-bold text-slate-900">Health Metrics Overview</h4>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" {...AXIS_PROPS} />
              <RechartsRadar name="Score" dataKey="value" stroke="#0d9488" fill="#0d9488" fillOpacity={0.2} />
              <Tooltip {...TOOLTIP_STYLE} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="mb-4 text-[15px] font-bold text-slate-900">Vegetation Cover Trend (12-Month)</h4>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={vegetationTrend}>
            <defs>
              <linearGradient id="gradVeg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradWater" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="vegetationCover" name="Vegetation Cover" stroke="#0d9488" fill="url(#gradVeg)" />
            <Area type="monotone" dataKey="waterQuality" name="Water Quality" stroke="#06b6d4" fill="url(#gradWater)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="mb-4 text-[15px] font-bold text-slate-900">Ecosystem Distribution</h4>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={ecosystemDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value">
                {ecosystemDistribution.map((entry, idx) => (
                  <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2">
            {ecosystemDistribution.map((e, idx) => (
              <div key={e.name} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-[12px] font-medium text-slate-600">{e.name}</span>
                <span className="text-[12px] text-slate-400">{e.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Evidence & Verification Preview
// ---------------------------------------------------------------------------

function EvidenceVerificationPreview({ reportData }: { reportData: ReportData }) {
  const evidenceSubmissions = reportData.evidence
  const sites = reportData.projects
  const verified = evidenceSubmissions.filter((e: any) => e.status === 'verified').length
  const needsReview = evidenceSubmissions.filter((e: any) => e.status === 'needs-review').length
  const rejected = evidenceSubmissions.filter((e: any) => e.status === 'rejected').length

  const statusData = [
    { name: 'Verified', value: verified, color: '#10b981' },
    { name: 'Needs Review', value: needsReview, color: '#f59e0b' },
    { name: 'Rejected', value: rejected, color: '#f43f5e' },
  ]

  const projectEvidence = sites.map((s: any) => {
    const ev = evidenceSubmissions.filter((e: any) => e.projectId === s.id)
    return {
      name: s.name.split(' ').slice(0, 2).join(' '),
      total: ev.length,
      verified: ev.filter((e: any) => e.status === 'verified').length,
      needsReview: ev.filter((e: any) => e.status === 'needs-review').length,
      rejected: ev.filter((e: any) => e.status === 'rejected').length,
    }
  })

  return (
    <div className="space-y-5">
      <ReportHeader title="Evidence & Verification Report" type="Evidence Audit Trail" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ReportStatCard icon={FileCheck} label="Total Submissions" value={evidenceSubmissions.length} accent="ocean" />
        <ReportStatCard icon={CheckCircle2} label="Verified" value={verified} accent="emerald" />
        <ReportStatCard icon={Clock} label="Needs Review" value={needsReview} accent="amber" />
        <ReportStatCard icon={XCircle} label="Rejected" value={rejected} accent="rose" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="mb-4 text-[15px] font-bold text-slate-900">Evidence Status Distribution</h4>
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value">
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {statusData.map((e) => (
                <div key={e.name} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: e.color }} />
                  <span className="text-[12px] font-medium text-slate-600">{e.name}</span>
                  <span className="text-[12px] text-slate-400">({e.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="mb-4 text-[15px] font-bold text-slate-900">Evidence by Project</h4>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={projectEvidence} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="verified" name="Verified" fill="#10b981" stackId="a" />
              <Bar dataKey="needsReview" name="Needs Review" fill="#f59e0b" stackId="a" />
              <Bar dataKey="rejected" name="Rejected" fill="#f43f5e" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="mb-4 text-[15px] font-bold text-slate-900">Evidence Submission Details</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-4 py-2.5 font-semibold text-slate-500">ID</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Project</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Submitted By</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Notes</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {evidenceSubmissions.map((e: any, i: number) => (
                <tr key={e.id} className={`border-b border-slate-50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                  <td className="px-4 py-2.5 font-semibold text-slate-800">{e.id}</td>
                  <td className="px-4 py-2.5 text-slate-600">{e.projectId}</td>
                  <td className="px-4 py-2.5 text-slate-600">{e.submittedBy}</td>
                  <td className="max-w-[250px] truncate px-4 py-2.5 text-slate-500">{e.notes}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${evidenceStatusColor(e.status)}`}>
                      {evidenceStatusLabel(e.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Risk & Alerts Preview
// ---------------------------------------------------------------------------

function RiskAlertsPreview({ reportData }: { reportData: ReportData }) {
  const alerts = reportData.alerts
  const criticalCount = alerts.filter((a: any) => a.severity === 'critical').length
  const highCount = alerts.filter((a: any) => a.severity === 'high').length

  const severityData = [
    { name: 'Critical', count: alerts.filter((a: any) => a.severity === 'critical').length, color: '#f43f5e' },
    { name: 'High', count: alerts.filter((a: any) => a.severity === 'high').length, color: '#f97316' },
    { name: 'Medium', count: alerts.filter((a: any) => a.severity === 'medium').length, color: '#f59e0b' },
    { name: 'Info', count: alerts.filter((a: any) => a.severity === 'info').length, color: '#94a3b8' },
  ]

  return (
    <div className="space-y-5">
      <ReportHeader title="Risk & Alerts Report" type="Risk Assessment Summary" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ReportStatCard icon={AlertTriangle} label="Active Alerts" value={alerts.length} accent="rose" />
        <ReportStatCard icon={ShieldAlert} label="Critical" value={criticalCount} accent="rose" />
        <ReportStatCard icon={ShieldAlert} label="High" value={highCount} accent="amber" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="mb-4 text-[15px] font-bold text-slate-900">Alert Severity Distribution</h4>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={severityData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Bar dataKey="count" name="Count" radius={[4, 4, 0, 0]}>
              {severityData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="mb-4 text-[15px] font-bold text-slate-900">Active Alerts</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-4 py-2.5 font-semibold text-slate-500">ID</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Severity</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Title</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Project</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Detail</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a: any, i: number) => (
                <tr key={a.id} className={`border-b border-slate-50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                  <td className="px-4 py-2.5 font-semibold text-slate-800">{a.id}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${severityBadge(a.severity)}`}>
                      {a.severity.charAt(0).toUpperCase() + a.severity.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-medium text-slate-700">{a.title}</td>
                  <td className="px-4 py-2.5 text-slate-600">{a.siteId}</td>
                  <td className="max-w-[280px] truncate px-4 py-2.5 text-slate-500">{a.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Blockchain Audit Preview
// ---------------------------------------------------------------------------

function BlockchainAuditPreview({ reportData }: { reportData: ReportData }) {
  const verifiedEvidence = reportData.evidence.filter((e: any) => e.status === 'verified')
  const chainRecords = verifiedEvidence.length

  const auditData = reportData.projects.map((s: any) => ({
    name: s.name.split(' ').slice(0, 2).join(' '),
    verified: reportData.evidence.filter((e: any) => e.projectId === s.id && e.status === 'verified').length,
    total: reportData.evidence.filter((e: any) => e.projectId === s.id).length,
  }))

  return (
    <div className="space-y-5">
      <ReportHeader title="Blockchain Audit Report" type="Tamper-Evident Audit Trail" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ReportStatCard icon={ShieldCheck} label="Chain Records" value={chainRecords} accent="amber" />
        <ReportStatCard icon={CheckCircle2} label="Chain Status" value="VALID" accent="emerald" />
        <ReportStatCard icon={Link2} label="Genesis Hash" value="0x0000..." accent="ocean" />
        <ReportStatCard icon={FileCheck} label="Evidence Anchored" value={chainRecords} accent="ocean" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="mb-4 text-[15px] font-bold text-slate-900">Evidence Anchoring by Project</h4>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={auditData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="verified" name="Verified & Anchored" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="total" name="Total Submissions" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="mb-4 text-[15px] font-bold text-slate-900">Chain Visualization</h4>
        <div className="flex flex-wrap items-start gap-2">
          {verifiedEvidence.map((ev: any, idx: number) => (
            <div key={ev.id} className="flex items-center">
              <div className="group relative">
                <div className="grid h-10 w-10 place-items-center rounded-lg border-2 border-ocean-300 bg-ocean-50 text-[10px] font-bold text-ocean-700 transition-colors group-hover:border-ocean-500 group-hover:bg-ocean-100">
                  {idx + 1}
                </div>
              </div>
              {idx < verifiedEvidence.length - 1 && (
                <div className="mx-1 flex items-center text-ocean-300">
                  <Link2 className="h-4 w-4 -rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-8 text-[11px] text-slate-400">
          Each record contains a hash of its own data and a reference to the previous record's hash, forming a tamper-evident chain.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="mb-4 text-[15px] font-bold text-slate-900">Audit Trail Records</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-4 py-2.5 font-semibold text-slate-500">Evidence</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Project</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Submitted By</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Date</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Chain Status</th>
              </tr>
            </thead>
            <tbody>
              {verifiedEvidence.map((ev: any, i: number) => (
                <tr key={ev.id} className={`border-b border-slate-50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                  <td className="px-4 py-2.5 font-semibold text-slate-800">{ev.id}</td>
                  <td className="px-4 py-2.5 text-slate-600">{ev.projectId}</td>
                  <td className="px-4 py-2.5 text-slate-600">{ev.submittedBy}</td>
                  <td className="px-4 py-2.5 text-[12px] text-slate-500">
                    {new Date(ev.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      Anchored
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Project Detail Report
// ---------------------------------------------------------------------------

function ProjectDetailReport({
  project,
  onBack,
  reportData,
}: {
  project: any
  onBack: () => void
  reportData: ReportData
}) {
  const projectEvidence = reportData.evidence.filter((e: any) => e.projectId === project.id)
  const verifiedEv = projectEvidence.filter((e: any) => e.status === 'verified')
  const needsReviewEv = projectEvidence.filter((e: any) => e.status === 'needs-review')

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 hover:text-ocean-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to reports
        </button>
      </div>

      <ReportHeader title={project.name} type={`Project Report - ${project.id}`} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ReportStatCard icon={Leaf} label="Restoration Area" value={`${project.areaHa.toLocaleString()} ha`} accent="emerald" />
        <ReportStatCard icon={BarChart3} label="Health Score" value={project.healthScore} accent="ocean" />
        <ReportStatCard icon={TrendingUp} label="Progress" value={`${project.progress}%`} accent="ocean" />
        <ReportStatCard icon={FileCheck} label="Evidence" value={projectEvidence.length} hint={`${verifiedEv.length} verified`} accent="violet" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="mb-4 text-[15px] font-bold text-slate-900">Project Details</h4>
          <div className="space-y-3">
            <DetailRow label="Project ID" value={project.id} />
            <DetailRow label="Ecosystem" value={project.ecosystem} />
            <DetailRow label="State" value={project.state} />
            <DetailRow label="Region" value={project.region} />
            <DetailRow label="Start Date" value={project.startDate} />
            <DetailRow label="Project Manager" value={project.projectManager} />
            <DetailRow label="Status" value={project.status} />
            <DetailRow label="Risk Level" value={project.riskLevel.charAt(0).toUpperCase() + project.riskLevel.slice(1)} />
          </div>
          <p className="mt-4 text-[12px] leading-relaxed text-slate-500">{project.description}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="mb-4 text-[15px] font-bold text-slate-900">Restoration Progress</h4>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[12px] font-medium text-slate-600">Overall Progress</span>
                <span className="text-[12px] font-bold text-slate-800">{project.progress}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-ocean-500 transition-all" style={{ width: `${project.progress}%` }} />
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[12px] font-medium text-slate-600">Vegetation Cover</span>
                <span className="text-[12px] font-bold text-slate-800">{project.vegetationCover}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${project.vegetationCover}%` }} />
              </div>
            </div>
          </div>
          <div className="mt-5">
            <h5 className="mb-3 text-[13px] font-bold text-slate-900">Health Score Breakdown</h5>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={healthBreakdown} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" {...AXIS_PROPS} />
                <YAxis {...AXIS_PROPS} domain={[0, 100]} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="value" name="Score" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="mb-4 text-[15px] font-bold text-slate-900">Evidence Summary</h4>
        <div className="mb-3 flex gap-3">
          <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
            {verifiedEv.length} Verified
          </span>
          <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-700 ring-1 ring-inset ring-amber-200">
            {needsReviewEv.length} Needs Review
          </span>
        </div>
        <div className="space-y-2">
          {projectEvidence.map((ev: any) => (
            <div key={ev.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-slate-800">{ev.id}</span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${evidenceStatusColor(ev.status)}`}>
                  {evidenceStatusLabel(ev.status)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">{ev.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Reports Page
// ---------------------------------------------------------------------------

export default function Reports() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [reportData, setReportData] = useState<ReportData | null>(null)

  useEffect(() => {
    fetchReportsApi()
      .then(setReportData)
      .catch(() => {})
  }, [])

  const selectedProject = useMemo(
    () => (selectedProjectId && reportData ? reportData.projects.find((s: any) => s.id === selectedProjectId) ?? null : null),
    [selectedProjectId, reportData],
  )

  const selectedReportDef = useMemo(
    () => (selectedReportType ? REPORT_TYPES.find((r) => r.id === selectedReportType) ?? null : null),
    [selectedReportType],
  )

  function handleSelectReport(type: ReportType) {
    setSelectedReportType(type)
    setViewMode('preview')
  }

  function handleSelectProject(projectId: string) {
    setSelectedProjectId(projectId)
    setViewMode('project-report')
  }

  function handleBackToDashboard() {
    setViewMode('dashboard')
    setSelectedReportType(null)
    setSelectedProjectId(null)
  }

  function handleBackToPreview() {
    setViewMode('preview')
    setSelectedProjectId(null)
  }

  function handleDownloadReport() {
    if (!reportData) return
    const title = selectedProject
      ? `${selectedProject.name} (${selectedProject.id})`
      : selectedReportDef?.title ?? 'Report'
    const content = [
      `Total Projects: ${reportData.summary.totalProjects}`,
      `Verified Projects: ${reportData.summary.verifiedProjects}`,
      `Total Restoration Area: ${reportData.summary.totalRestorationArea.toLocaleString()} ha`,
      `Average Health Score: ${reportData.summary.averageHealthScore}`,
      `Active Alerts: ${reportData.summary.activeAlerts}`,
      `Evidence Submissions: ${reportData.summary.evidenceSubmissions}`,
      '',
      '--- Project Summary ---',
      ...reportData.projects.map(
        (s: any) => `${s.id} | ${s.name} | Health: ${s.healthScore} | Risk: ${s.riskLevel} | Status: ${s.verificationStatus}`,
      ),
    ].join('\n')
    const report = generatePlainTextReport(title, content)
    downloadTextFile(`BlueChain_${title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`, report)
  }

  function renderPreview() {
    if (!selectedReportType || !reportData) return null
    switch (selectedReportType) {
      case 'project-status':
        return <ProjectStatusPreview reportData={reportData} />
      case 'restoration-impact':
        return <RestorationImpactPreview reportData={reportData} />
      case 'evidence-verification':
        return <EvidenceVerificationPreview reportData={reportData} />
      case 'risk-alerts':
        return <RiskAlertsPreview reportData={reportData} />
      case 'blockchain-audit':
        return <BlockchainAuditPreview reportData={reportData} />
    }
  }

  if (!reportData) {
    return (
      <div className="mx-auto max-w-[1400px] p-4 sm:p-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-ocean-600 border-t-transparent" />
          <span className="ml-3 text-sm text-slate-500">Loading report data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6">
      {viewMode === 'dashboard' && (
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 hover:text-ocean-800">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            {viewMode === 'dashboard'
              ? 'Reports'
              : viewMode === 'preview'
                ? selectedReportDef?.title ?? 'Report Preview'
                : `Project Report - ${selectedProject?.id ?? ''}`}
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            {viewMode === 'dashboard'
              ? 'Scheduled and on-demand reports for regulators, funders and public stakeholders.'
              : viewMode === 'preview'
                ? 'Report preview with data from the backend.'
                : `Detailed report for ${selectedProject?.name ?? ''}`}
          </p>
        </div>
        {viewMode !== 'dashboard' && (
          <button
            type="button"
            onClick={viewMode === 'project-report' ? handleBackToPreview : handleBackToDashboard}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 hover:text-ocean-800"
          >
            <ArrowLeft className="h-4 w-4" />
            {viewMode === 'project-report' ? 'Back to report' : 'Back to dashboard'}
          </button>
        )}
      </div>

      <ReportDisclaimer />

      {/* ========== DASHBOARD VIEW ========== */}
      {viewMode === 'dashboard' && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <ReportStatCard icon={FileText} label="Total Projects" value={reportData.summary.totalProjects} accent="ocean" />
            <ReportStatCard icon={CheckCircle2} label="Verified Projects" value={reportData.summary.verifiedProjects} accent="emerald" />
            <ReportStatCard icon={Leaf} label="Restoration Area" value={`${reportData.summary.totalRestorationArea.toLocaleString()} ha`} accent="emerald" />
            <ReportStatCard icon={BarChart3} label="Avg Health Score" value={reportData.summary.averageHealthScore} accent="ocean" />
            <ReportStatCard icon={AlertTriangle} label="Active Alerts" value={reportData.summary.activeAlerts} accent="rose" />
            <ReportStatCard icon={FileCheck} label="Evidence Submissions" value={reportData.summary.evidenceSubmissions} accent="violet" />
          </div>

          <div>
            <h2 className="mb-1 text-lg font-bold text-slate-900">Generate Report</h2>
            <p className="text-[13px] text-slate-500">Select a report type to view a preview with current data.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REPORT_TYPES.map((rt) => {
              const Icon = rt.icon
              return (
                <button
                  key={rt.id}
                  type="button"
                  onClick={() => handleSelectReport(rt.id)}
                  className="group rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:border-ocean-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${rt.bgColor} transition-colors group-hover:bg-ocean-50`}>
                      <Icon className={`h-5 w-5 ${rt.color} group-hover:text-ocean-700`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[14px] font-bold text-slate-900 group-hover:text-ocean-700">{rt.title}</h3>
                      <p className="mt-1 text-[12px] leading-relaxed text-slate-500">{rt.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-ocean-600 opacity-0 transition-opacity group-hover:opacity-100">
                    View Report
                    <ArrowLeft className="h-3 w-3 rotate-180" />
                  </div>
                </button>
              )
            })}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-[15px] font-bold text-slate-900">Project-Specific Reports</h3>
            <p className="mb-4 text-[12px] text-slate-500">Select a project to generate a detailed individual report.</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {reportData.projects.map((s: any) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectProject(s.id)}
                  className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition-all hover:border-ocean-300 hover:bg-white hover:shadow-sm"
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ocean-50 text-[10px] font-bold text-ocean-700">
                    {s.id.split('-')[1]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-slate-800 group-hover:text-ocean-700">{s.name}</p>
                    <p className="text-[11px] text-slate-400">{s.ecosystem} - Health: {s.healthScore}</p>
                  </div>
                  <ArrowLeft className="h-3.5 w-3.5 shrink-0 -rotate-180 text-slate-300 group-hover:text-ocean-500" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ========== PREVIEW VIEW ========== */}
      {viewMode === 'preview' && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={handleDownloadReport} className="inline-flex items-center gap-2 rounded-lg bg-ocean-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean-700">
              <Download className="h-4 w-4" />
              Download Report
            </button>
          </div>
          {renderPreview()}
        </>
      )}

      {/* ========== PROJECT REPORT VIEW ========== */}
      {viewMode === 'project-report' && selectedProject && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={handleDownloadReport} className="inline-flex items-center gap-2 rounded-lg bg-ocean-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean-700">
              <Download className="h-4 w-4" />
              Download Report
            </button>
          </div>
          <ProjectDetailReport project={selectedProject} onBack={handleBackToDashboard} reportData={reportData} />
        </>
      )}
    </div>
  )
}
