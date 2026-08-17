import { useState, useEffect } from 'react'
import {
  Bell,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
} from 'lucide-react'
import { fetchAlertsApi } from '../lib/api'
import {
  getAllDegradationAlerts,
  getSeverityCounts,
  getAiRecommendationsForAlert,
} from '../lib/degradation'
import { severityBadge } from '../lib/ui'
import type { Alert, Severity } from '../types'
import AiRecommendations from '../components/AiRecommendations'

type FilterOption = 'all' | Severity

const FILTERS: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'critical', label: 'Critical' },
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
]

export default function AlertDashboard() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all')
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    fetchAlertsApi()
      .then(setAlerts)
      .catch(() => {})
  }, [])

  const degradationAlerts = getAllDegradationAlerts()
  const severityCounts = getSeverityCounts()

  // Combine existing alerts with degradation alerts for display
  // Degradation alerts get priority at the top
  const filteredDegradationAlerts =
    activeFilter === 'all'
      ? degradationAlerts
      : degradationAlerts.filter((a) => a.severity === activeFilter)

  const filteredExistingAlerts =
    activeFilter === 'all'
      ? alerts
      : alerts.filter((a) => a.severity === activeFilter)

  const totalCount =
    filteredDegradationAlerts.length + filteredExistingAlerts.length

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-lg shadow-rose-900/20">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Active Alerts
            </h1>
            <p className="text-[13px] text-slate-500">
              Priority-ranked alert centre combining degradation detections, AI analysis and sensor telemetry.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Total Alerts
          </p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {degradationAlerts.length + alerts.length}
          </p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-400">
            Critical
          </p>
          <p className="mt-2 text-2xl font-extrabold text-rose-600">
            {severityCounts.critical}
          </p>
        </div>
        <div className="rounded-xl border border-orange-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-orange-400">
            High
          </p>
          <p className="mt-2 text-2xl font-extrabold text-orange-600">
            {severityCounts.high}
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-400">
            Medium
          </p>
          <p className="mt-2 text-2xl font-extrabold text-amber-600">
            {severityCounts.medium}
          </p>
        </div>
        <div className="rounded-xl border border-sky-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-400">
            Low
          </p>
          <p className="mt-2 text-2xl font-extrabold text-sky-600">
            {severityCounts.low}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActiveFilter(f.key)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeFilter === f.key
                ? 'bg-ocean-600 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="text-[13px] text-slate-500">
        Showing {totalCount} alert{totalCount !== 1 ? 's' : ''}
        {activeFilter !== 'all' && (
          <>
            {' '}
            with severity{' '}
            <span className="font-semibold capitalize">{activeFilter}</span>
          </>
        )}
      </p>

      {/* Degradation Alerts */}
      {filteredDegradationAlerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-[15px] font-bold text-slate-900">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Degradation Alerts
          </h2>

          {filteredDegradationAlerts.map((alert) => {
            const recommendations = getAiRecommendationsForAlert(alert.id)
            return (
              <div key={alert.id} className="space-y-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${severityBadge(
                          alert.severity,
                        )}`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        Degradation Detection
                      </span>
                    </div>
                    <span className="shrink-0 text-[11px] text-slate-400">
                      {alert.detectedAt}
                    </span>
                  </div>

                  <p className="mt-2 text-[13px] font-semibold text-slate-800">
                    {alert.issue}
                  </p>

                  <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
                    <span className="font-semibold text-slate-700">
                      Recommended action:
                    </span>{' '}
                    {alert.recommendedAction}
                  </p>

                  <div className="mt-3 flex items-center gap-4 text-[12px] text-slate-500">
                    <span className="font-medium text-ocean-700">
                      {alert.projectName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-violet-500" />
                      {recommendations.length} AI recommendation
                      {recommendations.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {recommendations.length > 0 && (
                  <AiRecommendations alert={alert} recommendations={recommendations} />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Existing System Alerts */}
      {filteredExistingAlerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-[15px] font-bold text-slate-900">
            <Bell className="h-4 w-4 text-ocean-500" />
            System Alerts
          </h2>

          <ul className="space-y-3">
            {filteredExistingAlerts.map((alert) => (
              <li
                key={alert.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-ocean-300 hover:bg-ocean-50/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${severityBadge(
                        alert.severity,
                      )}`}
                    >
                      {alert.severity}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {alert.category}
                    </span>
                  </div>
                  <span className="shrink-0 text-[11px] text-slate-400">
                    {alert.timestamp}
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-semibold text-slate-800">
                  {alert.title}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
                  {alert.detail}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-ocean-700">
                    {alert.siteName}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                      alert.verified ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    {alert.verified ? 'AI verified' : 'Pending review'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Empty state */}
      {totalCount === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Bell className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-600">
            No alerts match the selected filter
          </p>
          <p className="mt-1 text-[12px] text-slate-400">
            Try selecting a different filter or view all alerts.
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-800">
        <p>
          <span className="font-semibold">Note:</span> Degradation alerts are generated from deterministic mock data for demonstration purposes. AI-assisted recommendations are suggestions and should be validated by field experts.
        </p>
      </div>
    </div>
  )
}
