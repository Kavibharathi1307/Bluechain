import { useParams } from 'react-router-dom'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts'
import { getRestorationProgressData } from '../lib/impact'

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

const COLORS = ['#94a3b8', '#06b6d4', '#0d9488', '#f59e0b']

export default function RestorationProgressChart({
  projectId,
}: {
  projectId?: string
}) {
  const { projectId: routeId } = useParams<{ projectId: string }>()
  const id = projectId ?? routeId
  if (!id) return null

  const data = getRestorationProgressData(id)
  if (!data) return null

  const maxScore = Math.max(...data.map((d) => d.score), 100)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-[15px] font-bold text-slate-900">
          Restoration Progress
        </h3>
        <p className="text-[11px] text-slate-500">
          Prototype estimate — Initial → Previous → Current → Target
        </p>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />
            <XAxis dataKey="stage" {...axisProps} />
            <YAxis {...axisProps} domain={[0, maxScore + 5]} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [`${value}`, 'Health Score']}
            />
            <ReferenceLine
              y={data[data.length - 1].score}
              stroke="#f59e0b"
              strokeDasharray="6 3"
              strokeWidth={1.5}
              label={{
                value: 'Target',
                position: 'right',
                fontSize: 10,
                fill: '#f59e0b',
                fontWeight: 700,
              }}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={48}>
              {data.map((_entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500">
        {data.map((d, i) => (
          <span key={d.stage} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[i] }}
            />
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}
