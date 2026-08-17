import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Sprout,
  Waves,
} from 'lucide-react'
import { getAllProjectImpactData } from '../lib/impact'
import { healthBarColor, riskColor, riskLabel } from '../lib/ui'
import type { TargetStatus } from '../types'

function TargetBadge({ status }: { status: TargetStatus }) {
  const map = {
    ahead: {
      label: 'Ahead of target',
      cls: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
      icon: TrendingUp,
    },
    'on-track': {
      label: 'On track',
      cls: 'bg-sky-100 text-sky-700 ring-sky-200',
      icon: Minus,
    },
    behind: {
      label: 'Behind target',
      cls: 'bg-rose-100 text-rose-700 ring-rose-200',
      icon: TrendingDown,
    },
  }
  const s = map[status]
  const Icon = s.icon
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${s.cls}`}
    >
      <Icon className="h-3 w-3" />
      {s.label}
    </span>
  )
}

export default function ProjectImpactList() {
  const [impacts, setImpacts] = useState<any[]>([])

  useEffect(() => {
    getAllProjectImpactData()
      .then(setImpacts)
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-4">
      {impacts.map((p) => (
        <Link
          key={p.projectId}
          to={`/dashboard/projects/${p.projectId}`}
          className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-ocean-300 hover:shadow-md"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ocean-50 text-ocean-700">
                <Waves className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  {p.projectId} · {p.ecosystem}
                </p>
                <h3 className="text-[15px] font-bold text-slate-900">
                  {p.projectName}
                </h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <TargetBadge status={p.targetStatus} />
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${riskColor(p.riskLevel)}`}
                  >
                    {riskLabel(p.riskLevel)} risk
                  </span>
                </div>
              </div>
            </div>
            <ArrowRight className="hidden h-5 w-5 text-slate-300 sm:block" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] font-semibold uppercase text-slate-400">
                Area
              </p>
              <p className="mt-0.5 text-sm font-bold text-slate-800">
                {p.restorationArea.toLocaleString()} ha
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] font-semibold uppercase text-slate-400">
                Est. Survival
              </p>
              <p className="mt-0.5 text-sm font-bold text-slate-800">
                {p.estimatedPlantSurvival.toLocaleString()} plants
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] font-semibold uppercase text-slate-400">
                Vegetation
              </p>
              <p className="mt-0.5 text-sm font-bold text-slate-800">
                {p.vegetationCoverage}%
                <span
                  className={`ml-1 text-[10px] font-bold ${p.vegetationChange > 0 ? 'text-emerald-600' : p.vegetationChange < 0 ? 'text-rose-600' : 'text-slate-400'}`}
                >
                  ({p.vegetationChange > 0 ? '+' : ''}
                  {p.vegetationChange}%)
                </span>
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] font-semibold uppercase text-slate-400">
                Health
              </p>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${healthBarColor(p.healthScore)}`}
                    style={{ width: `${p.healthScore}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {p.healthScore}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Sprout className="h-3 w-3" />
                Restoration progress
              </span>
              <span className="font-bold text-slate-700">
                {p.restorationProgress}% / {p.targetProgress}% target
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${healthBarColor(p.healthScore)}`}
                style={{ width: `${p.restorationProgress}%` }}
              />
            </div>
            <div className="relative mt-0.5 h-0">
              <div
                className="absolute top-0 h-2 w-0.5 bg-slate-900 opacity-40"
                style={{ left: `${p.targetProgress}%` }}
              />
            </div>
          </div>
        </Link>
      ))}
      <p className="text-center text-[11px] text-slate-400">
        Prototype estimate — values are deterministic mock data, not real environmental measurements.
      </p>
    </div>
  )
}
