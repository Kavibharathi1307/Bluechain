import {
  TrendingDown,
  TrendingUp,
  Minus,
  AlertTriangle,
  ShieldAlert,
  ArrowDown,
  ArrowUp,
} from 'lucide-react'
import type { DegradationAlert, DegradationTrend } from '../types'
import { severityBadge, riskColor, riskLabel } from '../lib/ui'

function TrendIcon({ trend }: { trend: DegradationTrend['trend'] }) {
  switch (trend) {
    case 'improving':
      return <TrendingUp className="h-5 w-5 text-emerald-600" />
    case 'declining':
      return <TrendingDown className="h-5 w-5 text-rose-600" />
    default:
      return <Minus className="h-5 w-5 text-amber-600" />
  }
}

function TrendLabel({ trend }: { trend: DegradationTrend['trend'] }) {
  const color =
    trend === 'improving'
      ? 'text-emerald-700 bg-emerald-50 ring-emerald-200'
      : trend === 'declining'
        ? 'text-rose-700 bg-rose-50 ring-rose-200'
        : 'text-amber-700 bg-amber-50 ring-amber-200'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${color}`}
    >
      {trend.charAt(0).toUpperCase() + trend.slice(1)}
    </span>
  )
}

interface DegradationSectionProps {
  trend: DegradationTrend
  alerts: DegradationAlert[]
}

export default function DegradationSection({
  trend,
  alerts,
}: DegradationSectionProps) {
  const changeColor =
    trend.percentageChange >= 0
      ? 'text-emerald-600'
      : trend.percentageChange <= -10
        ? 'text-rose-600'
        : trend.percentageChange <= -3
          ? 'text-orange-600'
          : 'text-amber-600'

  const ChangeIcon =
    trend.percentageChange >= 0 ? ArrowUp : ArrowDown

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Degradation &amp; Risk
        </h2>
        <p className="text-[13px] text-slate-500">
          Vegetation trend analysis and risk assessment based on historical comparison
        </p>
      </div>

      {/* Trend Overview Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-100">
              <TrendIcon trend={trend.trend} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Current Trend
              </p>
              <div className="mt-1">
                <TrendLabel trend={trend.trend} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-100">
              <ShieldAlert
                className={`h-5 w-5 ${
                  trend.riskLevel === 'critical'
                    ? 'text-rose-600'
                    : trend.riskLevel === 'high'
                      ? 'text-orange-600'
                      : trend.riskLevel === 'medium'
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                }`}
              />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Risk Level
              </p>
              <span
                className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${riskColor(
                  trend.riskLevel,
                )}`}
              >
                {riskLabel(trend.riskLevel)}
              </span>
            </div>
          </div>
        </div>

        {/* Vegetation Change */}
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Vegetation Change
          </p>
          <div className="mt-2 flex items-baseline gap-3">
            <div className="text-center">
              <p className="text-[11px] text-slate-500">Previous</p>
              <p className="text-2xl font-extrabold text-slate-700">
                {trend.previousCoverage}
                <span className="text-sm font-semibold text-slate-400">%</span>
              </p>
            </div>
            <ChangeIcon className={`h-5 w-5 ${changeColor}`} />
            <div className="text-center">
              <p className="text-[11px] text-slate-500">Current</p>
              <p className="text-2xl font-extrabold text-slate-900">
                {trend.currentCoverage}
                <span className="text-sm font-semibold text-slate-400">%</span>
              </p>
            </div>
            <div className="ml-4">
              <p className="text-[11px] text-slate-500">Change</p>
              <p className={`text-2xl font-extrabold ${changeColor}`}>
                {trend.percentageChange >= 0 ? '+' : ''}
                {trend.percentageChange}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Degradation Alerts */}
      {alerts.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h3 className="text-[15px] font-bold text-slate-900">
              Active Alerts ({alerts.length})
            </h3>
          </div>

          <ul className="mt-3 space-y-3">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className="rounded-lg border border-slate-200 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${severityBadge(
                      alert.severity,
                    )}`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {alert.detectedAt}
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-semibold text-slate-800">
                  {alert.issue}
                </p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">
                  <span className="font-semibold text-slate-600">
                    Recommended:
                  </span>{' '}
                  {alert.recommendedAction}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {alerts.length === 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          No active degradation alerts for this project.
        </div>
      )}
    </div>
  )
}
