import { Bell, ChevronDown, Menu, Search } from 'lucide-react'

interface TopNavProps {
  title: string
  onMenuClick: () => void
}

export default function TopNav({ title, onMenuClick }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="lg:hidden rounded-md p-2 text-slate-500 hover:bg-slate-100"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0">
        <h1 className="truncate text-[15px] font-bold text-slate-900 sm:text-lg">
          {title}
        </h1>
        <p className="hidden text-[11px] text-slate-500 sm:block">
          Coastal Restoration Operations Center
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-slate-600">
            Satellite sync live
          </span>
        </div>

        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 lg:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search sites, alerts…"
            className="w-44 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <button
          type="button"
          className="relative rounded-md p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
            3
          </span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-slate-200 py-1.5 pl-1.5 pr-2.5 hover:bg-slate-50"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-ocean-600 text-xs font-bold text-white">
            AR
          </span>
          <span className="hidden text-sm font-medium text-slate-700 sm:block">
            Ananya
          </span>
          <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
        </button>
      </div>
    </header>
  )
}
