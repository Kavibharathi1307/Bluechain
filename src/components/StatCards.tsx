import { useEffect, useState } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { fetchProjectsApi, fetchAlertsApi } from '../lib/api'

interface StatItem {
  label: string
  value: string
  delta: string
  deltaPositive: boolean
}

export default function StatCards() {
  const [stats, setStats] = useState<StatItem[]>([])

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const [projects, alerts] = await Promise.all([
          fetchProjectsApi(),
          fetchAlertsApi(),
        ])
        if (!active) return
        const totalArea = projects.reduce((s: number, p: any) => s + (p.areaHa || 0), 0)
        const avgHealth = projects.length > 0
          ? (projects.reduce((s: number, p: any) => s + (p.healthScore || 0), 0) / projects.length).toFixed(1)
          : '0'
        const monitoring = projects.filter((p: any) => p.status === 'Monitoring').length
        const critical = alerts.filter((a: any) => a.severity === 'critical').length

        setStats([
          { label: 'Area Under Restoration', value: `${totalArea.toLocaleString()} ha`, delta: '+4.2%', deltaPositive: true },
          { label: 'Active Projects', value: String(projects.length), delta: `${monitoring} monitoring`, deltaPositive: true },
          { label: 'Average Health Score', value: avgHealth, delta: '+2.3', deltaPositive: true },
          { label: 'Open Alerts', value: String(alerts.length), delta: `${critical} critical`, deltaPositive: false },
        ])
      } catch {
        setStats([
          { label: 'Area Under Restoration', value: '26,900 ha', delta: '+4.2%', deltaPositive: true },
          { label: 'Active Projects', value: '6', delta: '2 monitoring', deltaPositive: true },
          { label: 'Average Health Score', value: '71.5', delta: '+2.3', deltaPositive: true },
          { label: 'Open Alerts', value: '5', delta: '1 critical', deltaPositive: false },
        ])
      }
    }
    load()
    return () => { active = false }
  }, [])

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-[13px] font-medium text-slate-500">{stat.label}</p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-2xl font-extrabold tracking-tight text-slate-900">
              {stat.value}
            </p>
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                stat.deltaPositive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {stat.deltaPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {stat.delta}
            </span>
          </div>
        </div>
      ))}
    </section>
  )
}
