import type {
  DegradationAlert,
  DegradationTrend,
  RiskLevel,
  Severity,
  TrendDirection,
  VegetationHistory,
} from '../types'
import {
  vegetationHistory,
  degradationAlerts,
  aiRecommendations,
} from '../data/mock'

// ---------------------------------------------------------------------------
// Deterministic degradation detection
// Compares historical and current vegetation coverage to derive trends.
// ---------------------------------------------------------------------------

export function getVegetationHistory(
  projectId: string,
): VegetationHistory | undefined {
  return vegetationHistory.find((v) => v.projectId === projectId)
}

export function computeDegradationTrend(
  history: VegetationHistory,
): DegradationTrend {
  const percentageChange =
    history.currentCoverage - history.previousCoverage
  const changePct = Math.abs(percentageChange)

  let trend: TrendDirection
  if (percentageChange >= 2) {
    trend = 'improving'
  } else if (percentageChange <= -2) {
    trend = 'declining'
  } else {
    trend = 'stable'
  }

  // Map the magnitude of decline to risk level
  let riskLevel: RiskLevel
  if (changePct >= 10) {
    riskLevel = 'critical'
  } else if (changePct >= 5) {
    riskLevel = 'high'
  } else if (changePct >= 3) {
    riskLevel = 'medium'
  } else {
    riskLevel = 'low'
  }

  // Improving projects get low risk regardless
  if (trend === 'improving') riskLevel = 'low'

  return {
    projectId: history.projectId,
    projectName: history.projectName,
    previousCoverage: history.previousCoverage,
    currentCoverage: history.currentCoverage,
    percentageChange,
    trend,
    riskLevel,
  }
}

export function getDegradationAlertsForProject(
  projectId: string,
): DegradationAlert[] {
  return degradationAlerts.filter((a) => a.projectId === projectId)
}

export function getAllDegradationAlerts(): DegradationAlert[] {
  return degradationAlerts
}

export function getDegradationAlertsBySeverity(
  severity: Severity,
): DegradationAlert[] {
  return degradationAlerts.filter((a) => a.severity === severity)
}

export function getAlertsByProject(): Map<string, DegradationAlert[]> {
  const map = new Map<string, DegradationAlert[]>()
  for (const alert of degradationAlerts) {
    const existing = map.get(alert.projectId) ?? []
    existing.push(alert)
    map.set(alert.projectId, existing)
  }
  return map
}

export function getAiRecommendationsForAlert(
  degradationAlertId: string,
) {
  return aiRecommendations.filter(
    (r) => r.degradationAlertId === degradationAlertId,
  )
}

export function getAiRecommendationsForProject(projectId: string) {
  return aiRecommendations.filter((r) => r.projectId === projectId)
}

export function getSeverityCounts(): Record<Severity, number> {
  const counts: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  }
  for (const alert of degradationAlerts) {
    counts[alert.severity]++
  }
  return counts
}
