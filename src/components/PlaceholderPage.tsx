import type { LucideIcon } from 'lucide-react'
import { Hammer, ChevronRight } from 'lucide-react'

interface PlaceholderPageProps {
  title: string
  description: string
  icon: LucideIcon
  features: string[]
}

export default function PlaceholderPage({
  title,
  description,
  icon: Icon,
  features,
}: PlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-ocean-50 text-ocean-700">
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h2>
            <p className="mt-2 text-slate-500">{description}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
            >
              <ChevronRight className="h-4 w-4 text-ocean-600" />
              {f}
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Hammer className="h-5 w-5 shrink-0" />
          <p>
            This module is scoped for the next phase. The foundation UI is in
            place so navigation is fully wired for the hackathon demo.
          </p>
        </div>
      </div>
    </div>
  )
}
