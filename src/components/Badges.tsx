import type { HealthStatus, RiskLevel, VerificationStatus } from '../types'
import {
  healthColor,
  healthLabel,
  riskColor,
  riskLabel,
  verificationColor,
  verificationLabel,
} from '../lib/ui'

export function HealthBadge({ status }: { status: HealthStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${healthColor(
        status,
      )}`}
    >
      {healthLabel(status)}
    </span>
  )
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${riskColor(
        risk,
      )}`}
    >
      {riskLabel(risk)} risk
    </span>
  )
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${verificationColor(
        status,
      )}`}
    >
      {verificationLabel(status)}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const classes =
    status === 'Active'
      ? 'bg-emerald-50 text-emerald-700'
      : status === 'Monitoring'
        ? 'bg-sky-50 text-sky-700'
        : 'bg-rose-50 text-rose-700'
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${classes}`}
    >
      {status}
    </span>
  )
}
