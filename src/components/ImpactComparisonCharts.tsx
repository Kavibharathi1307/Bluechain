import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'
import { getAllProjectImpactData } from '../lib/impact'
import type { ProjectImpactData } from '../types'

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

const SHORT_NAMES: Record<string, string> = {
  'Sundarbans Mangrove Recovery': 'Sundarbans',
  'Gulf of Mannar Coral Regeneration': 'Mannar',
  'Chilika Lake Wetland Rehabilitation': 'Chilika',
  'Pichavaram Mangrove Restoration': 'Pichavaram',
  'Mandovi Estuary Blue Carbon Project': 'Mandovi',
  'Kavvayi Seagrass & Wetland Complex': 'Kavvayi',
}

const COLORS = [
  '#0d9488',
  '#06b6d4',
  '#10b981',
  '#f43f5e',
  '#8b5cf6',
  '#f59e0b',
]

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

export default function ImpactComparisonCharts() {
  const [data, setData] = useState<ProjectImpactData[]>([])

  useEffect(() => {
    getAllProjectImpactData()
      .then(setData)
      .catch(() => {})
  }, [])

  const areaData = data.map((d) => ({
    name: SHORT_NAMES[d.projectName] ?? d.projectName,
    area: d.restorationArea,
  }))

  const healthData = data.map((d) => ({
    name: SHORT_NAMES[d.projectName] ?? d.projectName,
    health: d.healthScore,
  }))

  const vegData = data.map((d) => ({
    name: SHORT_NAMES[d.projectName] ?? d.projectName,
    coverage: d.vegetationCoverage,
  }))

  const survivalData = data.map((d) => ({
    name: SHORT_NAMES[d.projectName] ?? d.projectName,
    survival: d.estimatedPlantSurvival,
  }))

  const radarData = data.map((d) => ({
    name: SHORT_NAMES[d.projectName] ?? d.projectName,
    health: d.healthScore,
    vegetation: d.vegetationCoverage,
    progress: d.restorationProgress,
  }))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Restoration Area Comparison */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <CardHeader
            title="Restoration Area"
            subtitle="Prototype estimate — hectares per project"
          />
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={areaData}
                margin={{ top: 0, right: 8, left: -18, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="area" name="Area (ha)" radius={[6, 6, 0, 0]} barSize={32}>
                  {areaData.map((_entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health Score Comparison */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <CardHeader
            title="Health Score"
            subtitle="Prototype estimate — composite health index"
          />
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={healthData}
                margin={{ top: 0, right: 8, left: -18, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis {...axisProps} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="health" name="Health Score" radius={[6, 6, 0, 0]} barSize={32}>
                  {healthData.map((_entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vegetation Coverage Comparison */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <CardHeader
            title="Vegetation Coverage"
            subtitle="Prototype estimate — current coverage percentage"
          />
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={vegData}
                margin={{ top: 0, right: 8, left: -18, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis {...axisProps} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="coverage" name="Vegetation (%)" radius={[6, 6, 0, 0]} barSize={32}>
                  {vegData.map((_entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Survival Estimate Comparison */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <CardHeader
            title="Estimated Plant Survival"
            subtitle="Prototype estimate — surviving plants count"
          />
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={survivalData}
                margin={{ top: 0, right: 8, left: -18, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [
                    Number(value).toLocaleString(),
                    'Surviving plants',
                  ]}
                />
                <Bar
                  dataKey="survival"
                  name="Surviving plants"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                >
                  {survivalData.map((_entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Radar Comparison */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-[15px] font-bold text-slate-900">
            Multi-Metric Comparison
          </h3>
          <p className="text-[11px] text-slate-500">
            Prototype estimate — Health, Vegetation & Progress overlay
          </p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="name" {...axisProps} />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
              />
              <Radar
                name="Health"
                dataKey="health"
                stroke="#0d9488"
                fill="#0d9488"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Radar
                name="Vegetation"
                dataKey="vegetation"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="Progress"
                dataKey="progress"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.08}
                strokeWidth={2}
              />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-center justify-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#0d9488]" />
            Health
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#06b6d4]" />
            Vegetation
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
            Progress
          </span>
        </div>
      </div>
    </div>
  )
}
