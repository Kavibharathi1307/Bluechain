import {
  AlertTriangle,
  CheckCircle2,
  Leaf,
  Loader2,
  Sparkles,
  TrendingDown,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import type { AiAnalysisResult, VegetationCondition } from '../types'
import { aiConditionColor, aiConditionLabel } from '../lib/ui'

function ConditionIcon({ condition }: { condition: VegetationCondition }) {
  if (condition === 'healthy') {
    return <CheckCircle2 className="h-4 w-4 text-emerald-600" />
  }
  if (condition === 'moderate') {
    return <AlertTriangle className="h-4 w-4 text-amber-600" />
  }
  return <XCircle className="h-4 w-4 text-rose-600" />
}

interface AiAnalysisCardProps {
  analysis: AiAnalysisResult
  photoUrl: string
}

export default function AiAnalysisCard({
  analysis,
  photoUrl,
}: AiAnalysisCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50/50 to-white shadow-sm">
      <div className="border-b border-violet-100 bg-violet-50/60 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-100 text-violet-700">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-slate-900">
              AI Restoration Analysis
            </h4>
            <p className="text-[10px] font-medium text-violet-600">
              AI-assisted prototype analysis
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5 sm:flex-row">
        <div className="shrink-0 overflow-hidden rounded-lg border border-slate-200 sm:h-32 sm:w-40">
          <img
            src={photoUrl}
            alt="Analyzed evidence"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${aiConditionColor(
                analysis.vegetationCondition,
              )}`}
            >
              <ConditionIcon condition={analysis.vegetationCondition} />
              {aiConditionLabel(analysis.vegetationCondition)}
            </span>
            {analysis.possibleDegradation ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 ring-1 ring-inset ring-rose-200">
                <TrendingDown className="h-3 w-3" />
                Degradation detected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                <TrendingUp className="h-3 w-3" />
                No degradation
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white p-2.5 ring-1 ring-slate-100">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Vegetation coverage
              </p>
              <p className="mt-0.5 text-lg font-extrabold text-slate-900">
                {analysis.vegetationCoverage}
                <span className="text-xs font-semibold text-slate-400">%</span>
              </p>
            </div>
            <div className="rounded-lg bg-white p-2.5 ring-1 ring-slate-100">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                AI confidence
              </p>
              <p className="mt-0.5 text-lg font-extrabold text-slate-900">
                {analysis.confidence}
                <span className="text-xs font-semibold text-slate-400">%</span>
              </p>
            </div>
          </div>

          <p className="text-[12px] leading-relaxed text-slate-600">
            {analysis.explanation}
          </p>
        </div>
      </div>
    </div>
  )
}

export function AiAnalysisLoading() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50/50 p-4">
      <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
      <div>
        <p className="text-[13px] font-semibold text-slate-800">
          Analyzing with AI…
        </p>
        <p className="text-[11px] text-slate-500">
          Processing vegetation data and computing health metrics
        </p>
      </div>
    </div>
  )
}

export function AiHealthScoreCard({
  score,
  breakdown,
}: {
  score: number
  breakdown: { label: string; value: number; weight: number }[]
}) {
  return (
    <div className="rounded-xl border border-violet-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-100 text-violet-700">
          <Leaf className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-slate-900">
            Restoration Health Score
          </h3>
          <p className="text-[10px] text-slate-500">
            Calculated from evidence &amp; AI analysis
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="text-center">
          <p className="text-4xl font-extrabold tracking-tight text-slate-900">
            {score}
          </p>
          <p className="text-[11px] font-semibold text-slate-400">/100</p>
        </div>
        <div className="flex-1 space-y-2">
          {breakdown.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-600">
                  {item.label}{' '}
                  <span className="text-slate-400">({item.weight}%)</span>
                </span>
                <span className="font-bold text-slate-800">{item.value}</span>
              </div>
              <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-violet-500"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-3 text-[10px] text-slate-400">
        This is a transparent frontend calculation for prototype demonstration.
        Not scientifically validated.
      </p>
    </div>
  )
}
