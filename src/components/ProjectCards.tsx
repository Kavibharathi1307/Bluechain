import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, MapPin, Waves } from 'lucide-react'
import { fetchProjectsApi } from '../lib/api'
import { healthBarColor, healthColor, healthLabel } from '../lib/ui'
import type { RestorationSite } from '../types'

export default function ProjectCards() {
  const [sites, setSites] = useState<RestorationSite[]>([])

  useEffect(() => {
    let active = true
    fetchProjectsApi()
      .then((data) => { if (active) setSites(data) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Restoration Projects
          </h2>
          <p className="text-[13px] text-slate-500">
            Verified restoration sites across India's coastline
          </p>
        </div>
        <Link
          to="/dashboard/projects"
          className="rounded-lg bg-ocean-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ocean-700"
        >
          View all projects
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sites.map((site) => (
          <Link
            key={site.id}
            to={`/dashboard/projects/${site.id}`}
            className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-ocean-50 text-ocean-700">
                  <Waves className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold leading-tight text-slate-900">
                    {site.name}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="h-3 w-3" />
                    {site.region}, {site.state}
                  </p>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${healthColor(
                  site.healthStatus,
                )}`}
              >
                {healthLabel(site.healthStatus)}
              </span>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Health Score
                </p>
                <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-slate-900">
                  {site.healthScore}
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
                  {site.areaHa.toLocaleString()} ha
                </p>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Program progress</span>
                <span className="font-bold text-slate-700">{site.progress}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${healthBarColor(site.healthScore)}`}
                  style={{ width: `${site.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-lg border border-slate-100 bg-slate-50 text-center">
              <div className="py-2">
                <p className="text-[13px] font-bold text-slate-800">
                  {site.vegetationCover}%
                </p>
                <p className="text-[10px] text-slate-500">Vegetation</p>
              </div>
              <div className="py-2">
                <p className="text-[13px] font-bold text-slate-800">
                  {site.speciesCount}
                </p>
                <p className="text-[10px] text-slate-500">Species</p>
              </div>
              <div className="py-2">
                <p className="text-[13px] font-bold text-slate-800">
                  {site.carbonSequestered.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-500">tCO₂e</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    site.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : site.status === 'Monitoring'
                        ? 'bg-sky-50 text-sky-700'
                        : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {site.status}
                </span>
                <span className="text-[11px] text-slate-400">
                  {site.lastVerified}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-ocean-700">
                Details
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
