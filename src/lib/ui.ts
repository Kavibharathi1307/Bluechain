import type {
  EvidenceStatus,
  HealthStatus,
  RiskLevel,
  Severity,
  VegetationCondition,
  VerificationStatus,
} from '../types'

export const healthDotColor: Record<HealthStatus, string> = {
  excellent: '#10b981',
  good: '#0d9488',
  moderate: '#f59e0b',
  'at-risk': '#f43f5e',
}

export function healthColor(status: HealthStatus): string {
  switch (status) {
    case 'excellent':
      return 'text-emerald-600 bg-emerald-50 ring-emerald-200'
    case 'good':
      return 'text-teal-700 bg-teal-50 ring-teal-200'
    case 'moderate':
      return 'text-amber-700 bg-amber-50 ring-amber-200'
    case 'at-risk':
      return 'text-rose-700 bg-rose-50 ring-rose-200'
  }
}

export function healthBarColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 70) return 'bg-teal-500'
  if (score >= 60) return 'bg-amber-500'
  return 'bg-rose-500'
}

export function severityBadge(severity: Severity): string {
  switch (severity) {
    case 'critical':
      return 'bg-rose-100 text-rose-700 ring-rose-200'
    case 'high':
      return 'bg-orange-100 text-orange-700 ring-orange-200'
    case 'medium':
      return 'bg-amber-100 text-amber-700 ring-amber-200'
    case 'low':
      return 'bg-sky-100 text-sky-700 ring-sky-200'
    case 'info':
      return 'bg-slate-100 text-slate-600 ring-slate-200'
  }
}

export function healthLabel(status: HealthStatus): string {
  switch (status) {
    case 'excellent':
      return 'Excellent'
    case 'good':
      return 'Good'
    case 'moderate':
      return 'Moderate'
    case 'at-risk':
      return 'At Risk'
  }
}

export function riskColor(risk: RiskLevel): string {
  switch (risk) {
    case 'low':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    case 'medium':
      return 'bg-amber-50 text-amber-700 ring-amber-200'
    case 'high':
      return 'bg-orange-50 text-orange-700 ring-orange-200'
    case 'critical':
      return 'bg-rose-50 text-rose-700 ring-rose-200'
  }
}

export function riskLabel(risk: RiskLevel): string {
  switch (risk) {
    case 'low':
      return 'Low'
    case 'medium':
      return 'Medium'
    case 'high':
      return 'High'
    case 'critical':
      return 'Critical'
  }
}

export function verificationColor(status: VerificationStatus): string {
  switch (status) {
    case 'verified':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    case 'pending':
      return 'bg-slate-100 text-slate-600 ring-slate-200'
    case 'in-review':
      return 'bg-sky-50 text-sky-700 ring-sky-200'
  }
}

export function verificationLabel(status: VerificationStatus): string {
  switch (status) {
    case 'verified':
      return 'Verified'
    case 'pending':
      return 'Pending'
    case 'in-review':
      return 'In Review'
  }
}

export function evidenceStatusColor(status: EvidenceStatus): string {
  switch (status) {
    case 'verified':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    case 'needs-review':
      return 'bg-amber-50 text-amber-700 ring-amber-200'
    case 'rejected':
      return 'bg-rose-50 text-rose-700 ring-rose-200'
  }
}

export function evidenceStatusLabel(status: EvidenceStatus): string {
  switch (status) {
    case 'verified':
      return 'Verified'
    case 'needs-review':
      return 'Needs Review'
    case 'rejected':
      return 'Rejected'
  }
}

export function aiConditionColor(condition: VegetationCondition): string {
  switch (condition) {
    case 'healthy':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    case 'moderate':
      return 'bg-amber-50 text-amber-700 ring-amber-200'
    case 'poor':
      return 'bg-rose-50 text-rose-700 ring-rose-200'
  }
}

export function aiConditionLabel(condition: VegetationCondition): string {
  switch (condition) {
    case 'healthy':
      return 'Healthy'
    case 'moderate':
      return 'Moderate'
    case 'poor':
      return 'Poor'
  }
}
