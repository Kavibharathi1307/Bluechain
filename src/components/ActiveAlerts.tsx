import { useEffect, useState } from 'react'
import { ShieldCheck, ShieldAlert } from 'lucide-react'
import { fetchAlertsApi } from '../lib/api'
import { severityBadge } from '../lib/ui'
import type { Alert } from '../types'

export default function ActiveAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    let active = true
    fetchAlertsApi()
      .then((data) => { if (active) setAlerts(data) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const critical = alerts.filter((a) => a.severity === 'critical').length

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-slate-900">Active Alerts</h2>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldAlert className="h-4 w-4 text-rose-500" />
          <span className="font-semibold text-rose-600">{critical} critical</span>
        </div>
      </div>

      <ul className="nice-scroll mt-4 max-h-[380px] space-y-3 overflow-y-auto pr-1">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className="rounded-lg border border-slate-200 p-3 transition-colors hover:border-ocean-300 hover:bg-ocean-50/40"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${severityBadge(
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
            <p className="mt-2 text-[13px] font-semibold leading-snug text-slate-800">
              {alert.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
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

      <button
        type="button"
        className="mt-4 w-full rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-ocean-700 transition-colors hover:bg-ocean-50"
      >
        View all alerts
      </button>
    </section>
  )
}
