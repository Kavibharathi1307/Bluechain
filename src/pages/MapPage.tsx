import { useEffect, useState } from 'react'
import { Crosshair, Layers } from 'lucide-react'
import { fetchProjects } from '../lib/projects'
import type { RestorationSite } from '../types'
import RestorationMap from '../components/RestorationMap'
import LoadingState from '../components/LoadingState'

export default function MapPage() {
  const [projects, setProjects] = useState<RestorationSite[]>([])
  const [loading, setLoading] = useState(true)
  const [showSites, setShowSites] = useState(true)

  useEffect(() => {
    let active = true
    fetchProjects().then((data) => {
      if (active) {
        setProjects(data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  const totalArea = projects.reduce((sum, project) => sum + project.areaHa, 0)

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Restoration Map</h2>
          <p className="text-[13px] text-slate-500">
            Interactive geospatial view of coastal restoration sites
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-slate-500">
          <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium shadow-sm">
            {projects.length} sites
          </span>
          <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium shadow-sm">
            {totalArea.toLocaleString()} ha under restoration
          </span>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading restoration map…" />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-ocean-50 text-ocean-700">
                <Crosshair className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900">
                  Coastal Restoration Sites
                </h3>
                <p className="text-[11px] text-slate-500">
                  Click a marker for project intelligence
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSites((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Layers className="h-4 w-4" />
              {showSites ? 'Hide site markers' : 'Show site markers'}
            </button>
          </div>

          <div className="mt-4 h-[420px] sm:h-[520px] xl:h-[620px]">
            <RestorationMap sites={showSites ? projects : []} />
          </div>
        </div>
      )}
    </div>
  )
}
