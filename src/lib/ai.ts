import type {
  AiAnalysisResult,
  EvidenceSubmission,
  RestorationHealthScore,
  VegetationCondition,
} from '../types'

const LATENCY = 800
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

// ---------------------------------------------------------------------------
// Deterministic hash — same input always produces the same output.
// We use this so the "AI" analysis is repeatable across page reloads.
// ---------------------------------------------------------------------------

function hashString(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

// ---------------------------------------------------------------------------
// Deterministic mock AI analysis for each evidence submission.
// Results are derived from the evidence ID so they never change.
// ---------------------------------------------------------------------------

const EXPLANATIONS: Record<VegetationCondition, string[]> = {
  healthy: [
    'Dense canopy with vibrant green foliage detected. No visible signs of stress or disease.',
    'Strong vegetative growth across the frame. Leaf density suggests healthy root establishment.',
    'Well-established vegetation with good structural diversity. Species appear robust.',
  ],
  moderate: [
    'Moderate vegetation coverage with some patchy areas. Signs of seasonal variation.',
    'Mixed canopy health — some sections show vigorous growth while others appear stressed.',
    'Vegetation present but coverage is uneven. Possible water stress in lower sections.',
  ],
  poor: [
    'Sparse vegetation with significant bare ground visible. Possible erosion or dieback.',
    'Low canopy density with yellowing leaves. Signs of environmental stress or nutrient deficiency.',
    'Limited vegetation growth. Area may require replanting or additional soil rehabilitation.',
  ],
}

export function getDeterministicAnalysis(
  evidence: EvidenceSubmission,
): AiAnalysisResult {
  const hash = hashString(evidence.id)

  // Vegetation condition: weighted — healthy 50%, moderate 35%, poor 15%
  const condRoll = hash % 100
  let condition: VegetationCondition
  if (condRoll < 50) {
    condition = 'healthy'
  } else if (condRoll < 85) {
    condition = 'moderate'
  } else {
    condition = 'poor'
  }

  // Coverage: 15-92% based on condition
  const baseCoverage =
    condition === 'healthy' ? 65 : condition === 'moderate' ? 40 : 18
  const coverageJitter = (hash % 28) // 0-27
  const vegetationCoverage = Math.min(92, baseCoverage + coverageJitter)

  // Confidence: 62-97% — deterministic from hash
  const confidence = 62 + (hash % 36)

  // Degradation: true if poor condition OR coverage < 30%
  const possibleDegradation = condition === 'poor' || vegetationCoverage < 30

  // Pick explanation from pool using hash
  const explanationPool = EXPLANATIONS[condition]
  const explanationIdx = hash % explanationPool.length

  return {
    evidenceId: evidence.id,
    vegetationCondition: condition,
    vegetationCoverage,
    confidence,
    possibleDegradation,
    explanation: explanationPool[explanationIdx],
    analyzedAt: new Date().toISOString(),
  }
}

/**
 * Simulated AI analysis API. Returns deterministic results after a
 * short delay to mimic model inference time.
 */
export async function analyzeEvidence(
  evidence: EvidenceSubmission,
): Promise<AiAnalysisResult> {
  await delay(LATENCY)
  return getDeterministicAnalysis(evidence)
}

/**
 * Run AI analysis on a batch of evidence submissions.
 */
export async function analyzeEvidenceBatch(
  submissions: EvidenceSubmission[],
): Promise<AiAnalysisResult[]> {
  await delay(LATENCY + 200)
  return submissions.map((s) => getDeterministicAnalysis(s))
}

// ---------------------------------------------------------------------------
// Restoration Health Score — transparent frontend calculation
// ---------------------------------------------------------------------------

export function calculateRestorationHealthScore(
  analyses: AiAnalysisResult[],
  evidenceSubmissions: EvidenceSubmission[],
): RestorationHealthScore {
  if (analyses.length === 0) {
    return {
      score: 0,
      breakdown: [
        { label: 'Evidence verification', value: 0, weight: 30 },
        { label: 'AI vegetation condition', value: 0, weight: 30 },
        { label: 'AI confidence', value: 0, weight: 20 },
        { label: 'Vegetation coverage', value: 0, weight: 20 },
      ],
    }
  }

  // 1. Evidence verification score (30%)
  // verified=100, needs-review=50, rejected=0
  const verificationScore =
    evidenceSubmissions.reduce((sum, e) => {
      if (e.status === 'verified') return sum + 100
      if (e.status === 'needs-review') return sum + 50
      return sum
    }, 0) / evidenceSubmissions.length

  // 2. AI vegetation condition score (30%)
  // healthy=100, moderate=60, poor=20
  const conditionScore =
    analyses.reduce((sum, a) => {
      if (a.vegetationCondition === 'healthy') return sum + 100
      if (a.vegetationCondition === 'moderate') return sum + 60
      return sum + 20
    }, 0) / analyses.length

  // 3. AI confidence score (20%)
  const confidenceScore =
    analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length

  // 4. Vegetation coverage score (20%)
  const coverageScore =
    analyses.reduce((sum, a) => sum + a.vegetationCoverage, 0) / analyses.length

  const score = Math.round(
    verificationScore * 0.3 +
      conditionScore * 0.3 +
      confidenceScore * 0.2 +
      coverageScore * 0.2,
  )

  return {
    score,
    breakdown: [
      {
        label: 'Evidence verification',
        value: Math.round(verificationScore),
        weight: 30,
      },
      {
        label: 'AI vegetation condition',
        value: Math.round(conditionScore),
        weight: 30,
      },
      {
        label: 'AI confidence',
        value: Math.round(confidenceScore),
        weight: 20,
      },
      {
        label: 'Vegetation coverage',
        value: Math.round(coverageScore),
        weight: 20,
      },
    ],
  }
}

export function getAiStats(analyses: AiAnalysisResult[]) {
  const analyzed = analyses.length
  const avgCoverage =
    analyzed > 0
      ? Math.round(
          analyses.reduce((s, a) => s + a.vegetationCoverage, 0) / analyzed,
        )
      : 0
  const avgConfidence =
    analyzed > 0
      ? Math.round(
          analyses.reduce((s, a) => s + a.confidence, 0) / analyzed,
        )
      : 0
  const degradationFlags = analyses.filter((a) => a.possibleDegradation).length
  return { analyzed, avgCoverage, avgConfidence, degradationFlags }
}
