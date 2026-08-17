const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface HealthScoreGaugeProps {
  score: number
  label?: string
}

export default function HealthScoreGauge({
  score,
  label = 'of 100',
}: HealthScoreGaugeProps) {
  const offset = CIRCUMFERENCE * (1 - score / 100)

  return (
    <div className="relative h-[148px] w-[148px]">
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
          stroke="url(#bcHealthGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 74 74)"
        />
        <defs>
          <linearGradient id="bcHealthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-3xl font-extrabold tracking-tight text-slate-900">
          {score}
        </p>
        <p className="text-[11px] font-medium text-slate-500">{label}</p>
      </div>
    </div>
  )
}
