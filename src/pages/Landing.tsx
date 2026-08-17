import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Droplets,
  ShieldCheck,
  Satellite,
  BarChart3,
  BellRing,
  FileCheck2,
  ScanLine,
  TreePine,
  FlaskConical,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const features = [
  {
    icon: Satellite,
    title: 'Satellite-Driven Verification',
    text: 'Continuous NDVI and multispectral monitoring to confirm on-ground restoration progress without site visits.',
  },
  {
    icon: ShieldCheck,
    title: 'Immutable Audit Trail',
    text: 'Every verification event is anchored to a tamper-proof ledger, giving donors and regulators full traceability.',
  },
  {
    icon: FlaskConical,
    title: 'AI Health Scoring',
    text: 'A composite Restoration Health Index blending vegetation, biodiversity, water quality and sediment data.',
  },
  {
    icon: BellRing,
    title: 'Early-Warning Alerts',
    text: 'Predictive models flag erosion, salinity spikes and encroachment risks before they become crises.',
  },
  {
    icon: TreePine,
    title: 'Blue Carbon Accounting',
    text: 'Standardised estimation of carbon sequestration to support carbon credit issuance and ESG reporting.',
  },
  {
    icon: BarChart3,
    title: 'Impact Intelligence',
    text: 'Interactive dashboards translate raw field data into decisions-ready impact metrics for every stakeholder.',
  },
]

const steps = [
  {
    icon: ScanLine,
    step: '01',
    title: 'Observe',
    text: 'Satellites and IoT sensors continuously capture vegetation, water and shoreline data across the site.',
  },
  {
    icon: ShieldCheck,
    step: '02',
    title: 'Verify',
    text: 'AI models cross-check imagery against ground truth, and the result is recorded on the chain.',
  },
  {
    icon: TreePine,
    step: '03',
    title: 'Restore & Report',
    text: 'Teams act on verified intelligence, and impact reports update in real time for all stakeholders.',
  },
]

