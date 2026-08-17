import type {
  ImpactSummary,
  ProjectImpactData,
} from '../types'
import { fetchImpactSummaryApi, fetchProjectImpactDataApi } from './api'

// ---------------------------------------------------------------------------
// Impact Intelligence — Phase 7
// Uses backend API for data; deterministic calculations where needed.
// ---------------------------------------------------------------------------

export async function getProjectImpactData(
  projectId: string,
): Promise<ProjectImpactData | undefined> {
  try {
    const all = await fetchProjectImpactDataApi()
    return all.find((p: ProjectImpactData) => p.projectId === projectId)
  } catch {
    console.warn('Backend not available for getProjectImpactData')
    return undefined
  }
}

export async function getAllProjectImpactData(): Promise<ProjectImpactData[]> {
  try {
    return await fetchProjectImpactDataApi()
  } catch {
    console.warn('Backend not available for getAllProjectImpactData')
    return []
  }
}

export async function getImpactSummary(): Promise<ImpactSummary> {
  try {
    return await fetchImpactSummaryApi()
  } catch {
    console.warn('Backend not available for getImpactSummary')
    return {
      totalRestorationArea: 0,
      totalPlantsReported: 0,
      estimatedSurvivingPlants: 0,
      averageHealthScore: 0,
      projectsImproving: 0,
      projectsDeclining: 0,
      verifiedProjects: 0,
    }
  }
}

export function getRestorationProgressData(projectId: string) {
  const history: Record<string, { initial: number; previous: number; current: number; target: number }> = {
    'SR-001': { initial: 35, previous: 65, current: 82, target: 92 },
    'SR-002': { initial: 28, previous: 58, current: 74, target: 82 },
    'SR-003': { initial: 22, previous: 52, current: 66, target: 78 },
    'SR-004': { initial: 18, previous: 48, current: 58, target: 72 },
    'SR-005': { initial: 32, previous: 62, current: 78, target: 85 },
    'SR-006': { initial: 20, previous: 55, current: 71, target: 80 },
  }
  const h = history[projectId] ?? { initial: 25, previous: 50, current: 70, target: 80 }

  return [
    { stage: 'Initial', score: h.initial, label: 'Baseline' },
    { stage: 'Previous', score: h.previous, label: 'Q1 2026' },
    { stage: 'Current', score: h.current, label: 'Current' },
    { stage: 'Target', score: h.target, label: 'Goal' },
  ]
}
