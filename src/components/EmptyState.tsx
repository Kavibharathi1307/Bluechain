import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-ocean-50 text-ocean-600">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-bold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-slate-500">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-lg bg-ocean-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-ocean-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
