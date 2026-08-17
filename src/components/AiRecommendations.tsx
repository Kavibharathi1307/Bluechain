import { Sparkles, ChevronRight } from 'lucide-react'
import type { AiRecommendation, DegradationAlert } from '../types'
import { severityBadge } from '../lib/ui'

interface AiRecommendationsProps {
  alert: DegradationAlert
  recommendations: AiRecommendation[]
}

export default function AiRecommendations({
  alert,
  recommendations,
}: AiRecommendationsProps) {
  if (recommendations.length === 0) return null

  return (
    <div className="rounded-xl border border-violet-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-50">
          <Sparkles className="h-4 w-4 text-violet-600" />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-slate-900">
            AI-Assisted Recommendations
          </h3>
          <p className="text-[11px] text-slate-400">
            For:{' '}
            <span className="font-medium text-slate-500">{alert.projectName}</span>
            {' — '}
            <span
              className={`inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ring-1 ring-inset ${severityBadge(
                alert.severity,
              )}`}
            >
              {alert.severity}
            </span>
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {recommendations.map((rec) => (
          <li
            key={rec.id}
            className="rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-violet-300 hover:bg-violet-50/40"
          >
            <div className="flex items-start gap-2">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
              <div>
                <p className="text-[13px] font-semibold text-slate-800">
                  {rec.action}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
                  {rec.rationale}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-center text-[10px] font-medium text-slate-400 italic">
        These are AI-assisted recommendations and should be validated by field experts before implementation.
      </p>
    </div>
  )
}
