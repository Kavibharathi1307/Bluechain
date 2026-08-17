import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Sparkles,
  User,
  XCircle,
} from 'lucide-react'
import type { AiAnalysisResult, EvidenceSubmission } from '../types'
import { evidenceStatusColor, evidenceStatusLabel } from '../lib/ui'
import AiAnalysisCard from './AiAnalysisCard'

function StatusIcon({ status }: { status: EvidenceSubmission['status'] }) {
  if (status === 'verified') {
    return <CheckCircle2 className="h-4 w-4 text-emerald-600" />
  }
  if (status === 'needs-review') {
    return <Clock className="h-4 w-4 text-amber-600" />
  }
  return <XCircle className="h-4 w-4 text-rose-600" />
}

interface EvidenceCardProps {
  evidence: EvidenceSubmission
  analysis?: AiAnalysisResult | null
  isAnalyzing?: boolean
  onAnalyze?: () => void
}

export default function EvidenceCard({
  evidence,
  analysis,
  isAnalyzing,
  onAnalyze,
}: EvidenceCardProps) {
  const capturedDate = new Date(evidence.capturedAt)
  const submittedDate = new Date(evidence.submittedAt)

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={evidence.photoUrl}
          alt={`Evidence ${evidence.id}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span className="absolute right-2 top-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${evidenceStatusColor(
              evidence.status,
            )}`}
          >
            <StatusIcon status={evidence.status} />
            {evidenceStatusLabel(evidence.status)}
          </span>
        </span>
        <span className="absolute left-2 top-2 rounded-md bg-abyss-900/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
          {evidence.id}
        </span>
      </div>

      <div className="p-4">
        <p className="text-[13px] leading-relaxed text-slate-600">
          {evidence.notes}
        </p>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <User className="h-3 w-3 shrink-0" />
            <span className="font-medium text-slate-700">
              {evidence.submittedBy}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <MapPin className="h-3 w-3 shrink-0" />
            <span>
              {evidence.latitude.toFixed(4)}, {evidence.longitude.toFixed(4)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Clock className="h-3 w-3 shrink-0" />
            <span>Captured {capturedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        {evidence.validationReasons.length > 0 && (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
              <div className="space-y-1">
                {evidence.validationReasons.map((reason, i) => (
                  <p key={i} className="text-[11px] leading-relaxed text-amber-800">
                    {reason}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 border-t border-slate-100 pt-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-slate-400">
              Submitted {submittedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at{' '}
              {submittedDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
            {onAnalyze && !analysis && (
              <button
                type="button"
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700 transition-colors hover:bg-violet-100 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                {isAnalyzing ? 'Analyzing…' : 'Analyze with AI'}
              </button>
            )}
          </div>
        </div>
      </div>

      {analysis && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3">
          <AiAnalysisCard analysis={analysis} photoUrl={evidence.photoUrl} />
        </div>
      )}
    </div>
  )
}
