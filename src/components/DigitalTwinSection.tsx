import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Cpu,
  Leaf,
  ShieldAlert,
  TrendingUp,
  Waves,
} from 'lucide-react'
import { getAllProjectImpactData } from '../lib/impact'
import { healthBarColor, riskColor, riskLabel } from '../lib/ui'
import type { ProjectImpactData } from '../types'

function TwinBar({
  label,
  current,
  target,
  color,
}: {
  label: string
  current: number
  target: number
  color: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] text-slate-500">
        <span>{label}</span>
        <span className="font-bold text-slate-700">
          {current}% → {target}%
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${current}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-slate-900 opacity-50"
          style={{ left: `${target}%` }}
        />
      </div>
    </div>
  )
}

function DigitalTwinCard({ project }: { project: ProjectImpactData }) {
  const twin = project.digitalTwin

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-ocean-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-700">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
              Digital Twin
            </p>
            <h4 className="text-[14px] font-bold text-slate-900">
              {project.projectName}
            </h4>
            <p className="text-[11px] text-slate-500">
              Prototype visualization
            </p>
          </div>
        </div>
        <Link
          to={`/dashboard/projects/${project.projectId}`}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-ocean-700 hover:text-ocean-800"
        >
          Details
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <div className="flex items-center gap-1.5">
            <Waves className="h-3.5 w-3.5 text-ocean-600" />
            <p className="text-[10px] font-semibold uppercase text-slate-400">
              Area
            </p>
          </div>
          <p className="mt-0.5 text-sm font-bold text-slate-800">
            {twin.area.toLocaleString()} ha
          </p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <div className="flex items-center gap-1.5">
            <Leaf className="h-3.5 w-3.5 text-emerald-600" />
            <p className="text-[10px] font-semibold uppercase text-slate-400">
              Vegetation
            </p>
          </div>
          <p className="mt-0.5 text-sm font-bold text-slate-800">
            {twin.vegetationCoverage}%
          </p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-teal-600" />
            <p className="text-[10px] font-semibold uppercase text-slate-400">
              Health
            </p>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${healthBarColor(twin.health)}`}
                style={{ width: `${twin.health}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-700">
              {twin.health}
            </span>
          </div>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
            <p className="text-[10px] font-semibold uppercase text-slate-400">
              Risk
            </p>
          </div>
          <span
            className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${riskColor(twin.risk)}`}
          >
            {riskLabel(twin.risk)}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        <TwinBar
          label="Restoration Progress"
          current={twin.restorationProgress}
          target={project.targetProgress}
          color={healthBarColor(project.healthScore)}
        />
        <TwinBar
          label="Vegetation Coverage"
          current={twin.vegetationCoverage}
          target={project.targetVegetation}
          color="bg-cyan-500"
        />
        <TwinBar
          label="Health Score"
          current={twin.health}
          target={project.targetHealthScore}
          color="bg-teal-500"
        />
      </div>

      <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-[11px]">
        <span className="text-slate-500">Current State → Target State</span>
        <span className="font-bold text-slate-700">
          {twin.restorationProgress}% → {project.targetProgress}%
        </span>
      </div>
    </div>
  )
}

export default function DigitalTwinSection() {
  const [projects, setProjects] = useState<ProjectImpactData[]>([])

  useEffect(() => {
    getAllProjectImpactData()
      .then(setProjects)
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-50 text-cyan-700">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Restoration Digital Twins
            </h2>
            <p className="text-[13px] text-slate-500">
              Prototype visualizations of each project's current restoration state
            </p>
          </div>
        </div>
        <p className="mt-1 text-[11px] text-slate-400">
          Digital twin values are deterministic mock estimates for demonstration purposes only.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <DigitalTwinCard key={p.projectId} project={p} />
        ))}
      </div>
    </div>
  )
}