const partners = ['MoEF&CC', 'NITI Aayog', 'ISRO', 'WWF India', 'NDC Climate', 'TNC']

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-abyss-950/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-lg">
              <Droplets className="h-5 w-5" />
            </div>
            <p className="text-[15px] font-bold tracking-tight text-white">
              BlueChain <span className="text-ocean-300">2.0</span>
            </p>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <a href="#platform" className="hover:text-white">Platform</a>
            <a href="#impact" className="hover:text-white">Impact</a>
            <a href="#technology" className="hover:text-white">Technology</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-200 hover:text-white"
            >
              Sign in
            </Link>
            <Link
              to="/login"
              className="rounded-lg bg-ocean-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ocean-400"
            >
              Get started
            </Link>
          </div>

          <button
            type="button"
            className="rounded-md p-2 text-white md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {menuOpen && (
          <nav className="space-y-1 border-t border-white/10 bg-abyss-950 px-4 py-3 md:hidden">
            {['platform', 'impact', 'technology', 'contact'].map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
              >
                {id[0].toUpperCase() + id.slice(1)}
              </a>
            ))}
            <Link
              to="/login"
              className="block rounded-md bg-ocean-500 px-3 py-2 text-center text-sm font-semibold text-white"
            >
              Get started
            </Link>
          </nav>
        )}
      </header>

      <section className="relative overflow-hidden bg-abyss-950 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-ocean-500/20 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-ocean-400/40 bg-ocean-500/10 px-3 py-1 text-xs font-semibold text-ocean-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Smart India Hackathon · Coastal Conservation
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[54px]">
              Restoring coastlines with{' '}
              <span className="bg-gradient-to-r from-ocean-300 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                verified intelligence
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              BlueChain 2.0 unites satellite monitoring, AI analytics and an
              immutable audit trail to verify coastal restoration — from
              mangrove cover to blue carbon — with scientific confidence.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-ocean-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-ocean-900/50 transition-colors hover:bg-ocean-400"
              >
                Explore the platform
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#impact"
                className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
              >
                See the impact
              </a>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                ['26,900+', 'ha under restoration'],
                ['6', 'active coastal projects'],
                ['91%', 'verification accuracy'],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    {value}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-slate-400 sm:text-sm">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="hidden lg:block">
            <div className="relative mx-auto max-w-md">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between px-2">
                  <p className="text-sm font-bold text-white">Network Health</p>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                    +2.3 this quarter
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    ['82', 'Sundarbans', 'bg-emerald-500'],
                    ['74', 'Gulf of Mannar', 'bg-teal-500'],
                    ['58', 'Pichavaram', 'bg-rose-500'],
                  ].map(([score, name, color]) => (
                    <div
                      key={name}
                      className="rounded-xl bg-abyss-900/80 p-3 ring-1 ring-white/10"
                    >
                      <p className="text-xl font-extrabold text-white">{score}</p>
                      <div className={`mt-1.5 h-1.5 rounded-full ${color}`} style={{ width: '70%' }} />
                      <p className="mt-2 truncate text-[10px] text-slate-400">{name}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-xl bg-abyss-900/80 p-3 ring-1 ring-white/10">
                  <p className="text-[11px] font-semibold text-slate-400">
                    Vegetation cover trend
                  </p>
                  <div className="mt-2 flex h-24 items-end gap-1.5">
                    {[35, 42, 38, 50, 56, 52, 64, 70, 78, 74, 84, 90].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-gradient-to-t from-ocean-600 to-ocean-400"
                          style={{ height: `${h}%` }}
                        />
                      ),
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-ocean-500/15 p-3 ring-1 ring-ocean-400/30">
                  <div className="flex items-center gap-2">
                    <BellRing className="h-4 w-4 text-amber-300" />
                    <p className="text-[11px] font-semibold text-ocean-100">
                      Salinity spike · Chilika Lake
                    </p>
                  </div>
                  <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                    CRITICAL
                  </span>
                </div>
              </div>
              <div className="absolute -right-4 -top-6 rounded-xl bg-emerald-500/10 px-4 py-3 ring-1 ring-emerald-400/30 backdrop-blur">
                <p className="text-[11px] text-slate-300">AI verified</p>
                <p className="text-sm font-bold text-emerald-300">
                  Block #2481 ✓
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
            Working alongside India's conservation ecosystem
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {partners.map((p) => (
              <span
                key={p}
                className="text-sm font-bold tracking-wide text-slate-400"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            One platform. Every coastal signal.
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            From raw satellite pixels to auditable impact — BlueChain 2.0 closes
            the loop on coastal restoration.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-ocean-50 text-ocean-700 transition-colors group-hover:bg-ocean-600 group-hover:text-white">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="technology" className="bg-abyss-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              How verification works
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              A transparent pipeline from earth observation to stakeholder trust.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.step}
                className="relative rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-ocean-500/15 text-ocean-300">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <span className="text-4xl font-extrabold text-white/10">
                    {s.step}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="impact" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Measurable impact for every stakeholder
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Government agencies, NGOs, researchers and funders see the same
              verified numbers — no guesswork, no greenwashing.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                'Real-time restoration health scores',
                'Tamper-evident verification records',
                'Blue carbon and biodiversity accounting',
                'Early-warning for erosion and encroachment',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-ocean-600" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/login"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-ocean-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-ocean-700"
            >
              Open the dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['18,200', 'tCO₂e sequestered', 'from-emerald-500 to-teal-600'],
              ['4.2M', 'trees monitored', 'from-ocean-500 to-ocean-700'],
              ['12', 'sensors per site avg', 'from-sky-500 to-cyan-600'],
              ['100%', 'records on-chain', 'from-teal-400 to-emerald-600'],
            ].map(([value, label, gradient]) => (
              <div
                key={label}
                className={`rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-lg`}
              >
                <p className="text-3xl font-extrabold tracking-tight">{value}</p>
                <p className="mt-1 text-sm text-white/80">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-slate-100 bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Ready to bring verified restoration to your coast?
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Join the teams turning satellite signals into measurable coastal
            recovery.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-ocean-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-ocean-700"
            >
              Sign in to the platform
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="mailto:team@bluechain.example"
              className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-white"
            >
              Contact the team
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-abyss-950 py-10 text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-ocean-400 to-ocean-600 text-white">
              <Droplets className="h-4 w-4" />
            </div>
            <p className="text-sm font-bold text-white">
              BlueChain <span className="text-ocean-300">2.0</span>
            </p>
          </div>
          <p className="text-center text-xs">
            © {new Date().getFullYear()} BlueChain 2.0 · Built for Smart India
            Hackathon · Demo build — no data is real.
          </p>
          <nav className="flex gap-6 text-xs">
            <a href="#platform" className="hover:text-white">Platform</a>
            <a href="#impact" className="hover:text-white">Impact</a>
            <a href="#technology" className="hover:text-white">Technology</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
