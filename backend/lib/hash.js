import { createHash as nodeCreateHash } from 'crypto'

const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000'

export async function createHash(payload) {
  return nodeCreateHash('sha256').update(payload).digest('hex')
}

export async function computeRecordHash(record) {
  const payload = [
    record.recordId,
    record.projectId,
    record.evidenceId,
    record.verificationStatus,
    record.timestamp,
    record.previousHash,
    record.verifier,
  ].join('|')
  return createHash(payload)
}

export async function verifyChain(records) {
  if (!records || records.length === 0) {
    return { valid: true, checkedCount: 0, firstInvalidRecordId: null }
  }

  if (records[0].previousHash !== GENESIS_HASH) {
    return { valid: false, checkedCount: 1, firstInvalidRecordId: records[0].recordId }
  }

  for (let i = 1; i < records.length; i++) {
    if (records[i].previousHash !== records[i - 1].currentHash) {
      return { valid: false, checkedCount: i + 1, firstInvalidRecordId: records[i].recordId }
    }

    const recomputed = await computeRecordHash(records[i])
    if (recomputed !== records[i].currentHash) {
      return { valid: false, checkedCount: i + 1, firstInvalidRecordId: records[i].recordId }
    }
  }

  const lastRecomputed = await computeRecordHash(records[0])
  if (lastRecomputed !== records[0].currentHash) {
    return { valid: false, checkedCount: 1, firstInvalidRecordId: records[0].recordId }
  }

  return { valid: true, checkedCount: records.length, firstInvalidRecordId: null }
}
