import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Droplets,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Satellite,
  BarChart3,
} from 'lucide-react'
import { login, setToken } from '../lib/api'

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('ananya.rao@bluechain.gov.in')
  const [password, setPassword] = useState('bluechain2.0')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await login(email, password)
      setToken(result.token)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-abyss-950 text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 bottom-1/4 h-96 w-96 rounded-full bg-ocean-500/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-lg">
            <Droplets className="h-5 w-5" />
          </div>
          <p className="text-lg font-bold tracking-tight">
            BlueChain <span className="text-ocean-300">2.0</span>
          </p>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
            Verified coastal restoration,{' '}
            <span className="bg-gradient-to-r from-ocean-300 to-emerald-300 bg-clip-text text-transparent">
              one signal at a time.
            </span>
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Monitor, verify and report restoration impact across India's
            coastline from a single intelligence dashboard.
          </p>

          <ul className="mt-10 space-y-4">
            {[
              [Satellite, 'Live satellite & sensor monitoring'],
              [ShieldCheck, 'Tamper-evident on-chain verification'],
              [BarChart3, 'Impact analytics for every stakeholder'],
            ].map(([Icon, text]) => {
              const IconComp = Icon as typeof Satellite
              return (
                <li key={text as string} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ocean-500/15 text-ocean-300">
                    <IconComp className="h-5 w-5" />
                  </span>
                  <span className="text-slate-200">{text as string}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <p className="relative text-xs text-slate-500">
          © {new Date().getFullYear()} BlueChain 2.0 · Demo environment for
          Smart India Hackathon
        </p>
      </div>

      <div className="flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white">
              <Droplets className="h-5 w-5" />
            </div>
            <p className="text-lg font-bold tracking-tight text-slate-900">
              BlueChain <span className="text-ocean-600">2.0</span>
            </p>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Sign in to your workspace
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Access the coastal restoration intelligence dashboard.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none ring-ocean-500/30 transition-shadow focus:border-ocean-500 focus:ring-2"
                  placeholder="you@organization.gov.in"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-semibold text-ocean-700 hover:text-ocean-800"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none ring-ocean-500/30 transition-shadow focus:border-ocean-500 focus:ring-2"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-ocean-600"
                />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-ocean-600 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-ocean-700 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-center text-xs text-slate-500">
            Demo credentials pre-filled —{' '}
            <span className="font-semibold text-slate-700">press Sign in</span>{' '}
            to continue.
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <a href="#" className="font-semibold text-ocean-700 hover:text-ocean-800">
              Request access
            </a>
          </p>

          <p className="mt-8 text-center text-xs text-slate-400">
            <Link to="/" className="font-semibold text-slate-500 hover:text-slate-700">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
