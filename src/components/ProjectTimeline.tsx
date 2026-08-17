import { Check, CircleDashed, Loader2 } from 'lucide-react'
import type { TimelinePhase } from '../types'

interface ProjectTimelineProps {
  phases: TimelinePhase[]
}

function PhaseIcon({ status }: { status: TimelinePhase['status'] }) {
  if (status === 'completed') {
    return (
      <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-emerald-700 ring-4 ring-white">
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
    )
  }
  if (status === 'in-progress') {
    return (
      <span className="grid h-7 w-7 place-items-center rounded-full bg-ocean-100 text-ocean-700 ring-4 ring-white">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    )
  }
  return (
    <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-slate-400 ring-4 ring-white">
      <CircleDashed className="h-4 w-4" />
    </span>
  )
}

export default function ProjectTimeline({ phases }: ProjectTimelineProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-[15px] font-bold text-slate-900">
        Restoration Timeline
      </h3>
      <p className="text-[11px] text-slate-500">
        Milestones from registration to verification
      </p>

      <ol className="mt-5 space-y-0">
        {phases.map((phase, index) => (
          <li key={phase.id} className="relative flex gap-3">
            {index < phases.length - 1 && (
              <span className="absolute left-[13px] top-8 h-full w-px bg-slate-200" />
            )}
            <PhaseIcon status={phase.status} />
            <div className="min-w-0 flex-1 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <p className="text-[13px] font-bold leading-snug text-slate-800">
                  {phase.label}
                </p>
                <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {phase.date}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {phase.detail}
              </p>
              {phase.status === 'in-progress' && (
                <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-ocean-700">
                  In progress
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
