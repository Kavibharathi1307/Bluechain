import { useEffect, useState } from 'react'
import { Target, TrendingUp, TrendingDown, Minus, Sprout, Leaf } from 'lucide-react'
import { getProjectImpactData } from '../lib/impact'
import { healthBarColor } from '../lib/ui'
import type { TargetStatus, ProjectImpactData } from '../types'

function TargetStatusBadge({ status }: { status: TargetStatus }) {
  const map = {
    ahead: {
      label: 'Ahead of target',
      cls: 'bg-emerald-100 text-emerald-700',
      icon: TrendingUp,
    },
    'on-track': {
      label: 'On track',
      cls: 'bg-sky-100 text-sky-700',
      icon: Minus,
    },
    behind: {
      label: 'Behind target',
      cls: 'bg-rose-100 text-rose-700',
      icon: TrendingDown,
    },
  }
  const s = map[status]
  const Icon = s.icon
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${s.cls}`}
    >
      <Icon className="h-3 w-3" />
      {s.label}
    </span>
  )
}

export default function ProjectImpactSummary({
  projectId,
}: {
  projectId: string
}) {
  const [impact, setImpact] = useState<ProjectImpactData | undefined>(undefined)

  useEffect(() => {
    let active = true
    getProjectImpactData(projectId).then((data) => {
      if (active) setImpact(data)
    })
    return () => { active = false }
  }, [projectId])

  if (!impact) return null

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-50 text-cyan-700">
          <Target className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Impact Summary</h2>
          <p className="text-[11px] text-slate-400">
            Prototype estimate — deterministic mock data
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="text-[10px] font-semibold uppercase text-slate-400">
            Restoration Progress
          </p>
          <p className="mt-1 text-lg font-extrabold text-slate-800">
            {impact.restorationProgress}%
          </p>
          <p className="text-[10px] text-slate-500">
            Target: {impact.targetProgress}%
          </p>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full ${healthBarColor(impact.healthScore)}`}
              style={{ width: `${impact.restorationProgress}%` }}
            />
          </div>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="text-[10px] font-semibold uppercase text-slate-400">
            Estimated Survival
          </p>
          <p className="mt-1 text-lg font-extrabold text-slate-800">
            {impact.estimatedPlantSurvival.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-500">
            of {impact.restorationArea.toLocaleString()} ha area
          </p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="text-[10px] font-semibold uppercase text-slate-400">
            Vegetation Change
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <Leaf className="h-4 w-4 text-emerald-600" />
            <p
              className={`text-lg font-extrabold ${impact.vegetationChange > 0 ? 'text-emerald-600' : impact.vegetationChange < 0 ? 'text-rose-600' : 'text-slate-600'}`}
            >
              {impact.vegetationChange > 0 ? '+' : ''}
              {impact.vegetationChange}%
            </p>
          </div>
          <p className="text-[10px] text-slate-500">
            {impact.previousVegetation}% → {impact.currentVegetation}%
          </p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="text-[10px] font-semibold uppercase text-slate-400">
            Impact Status
          </p>
          <div className="mt-1.5">
            <TargetStatusBadge status={impact.targetStatus} />
          </div>
          <p className="mt-1.5 text-[10px] text-slate-500">
            Health: {impact.healthScore}/{impact.targetHealthScore}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Sprout className="h-3 w-3" />
            Current → Target
          </span>
          <span className="font-bold text-slate-700">
            {impact.restorationProgress}% → {impact.targetProgress}%
          </span>
        </div>
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${healthBarColor(impact.healthScore)}`}
            style={{ width: `${impact.restorationProgress}%` }}
          />
          <div
            className="absolute top-0 h-full w-0.5 bg-slate-900 opacity-50"
            style={{ left: `${impact.targetProgress}%` }}
          />
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] text-slate-400">
        Prototype estimate — not a real environmental measurement.
      </p>
    </div>
  )
}
