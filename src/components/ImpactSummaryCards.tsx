import { useEffect, useState } from 'react'
import {
  BarChart3,
  Leaf,
  Sprout,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react'
import { getImpactSummary } from '../lib/impact'
import type { ImpactSummary } from '../types'

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: typeof BarChart3
  label: string
  value: string
  hint?: string
  accent?: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span
          className={`grid h-8 w-8 place-items-center rounded-lg ${accent ?? 'bg-ocean-50 text-ocean-700'}`}
        >
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

export default function ImpactSummaryCards() {
  const [summary, setSummary] = useState<ImpactSummary>({
    totalRestorationArea: 0,
    totalPlantsReported: 0,
    estimatedSurvivingPlants: 0,
    averageHealthScore: 0,
    projectsImproving: 0,
    projectsDeclining: 0,
    verifiedProjects: 0,
  })

  useEffect(() => {
    getImpactSummary()
      .then(setSummary)
      .catch(() => {})
  }, [])

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile
        icon={Leaf}
        label="Total Restoration Area"
        value={`${summary.totalRestorationArea.toLocaleString()} ha`}
        hint="Prototype estimate across 6 projects"
        accent="bg-emerald-50 text-emerald-700"
      />
      <StatTile
        icon={Sprout}
        label="Total Plants Reported"
        value={summary.totalPlantsReported.toLocaleString()}
        hint={`${summary.estimatedSurvivingPlants.toLocaleString()} estimated surviving`}
        accent="bg-teal-50 text-teal-700"
      />
      <StatTile
        icon={BarChart3}
        label="Avg Health Score"
        value={`${summary.averageHealthScore}`}
        hint={`${summary.projectsImproving} improving · ${summary.projectsDeclining} declining`}
        accent="bg-ocean-50 text-ocean-700"
      />
      <StatTile
        icon={ShieldCheck}
        label="Verified Projects"
        value={`${summary.verifiedProjects} of 6`}
        hint={`${summary.projectsImproving} improving · ${summary.projectsDeclining} declining`}
        accent="bg-violet-50 text-violet-700"
      />

      <div className="col-span-2 grid grid-cols-2 gap-4 lg:col-span-4 lg:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <TrendingUp className="h-8 w-8 text-emerald-600" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
              Projects Improving
            </p>
            <p className="text-xl font-extrabold text-emerald-800">
              {summary.projectsImproving}
            </p>
            <p className="text-[11px] text-emerald-600">
              Vegetation cover increasing
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <TrendingDown className="h-8 w-8 text-rose-600" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-600">
              Projects Declining
            </p>
            <p className="text-xl font-extrabold text-rose-800">
              {summary.projectsDeclining}
            </p>
            <p className="text-[11px] text-rose-600">
              Vegetation cover decreasing
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
