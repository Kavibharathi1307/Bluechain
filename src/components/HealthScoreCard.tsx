import { ArrowUpRight } from 'lucide-react'
const healthBreakdown = [
  { label: 'Vegetation Cover', value: 78, delta: +4.2 },
  { label: 'Species Diversity', value: 72, delta: +2.1 },
  { label: 'Water Quality', value: 64, delta: -3.4 },
  { label: 'Sediment Stability', value: 81, delta: +1.8 },
  { label: 'Blue Carbon Uptake', value: 76, delta: +5.0 },
]
import { healthBarColor } from '../lib/ui'

const SCORE = 71.5
const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function HealthScoreCard() {
  const offset = CIRCUMFERENCE * (1 - SCORE / 100)

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-slate-900">
          Restoration Health Score
        </h2>
        <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700 ring-1 ring-inset ring-teal-200">
          Composite Index
        </span>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <div className="relative">
          <svg width="148" height="148" viewBox="0 0 148 148">
            <circle
              cx="74"
              cy="74"
              r={RADIUS}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="12"
            />
            <circle
              cx="74"
              cy="74"
              r={RADIUS}
              fill="none"
              stroke="url(#healthGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              transform="rotate(-90 74 74)"
            />
            <defs>
              <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-extrabold tracking-tight text-slate-900">
              {SCORE}
            </p>
            <p className="text-[11px] font-medium text-slate-500">of 100</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {healthBreakdown.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-medium text-slate-600">{item.label}</span>
              <span className="flex items-center gap-1.5">
                <span
                  className={`font-semibold ${
                    item.delta >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {item.delta >= 0 ? '+' : ''}
                  {item.delta}%
                </span>
                <span className="font-bold text-slate-900">{item.value}</span>
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${healthBarColor(item.value)}`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-ocean-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean-700"
      >
        View health report
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </section>
  )
}
