import {
  BellRing,
  ClipboardCheck,
  Leaf,
  ShieldCheck,
  Wrench,
} from 'lucide-react'
import type { ActivityItem, ActivityType } from '../types'

const activityIcons: Record<ActivityType, typeof ShieldCheck> = {
  verification: ShieldCheck,
  planting: Leaf,
  survey: ClipboardCheck,
  alert: BellRing,
  maintenance: Wrench,
}

const activityTint: Record<ActivityType, string> = {
  verification: 'bg-emerald-50 text-emerald-600',
  planting: 'bg-ocean-50 text-ocean-600',
  survey: 'bg-sky-50 text-sky-600',
  alert: 'bg-rose-50 text-rose-600',
  maintenance: 'bg-amber-50 text-amber-600',
}

interface ActivityFeedProps {
  items: ActivityItem[]
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-[15px] font-bold text-slate-900">Recent Activity</h3>
      <p className="text-[11px] text-slate-500">
        Latest field reports and system events
      </p>

      <ul className="mt-4 space-y-3">
        {items.map((item) => {
          const Icon = activityIcons[item.type]
          return (
            <li
              key={item.id}
              className="flex gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:border-ocean-200 hover:bg-ocean-50/40"
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${activityTint[item.type]}`}
              >
                <Icon className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold leading-snug text-slate-800">
                    {item.title}
                  </p>
                  <span className="shrink-0 text-[11px] text-slate-400">
                    {item.timestamp}
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  {item.detail}
                </p>
                <p className="mt-1 text-[11px] font-medium text-ocean-700">
                  {item.actor}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
