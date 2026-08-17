import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X, MapPinned } from 'lucide-react'
import { fetchProjects } from '../lib/projects'
import type {
  HealthStatus,
  RestorationSite,
  RiskLevel,
  VerificationStatus,
} from '../types'
import ProjectCard from '../components/ProjectCard'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'

type HealthFilter = 'all' | HealthStatus
type RiskFilter = 'all' | RiskLevel
type VerificationFilter = 'all' | VerificationStatus

const healthOptions: { value: HealthFilter; label: string }[] = [
  { value: 'all', label: 'All health statuses' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'at-risk', label: 'At Risk' },
]

const riskOptions: { value: RiskFilter; label: string }[] = [
  { value: 'all', label: 'All risk levels' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
]

const verificationOptions: { value: VerificationFilter; label: string }[] = [
  { value: 'all', label: 'All verification statuses' },
  { value: 'verified', label: 'Verified' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-review', label: 'In Review' },
]

const selectClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none ring-ocean-500/30 transition-shadow focus:border-ocean-500 focus:ring-2 sm:w-auto'

export default function Projects() {
  const [projects, setProjects] = useState<RestorationSite[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [health, setHealth] = useState<HealthFilter>('all')
  const [risk, setRisk] = useState<RiskFilter>('all')
  const [verification, setVerification] = useState<VerificationFilter>('all')

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

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return projects.filter((project) => {
      const matchesQuery =
        !term ||
        project.name.toLowerCase().includes(term) ||
        project.region.toLowerCase().includes(term) ||
        project.state.toLowerCase().includes(term)
      const matchesHealth = health === 'all' || project.healthStatus === health
      const matchesRisk = risk === 'all' || project.riskLevel === risk
      const matchesVerification =
        verification === 'all' || project.verificationStatus === verification
      return (
        matchesQuery && matchesHealth && matchesRisk && matchesVerification
      )
    })
  }, [projects, query, health, risk, verification])

  const hasFilters =
    query.trim() !== '' || health !== 'all' || risk !== 'all' || verification !== 'all'

  const clearFilters = () => {
    setQuery('')
    setHealth('all')
    setRisk('all')
    setVerification('all')
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Restoration Projects</h2>
          <p className="text-[13px] text-slate-500">
            Verified restoration sites across India's coastline
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-ocean-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ocean-700"
        >
          Register new project
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by project name or location…"
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none ring-ocean-500/30 transition-shadow focus:border-ocean-500 focus:ring-2"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-slate-400 sm:block" />
              <select
                value={health}
                onChange={(e) => setHealth(e.target.value as HealthFilter)}
                className={selectClass}
                aria-label="Filter by health status"
              >
                {healthOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value as RiskFilter)}
              className={selectClass}
              aria-label="Filter by risk level"
            >
              {riskOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={verification}
              onChange={(e) =>
                setVerification(e.target.value as VerificationFilter)
              }
              className={selectClass}
              aria-label="Filter by verification status"
            >
              {verificationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading restoration projects…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={MapPinned}
          title="No projects match your filters"
          description="Try adjusting the search term or clearing some filters to see more restoration projects."
          actionLabel="Clear all filters"
          onAction={clearFilters}
        />
      ) : (
        <>
          <p className="text-[13px] text-slate-500">
            Showing{' '}
            <span className="font-bold text-slate-700">{filtered.length}</span>{' '}
            of <span className="font-bold text-slate-700">{projects.length}</span>{' '}
            projects
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
