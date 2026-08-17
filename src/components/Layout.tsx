import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  Waves,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Droplets,
  X,
} from 'lucide-react'
import Sidebar from './Sidebar'
import TopNav from './TopNav'

const mobileNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/map', label: 'Restoration Map', icon: Map },
  { to: '/dashboard/projects', label: 'Projects', icon: Waves },
  { to: '/dashboard/analytics', label: 'Impact Intelligence', icon: BarChart3 },
  { to: '/dashboard/alerts', label: 'Active Alerts', icon: Bell },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard Overview',
  '/dashboard/map': 'Restoration Map',
  '/dashboard/alerts': 'Active Alerts',
  '/dashboard/projects': 'Restoration Projects',
  '/dashboard/analytics': 'Impact Analytics',
  '/dashboard/verification': 'Blockchain Audit',
  '/dashboard/reports': 'Reports',
  '/dashboard/settings': 'Settings',
  '/dashboard/support': 'Support',
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const title = location.pathname.startsWith('/dashboard/projects/')
    ? 'Project Details'
    : titles[location.pathname] ?? 'Dashboard Overview'

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav title={title} onMenuClick={() => setMenuOpen(true)} />

        <main className="nice-scroll flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-abyss-950/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-abyss-900 text-slate-300 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 h-16">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white">
                  <Droplets className="h-5 w-5" />
                </div>
                <p className="text-[15px] font-bold text-white">
                  BlueChain <span className="text-ocean-300">2.0</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-md p-2 text-slate-400 hover:bg-white/10 hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="nice-scroll flex-1 space-y-1 overflow-y-auto p-3">
              {mobileNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive
                        ? 'bg-ocean-600/20 text-white ring-1 ring-inset ring-ocean-500/30'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-white/10 p-3">
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <LogOut className="h-[18px] w-[18px]" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
