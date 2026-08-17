import {
  fetchAuditRecordsApi,
  fetchAuditRecordByIdApi,
  fetchAuditRecordsByProjectApi,
  verifyChainIntegrityApi,
} from './api'
import type { AuditRecord } from '../types'

export const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000'

export async function fetchAuditRecords(): Promise<AuditRecord[]> {
  try {
    return await fetchAuditRecordsApi()
  } catch {
    console.warn('Backend not available for fetchAuditRecords')
    return []
  }
}

export async function fetchAuditRecordById(
  recordId: string,
): Promise<AuditRecord | undefined> {
  try {
    return await fetchAuditRecordByIdApi(recordId)
  } catch {
    console.warn('Backend not available for fetchAuditRecordById')
    return undefined
  }
}

export async function fetchAuditRecordsByProject(
  projectId: string,
): Promise<AuditRecord[]> {
  try {
    return await fetchAuditRecordsByProjectApi(projectId)
  } catch {
    console.warn('Backend not available for fetchAuditRecordsByProject')
    return []
  }
}

export interface ChainIntegrityResult {
  valid: boolean
  checkedCount: number
  firstInvalidRecordId: string | null
}

export async function verifyChainIntegrity(): Promise<ChainIntegrityResult> {
  try {
    return await verifyChainIntegrityApi()
  } catch {
    console.warn('Backend not available for verifyChainIntegrity')
    return { valid: false, checkedCount: 0, firstInvalidRecordId: null }
  }
}

export function getAuditStats(records: AuditRecord[]) {
  const total = records.length
  const verified = records.filter((r) => r.verificationStatus === 'verified').length
  const pending = records.filter((r) => r.verificationStatus === 'pending').length
  const rejected = records.filter((r) => r.verificationStatus === 'rejected').length
  const lastTimestamp =
    records.length > 0 ? records[records.length - 1].timestamp : null
  return { total, verified, pending, rejected, lastTimestamp }
}

// Project name lookup is kept in the frontend since audit records
// from the backend now contain projectId but we can resolve via projects.
const projectNames: Record<string, string> = {
  'SR-001': 'Sundarbans Mangrove Recovery',
  'SR-002': 'Gulf of Mannar Coral Regeneration',
  'SR-003': 'Chilika Lake Wetland Rehabilitation',
  'SR-004': 'Pichavaram Mangrove Restoration',
  'SR-005': 'Mandovi Estuary Blue Carbon Project',
  'SR-006': 'Kavvayi Seagrass & Wetland Complex',
}

export function getProjectName(projectId: string): string {
  return projectNames[projectId] ?? projectId
}
