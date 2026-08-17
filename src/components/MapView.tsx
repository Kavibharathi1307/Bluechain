import { useEffect, useState } from 'react'
import { Crosshair, Layers } from 'lucide-react'
import { fetchProjectsApi } from '../lib/api'
import RestorationMap from './RestorationMap'
import type { RestorationSite } from '../types'

export default function MapView() {
  const [showSites, setShowSites] = useState(true)
  const [sites, setSites] = useState<RestorationSite[]>([])

  useEffect(() => {
    fetchProjectsApi()
      .then((data) => setSites(data))
      .catch(() => {})
  }, [])

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-ocean-50 text-ocean-700">
            <Crosshair className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-slate-900">
              Restoration Sites Map
            </h2>
            <p className="text-[11px] text-slate-500">
              Interactive geospatial layer · click markers for details
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

      <div className="mt-4 h-[360px] overflow-hidden sm:h-[420px]">
        <RestorationMap sites={showSites ? sites : []} />
      </div>
    </section>
  )
}
