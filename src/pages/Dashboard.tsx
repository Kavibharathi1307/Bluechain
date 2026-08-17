import StatCards from '../components/StatCards'
import MapView from '../components/MapView'
import HealthScoreCard from '../components/HealthScoreCard'
import ActiveAlerts from '../components/ActiveAlerts'
import AnalyticsSection from '../components/AnalyticsSection'
import ProjectCards from '../components/ProjectCards'

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Welcome back, Dr. Rao
          </h2>
          <p className="text-[13px] text-slate-500">
            Here's the latest intelligence across your coastal restoration
            network.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-slate-500">
          <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium shadow-sm">
            Last sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <StatCards />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MapView />
        </div>
        <div className="space-y-6">
          <HealthScoreCard />
          <ActiveAlerts />
        </div>
      </div>

      <AnalyticsSection />

      <ProjectCards />
    </div>
  )
}
