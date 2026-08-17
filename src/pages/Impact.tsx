import { Link } from 'react-router-dom'
import { ArrowLeft, Info } from 'lucide-react'
import ImpactSummaryCards from '../components/ImpactSummaryCards'
import ProjectImpactList from '../components/ProjectImpactList'
import RestorationProgressChart from '../components/RestorationProgressChart'
import ImpactComparisonCharts from '../components/ImpactComparisonCharts'
import DigitalTwinSection from '../components/DigitalTwinSection'

export default function Impact() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 hover:text-ocean-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          Impact Intelligence
        </h1>
        <p className="mt-1 text-[13px] text-slate-500">
          Measurable environmental impact insights from restoration projects
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-[12px] leading-relaxed text-amber-800">
          <strong>Prototype estimate</strong> — All impact values shown on this page are
          deterministic mock data for demonstration purposes. They are NOT real
          environmental measurements, scientifically validated data, or carbon-credit
          calculations.
        </p>
      </div>

      <ImpactSummaryCards />

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Project Impact Details
          </h2>
          <p className="text-[13px] text-slate-500">
            Deterministic mock impact estimates for each restoration project
          </p>
        </div>
        <ProjectImpactList />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <RestorationProgressChart projectId="SR-001" />
        <RestorationProgressChart projectId="SR-002" />
        <RestorationProgressChart projectId="SR-003" />
        <RestorationProgressChart projectId="SR-004" />
        <RestorationProgressChart projectId="SR-005" />
        <RestorationProgressChart projectId="SR-006" />
      </div>

      <ImpactComparisonCharts />

      <DigitalTwinSection />
    </div>
  )
}
