import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  Waves,
  Bell,
  BarChart3,
  Link2,
  FileText,
  LifeBuoy,
  LogOut,
  Settings,
  Droplets,
} from 'lucide-react'
import { clearToken, getCurrentUser } from '../lib/api'

const navSections = [
  {
    heading: 'Monitor',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/dashboard/map', label: 'Restoration Map', icon: Map },
      { to: '/dashboard/alerts', label: 'Active Alerts', icon: Bell, badge: 5 },
    ],
  },
  {
    heading: 'Manage',
    items: [
      { to: '/dashboard/projects', label: 'Projects', icon: Waves },
      { to: '/dashboard/analytics', label: 'Impact Intelligence', icon: BarChart3 },
      { to: '/dashboard/verification', label: 'Blockchain Audit', icon: Link2 },
      { to: '/dashboard/reports', label: 'Reports', icon: FileText },
    ],
  },
  {
    heading: 'System',
    items: [
      { to: '/dashboard/settings', label: 'Settings', icon: Settings },
      { to: '/dashboard/support', label: 'Support', icon: LifeBuoy },
    ],
  },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const displayName = user?.name ?? 'Dr. Ananya Rao'
  const displayRole = user?.role === 'admin' ? 'Research Coordinator' : user?.role ?? 'Research Coordinator'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleLogout = () => {
    clearToken()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-abyss-900 text-slate-300">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-lg shadow-ocean-900/40">
          <Droplets className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="text-[15px] font-bold tracking-tight text-white">
            BlueChain <span className="text-ocean-300">2.0</span>
          </p>
          <p className="text-[11px] text-slate-400">Coastal Intelligence</p>
        </div>
      </div>

      <nav className="nice-scroll flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.heading}>
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              {section.heading}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={'end' in item ? item.end : false}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-ocean-600/20 text-white ring-1 ring-inset ring-ocean-500/30'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  <span className="flex-1">{item.label}</span>
                  {'badge' in item && item.badge ? (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-ocean-600 text-sm font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold text-white">
              {displayName}
            </p>
            <p className="truncate text-[11px] text-slate-400">
              {displayRole}
            </p>
          </div>
          <button
            type="button"
            title="Sign out"
            onClick={handleLogout}
            className="rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
