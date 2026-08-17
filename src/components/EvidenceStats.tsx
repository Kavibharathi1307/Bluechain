import { CheckCircle2, Clock, FileText, XCircle } from 'lucide-react'

interface EvidenceStatsProps {
  total: number
  verified: number
  needsReview: number
  rejected: number
}

function Stat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof CheckCircle2
  label: string
  value: number
  color: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span
          className={`grid h-8 w-8 place-items-center rounded-lg ${color}`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
      </div>
      <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  )
}

export default function EvidenceStats({
  total,
  verified,
  needsReview,
  rejected,
}: EvidenceStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Stat
        icon={FileText}
        label="Total submissions"
        value={total}
        color="bg-ocean-50 text-ocean-700"
      />
      <Stat
        icon={CheckCircle2}
        label="Verified"
        value={verified}
        color="bg-emerald-50 text-emerald-700"
      />
      <Stat
        icon={Clock}
        label="Needs review"
        value={needsReview}
        color="bg-amber-50 text-amber-700"
      />
      <Stat
        icon={XCircle}
        label="Rejected"
        value={rejected}
        color="bg-rose-50 text-rose-700"
      />
    </div>
  )
}
