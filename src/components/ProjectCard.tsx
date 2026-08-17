import { Link } from 'react-router-dom'
import { ArrowUpRight, MapPin, Waves } from 'lucide-react'
import type { RestorationSite } from '../types'
import { healthBarColor } from '../lib/ui'
import { HealthBadge, RiskBadge, VerificationBadge } from './Badges'

interface ProjectCardProps {
  project: RestorationSite
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      to={`/dashboard/projects/${project.id}`}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-ocean-50 text-ocean-700">
            <Waves className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold leading-tight text-slate-900 group-hover:text-ocean-700">
              {project.name}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
              <MapPin className="h-3 w-3" />
              {project.region}, {project.state}
            </p>
          </div>
        </div>
        <span className="shrink-0 text-[11px] font-semibold text-slate-400">
          {project.id}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Health Score
          </p>
          <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-slate-900">
            {project.healthScore}
            <span className="ml-1 text-sm font-semibold text-slate-400">
              /100
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Area
          </p>
          <p className="mt-0.5 text-sm font-bold text-slate-700">
            {project.areaHa.toLocaleString()} ha
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Plants reported
          </p>
          <p className="mt-0.5 text-sm font-bold text-slate-700">
            {project.plantsReported.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>Program progress</span>
          <span className="font-bold text-slate-700">{project.progress}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${healthBarColor(project.healthScore)}`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <HealthBadge status={project.healthStatus} />
        <RiskBadge risk={project.riskLevel} />
        <VerificationBadge status={project.verificationStatus} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-ocean-700">
          View project
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
