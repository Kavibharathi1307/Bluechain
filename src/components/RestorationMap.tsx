import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from 'react-leaflet'
import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { RestorationSite } from '../types'
import { healthDotColor } from '../lib/ui'
import { HealthBadge, RiskBadge, VerificationBadge } from './Badges'

const LEGEND_ITEMS: { key: keyof typeof healthDotColor; label: string }[] = [
  { key: 'excellent', label: 'Excellent' },
  { key: 'good', label: 'Good' },
  { key: 'moderate', label: 'Moderate' },
  { key: 'at-risk', label: 'At Risk' },
]

function fitBounds(
  sites: RestorationSite[],
): [[number, number], [number, number]] | undefined {
  if (sites.length === 0) return undefined
  const lats = sites.map((site) => site.coordinates.lat)
  const lngs = sites.map((site) => site.coordinates.lng)
  const pad = 1.5
  return [
    [Math.min(...lats) - pad, Math.min(...lngs) - pad],
    [Math.max(...lats) + pad, Math.max(...lngs) + pad],
  ]
}

function markerIcon(color: string) {
  return divIcon({
    className: 'bc-marker',
    html: `<span class="bc-pin" style="background-color:${color}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  })
}

function Legend() {
  return (
    <div className="pointer-events-none absolute left-3 top-3 z-[1000] rounded-lg border border-white/20 bg-abyss-900/80 px-3 py-2 backdrop-blur">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        Health Status
      </p>
      <ul className="space-y-1">
        {LEGEND_ITEMS.map((item) => (
          <li
            key={item.key}
            className="flex items-center gap-2 text-[11px] text-slate-200"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: healthDotColor[item.key] }}
            />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

interface RestorationMapProps {
  sites: RestorationSite[]
  showLegend?: boolean
}

export default function RestorationMap({
  sites,
  showLegend = true,
}: RestorationMapProps) {
  const bounds = fitBounds(sites)

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      <MapContainer
        className="z-0 h-full w-full"
        center={[21.5, 80]}
        zoom={5}
        bounds={bounds}
        boundsOptions={{ padding: [36, 36] }}
        zoomControl={false}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sites.map((site) => (
          <Marker
            key={site.id}
            position={[site.coordinates.lat, site.coordinates.lng]}
            icon={markerIcon(healthDotColor[site.healthStatus])}
          >
            <Popup className="bc-popup">
              <div className="min-w-[210px]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    {site.id}
                  </span>
                  <HealthBadge status={site.healthStatus} />
                </div>
                <p className="mt-1.5 text-sm font-bold leading-snug text-slate-900">
                  {site.name}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {site.region}, {site.state}
                </p>

                <div className="mt-3 rounded-lg bg-slate-50 p-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Health score
                  </p>
                  <p className="mt-0.5 text-xl font-extrabold tracking-tight text-slate-900">
                    {site.healthScore}
                    <span className="ml-0.5 text-xs font-semibold text-slate-400">
                      /100
                    </span>
                  </p>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500">
                      Risk level
                    </span>
                    <RiskBadge risk={site.riskLevel} />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500">
                      Verification
                    </span>
                    <VerificationBadge status={site.verificationStatus} />
                  </div>
                </div>

                <Link
                  to={`/dashboard/projects/${site.id}`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-lg bg-ocean-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-ocean-700"
                >
                  View project
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
        <ZoomControl position="topright" />
      </MapContainer>

      {showLegend && <Legend />}
    </div>
  )
}
