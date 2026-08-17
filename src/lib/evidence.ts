import { fetchEvidenceByProjectApi, submitEvidenceApi } from './api'
import type {
  EvidenceStatus,
  EvidenceSubmission,
} from '../types'

/**
 * Fetch evidence for a project from the backend API.
 */
export async function fetchEvidenceByProject(
  projectId: string,
): Promise<EvidenceSubmission[]> {
  try {
    return await fetchEvidenceByProjectApi(projectId)
  } catch {
    console.warn('Backend not available for fetchEvidenceByProject')
    return []
  }
}

export async function fetchAllEvidence(): Promise<EvidenceSubmission[]> {
  return []
}

export interface ValidationResult {
  status: EvidenceStatus
  reasons: string[]
}

export function validateEvidence(
  data: {
    latitude: number
    longitude: number
    capturedAt: string
    notes: string
    photoUrl: string
  },
  projectId: string,
  existing: EvidenceSubmission[],
): ValidationResult {
  const reasons: string[] = []

  if (!data.photoUrl) {
    reasons.push('Photo is required.')
  }
  if (!data.capturedAt) {
    reasons.push('Capture date/time is required.')
  }
  if (!data.notes.trim()) {
    reasons.push('Notes are required.')
  }
  if (data.latitude === 0 && data.longitude === 0) {
    reasons.push('GPS coordinates are required.')
  }

  const CAPTURED_THRESHOLD_MS = 24 * 60 * 60 * 1000
  const DIST_THRESHOLD = 0.05
  const capDate = new Date(data.capturedAt).getTime()

  for (const item of existing) {
    if (item.projectId !== projectId) continue
    const itemDate = new Date(item.capturedAt).getTime()
    const timeDiff = Math.abs(capDate - itemDate)
    const dist =
      Math.abs(data.latitude - item.latitude) +
      Math.abs(data.longitude - item.longitude)

    if (timeDiff < CAPTURED_THRESHOLD_MS && dist < DIST_THRESHOLD) {
      reasons.push(
        `Duplicate evidence: similar GPS location and date as ${item.id}.`,
      )
    }
  }

  let status: EvidenceStatus = 'verified'
  if (reasons.length > 0) {
    status = 'needs-review'
  }

  return { status, reasons }
}

export async function submitEvidence(
  input: {
    projectId: string
    photoUrl: string
    latitude: number
    longitude: number
    capturedAt: string
    notes: string
    submittedBy: string
  },
  _existing: EvidenceSubmission[],
): Promise<EvidenceSubmission> {
  try {
    return await submitEvidenceApi(input)
  } catch (err) {
    console.warn('Backend not available for submitEvidence, using local fallback')
    const now = new Date().toISOString()
    const id = `EV-${String(Date.now()).slice(-3)}`
    return {
      id,
      projectId: input.projectId,
      photoUrl: input.photoUrl,
      latitude: input.latitude,
      longitude: input.longitude,
      capturedAt: input.capturedAt,
      submittedBy: input.submittedBy,
      notes: input.notes,
      status: 'needs-review',
      validationReasons: [],
      submittedAt: now,
    }
  }
}

export function getEvidenceStats(submissions: EvidenceSubmission[]) {
  const total = submissions.length
  const verified = submissions.filter((e) => e.status === 'verified').length
  const needsReview = submissions.filter((e) => e.status === 'needs-review').length
  const rejected = submissions.filter((e) => e.status === 'rejected').length
  return { total, verified, needsReview, rejected }
}
