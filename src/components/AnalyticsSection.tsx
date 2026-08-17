import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
const vegetationTrend = [
  { month: 'Jan', vegetationCover: 41, speciesIndex: 38, waterQuality: 52 },
  { month: 'Feb', vegetationCover: 45, speciesIndex: 40, waterQuality: 55 },
  { month: 'Mar', vegetationCover: 49, speciesIndex: 43, waterQuality: 51 },
  { month: 'Apr', vegetationCover: 47, speciesIndex: 45, waterQuality: 48 },
  { month: 'May', vegetationCover: 53, speciesIndex: 47, waterQuality: 52 },
  { month: 'Jun', vegetationCover: 58, speciesIndex: 50, waterQuality: 56 },
  { month: 'Jul', vegetationCover: 64, speciesIndex: 54, waterQuality: 60 },
  { month: 'Aug', vegetationCover: 69, speciesIndex: 58, waterQuality: 58 },
  { month: 'Sep', vegetationCover: 73, speciesIndex: 62, waterQuality: 63 },
  { month: 'Oct', vegetationCover: 76, speciesIndex: 66, waterQuality: 61 },
  { month: 'Nov', vegetationCover: 80, speciesIndex: 70, waterQuality: 65 },
  { month: 'Dec', vegetationCover: 84, speciesIndex: 74, waterQuality: 68 },
]

const restorationImpact = [
  { label: 'Sundarbans', restored: 1860 },
  { label: 'Mannar', restored: 920 },
  { label: 'Chilika', restored: 1240 },
  { label: 'Pichavaram', restored: 640 },
  { label: 'Mandovi', restored: 720 },
  { label: 'Kavvayi', restored: 480 },
]

const ecosystemDistribution = [
  { name: 'Mangroves', value: 54, color: '#0d9488' },
  { name: 'Wetland', value: 22, color: '#10b981' },
  { name: 'Coral Reef', value: 12, color: '#06b6d4' },
  { name: 'Estuary', value: 8, color: '#f59e0b' },
  { name: 'Seagrass', value: 4, color: '#6366f1' },
]

const axisProps = {
  stroke: '#94a3b8',
  fontSize: 11,
  tickLine: false,
} as const

const tooltipStyle = {
  borderRadius: 8,
  border: '1px solid #e2e8f0',
  fontSize: 12,
  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
} as const

function CardHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <div className="mb-4">
      <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
      <p className="text-[11px] text-slate-500">{subtitle}</p>
    </div>
  )
}

export default function AnalyticsSection() {
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <CardHeader
            title="Ecosystem Recovery Trend"
            subtitle="Monthly composite indices across all verified sites"
          />
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={vegetationTrend}
                margin={{ top: 5, right: 8, left: -18, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="veg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="species" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="vegetationCover"
                  name="Vegetation Cover"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  fill="url(#veg)"
                />
                <Area
                  type="monotone"
                  dataKey="speciesIndex"
                  name="Species Index"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fill="url(#species)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <CardHeader
            title="Ecosystem Distribution"
            subtitle="Share of restoration area by ecosystem"
          />
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ecosystemDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="58%"
                  outerRadius="85%"
                  paddingAngle={2}
                  strokeWidth={2}
                >
                  {ecosystemDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <CardHeader
          title="Restoration Impact by Site"
          subtitle="Area restored to date (hectares) per project"
        />
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={restorationImpact}
              layout="vertical"
              margin={{ top: 0, right: 24, left: -8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" {...axisProps} />
              <YAxis
                type="category"
                dataKey="label"
                width={80}
                {...axisProps}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="restored" name="Area restored (ha)" radius={[0, 6, 6, 0]} barSize={20}>
                {restorationImpact.map((entry, index) => (
                  <Cell
                    key={entry.label}
                    fill={index % 2 === 0 ? '#339898' : '#277a7d'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
