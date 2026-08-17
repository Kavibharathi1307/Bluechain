import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  Link2,
  ShieldCheck,
  ShieldAlert,
  XCircle,
  Loader2,
  Info,
} from 'lucide-react'
import type { AuditRecord } from '../types'
import {
  fetchAuditRecords,
  verifyChainIntegrity,
  getAuditStats,
  getProjectName,
  GENESIS_HASH,
  type ChainIntegrityResult,
} from '../lib/audit'

// ---------------------------------------------------------------------------
// Badge helpers
// ---------------------------------------------------------------------------

function StatusIcon({ status }: { status: AuditRecord['verificationStatus'] }) {
  if (status === 'verified') return <CheckCircle2 className="h-4 w-4 text-emerald-600" />
  if (status === 'pending') return <Clock className="h-4 w-4 text-amber-600" />
  return <XCircle className="h-4 w-4 text-rose-600" />
}

function statusBadge(status: AuditRecord['verificationStatus']) {
  switch (status) {
    case 'verified':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    case 'pending':
      return 'bg-amber-50 text-amber-700 ring-amber-200'
    case 'rejected':
      return 'bg-rose-50 text-rose-700 ring-rose-200'
  }
}

// ---------------------------------------------------------------------------
// Record detail panel
// ---------------------------------------------------------------------------

function RecordDetail({
  record,
  onClose,
}: {
  record: AuditRecord
  onClose: () => void
}) {
  const ts = new Date(record.timestamp)
  const projectName = getProjectName(record.projectId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-abyss-950/60 backdrop-blur-sm">
      <div className="mx-4 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-ocean-50 text-ocean-700">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{record.recordId}</p>
              <p className="text-[11px] text-slate-500">Audit Record Detail</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {/* Evidence Info */}
          <div>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Evidence Information
            </h3>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
              <DetailRow label="Evidence ID" value={record.evidenceId} />
              <DetailRow label="Project ID" value={record.projectId} />
              <DetailRow label="Project Name" value={projectName} />
            </div>
          </div>

          {/* Verification Info */}
          <div>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Verification Information
            </h3>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
              <DetailRow label="Verification Status">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ring-inset ${statusBadge(record.verificationStatus)}`}>
                  <StatusIcon status={record.verificationStatus} />
                  {record.verificationStatus.charAt(0).toUpperCase() + record.verificationStatus.slice(1)}
                </span>
              </DetailRow>
              <DetailRow label="Verifier" value={record.verifier} />
              <DetailRow label="Timestamp" value={ts.toLocaleString('en-IN')} />
            </div>
          </div>

          {/* Hash Info */}
          <div>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Chain Hashes
            </h3>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div>
                <p className="mb-1 text-[11px] font-medium text-slate-500">Previous Hash</p>
                <code className="block break-all rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-[11px] text-slate-700">
                  {record.previousHash === GENESIS_HASH ? 'GENESIS' : record.previousHash}
                </code>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex h-8 items-center text-slate-300">
                  <Link2 className="h-4 w-4 rotate-90" />
                </div>
              </div>
              <div>
                <p className="mb-1 text-[11px] font-medium text-slate-500">Current Hash</p>
                <code className="block break-all rounded-md border border-ocean-200 bg-ocean-50 px-3 py-2 font-mono text-[11px] text-ocean-800">
                  {record.currentHash}
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailRow({
  label,
  value,
  children,
}: {
  label: string
  value?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12px] font-medium text-slate-500">{label}</span>
      {children ?? <span className="text-[12px] font-semibold text-slate-800">{value}</span>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Blockchain Audit page
// ---------------------------------------------------------------------------

export default function BlockchainAudit() {
  const [records, setRecords] = useState<AuditRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [integrity, setIntegrity] = useState<ChainIntegrityResult | null>(null)
  const [checking, setChecking] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null)

  useEffect(() => {
    let active = true
    fetchAuditRecords().then((data) => {
      if (active) {
        setRecords(data)
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [])

  const stats = getAuditStats(records)

  const handleVerifyIntegrity = async () => {
    setChecking(true)
    try {
      const result = await verifyChainIntegrity()
      setIntegrity(result)
    } finally {
      setChecking(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] p-4 sm:p-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-ocean-600" />
          <span className="ml-3 text-sm text-slate-500">Loading audit chain…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6">
      {/* Prototype disclaimer */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <p className="text-sm font-semibold text-amber-800">
            Blockchain Prototype / Simulated Hash-Chain
          </p>
          <p className="mt-0.5 text-[13px] text-amber-700">
            This audit trail uses a deterministic hash-chain to demonstrate tamper-evident verification.
            It does NOT use a real blockchain, distributed ledger, or cryptocurrency.
            Immutability is not guaranteed in this prototype.
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={FileCheck}
          label="Total Records"
          value={String(stats.total)}
        />
        <StatCard
          icon={CheckCircle2}
          label="Verified Records"
          value={String(stats.verified)}
          accent="emerald"
        />
        <StatCard
          icon={integrity?.valid ? ShieldCheck : ShieldAlert}
          label="Chain Status"
          value={integrity ? (integrity.valid ? 'VALID' : 'INVALID') : '—'}
          accent={integrity ? (integrity.valid ? 'emerald' : 'rose') : 'slate'}
        />
        <StatCard
          icon={Clock}
          label="Last Verification"
          value={
            stats.lastTimestamp
              ? new Date(stats.lastTimestamp).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '—'
          }
        />
      </div>

      {/* Integrity check button */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleVerifyIntegrity}
          disabled={checking}
          className="inline-flex items-center gap-2 rounded-lg bg-ocean-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean-700 disabled:opacity-50"
        >
          {checking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
          {checking ? 'Verifying…' : 'Verify Chain Integrity'}
        </button>

        {integrity && (
          <div
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ring-1 ring-inset ${
              integrity.valid
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                : 'bg-rose-50 text-rose-700 ring-rose-200'
            }`}
          >
            {integrity.valid ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <ShieldAlert className="h-4 w-4" />
            )}
            Chain Integrity: {integrity.valid ? 'VALID' : 'INVALID'}
            {integrity.firstInvalidRecordId &&
              ` (break at ${integrity.firstInvalidRecordId})`}
            <span className="ml-1 text-[11px] font-normal opacity-70">
              ({integrity.checkedCount} records checked)
            </span>
          </div>
        )}
      </div>

      {/* Audit records table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-900">Audit Trail</h2>
          <p className="text-[13px] text-slate-500">
            Chronological chain of verification records for all verified evidence submissions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3 font-semibold text-slate-500">Record</th>
                <th className="px-5 py-3 font-semibold text-slate-500">Project</th>
                <th className="px-5 py-3 font-semibold text-slate-500">Evidence</th>
                <th className="px-5 py-3 font-semibold text-slate-500">Status</th>
                <th className="px-5 py-3 font-semibold text-slate-500">Verifier</th>
                <th className="px-5 py-3 font-semibold text-slate-500">Timestamp</th>
                <th className="px-5 py-3 font-semibold text-slate-500">Previous Hash</th>
                <th className="px-5 py-3 font-semibold text-slate-500">Current Hash</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {records.map((record, idx) => {
                const ts = new Date(record.timestamp)
                return (
                  <tr
                    key={record.recordId}
                    className={`border-b border-slate-50 transition-colors hover:bg-ocean-50/30 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                    }`}
                  >
                    <td className="px-5 py-3 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="grid h-6 w-6 place-items-center rounded-md bg-ocean-50 text-[10px] font-bold text-ocean-700">
                          {idx + 1}
                        </span>
                        {record.recordId}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div>
                        <span className="font-medium text-slate-700">{record.projectId}</span>
                        <p className="text-[11px] text-slate-400">{getProjectName(record.projectId)}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-700">{record.evidenceId}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${statusBadge(record.verificationStatus)}`}>
                        <StatusIcon status={record.verificationStatus} />
                        {record.verificationStatus.charAt(0).toUpperCase() + record.verificationStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{record.verifier}</td>
                    <td className="px-5 py-3 text-[12px] text-slate-500">
                      {ts.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      <br />
                      {ts.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-5 py-3">
                      <code className="block max-w-[120px] truncate font-mono text-[10px] text-slate-500" title={record.previousHash}>
                        {record.previousHash === GENESIS_HASH ? 'GENESIS' : `${record.previousHash.slice(0, 12)}…`}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      <code className="block max-w-[120px] truncate font-mono text-[10px] text-ocean-700" title={record.currentHash}>
                        {`${record.currentHash.slice(0, 12)}…`}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(record)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-ocean-700 transition-colors hover:bg-ocean-50"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Details
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {records.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileCheck className="h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-500">No audit records yet</p>
            <p className="mt-1 text-[13px] text-slate-400">
              Audit records are generated when evidence submissions are verified.
            </p>
          </div>
        )}
      </div>

      {/* Chain visualization */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-[15px] font-bold text-slate-900">Chain Visualization</h3>
        <div className="flex flex-wrap items-start gap-2">
          {records.map((record, idx) => (
            <div key={record.recordId} className="flex items-center">
              <div className="group relative">
                <div className="grid h-10 w-10 place-items-center rounded-lg border-2 border-ocean-300 bg-ocean-50 text-[10px] font-bold text-ocean-700 transition-colors group-hover:border-ocean-500 group-hover:bg-ocean-100">
                  {idx + 1}
                </div>
                <div className="absolute -bottom-5 left-0 right-0 text-center text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {record.recordId}
                </div>
              </div>
              {idx < records.length - 1 && (
                <div className="mx-1 flex items-center text-ocean-300">
                  <Link2 className="h-4 w-4 -rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
        {records.length > 0 && (
          <p className="mt-8 text-[11px] text-slate-400">
            Each record contains a hash of its own data and a reference to the previous record's hash,
            forming a tamper-evident chain.
          </p>
        )}
      </div>

      {/* Detail modal */}
      {selectedRecord && (
        <RecordDetail
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stat card component
// ---------------------------------------------------------------------------

function StatCard({
  icon: Icon,
  label,
  value,
  accent = 'slate',
}: {
  icon: typeof FileCheck
  label: string
  value: string
  accent?: string
}) {
  const iconBg =
    accent === 'emerald'
      ? 'bg-emerald-50 text-emerald-700'
      : accent === 'rose'
        ? 'bg-rose-50 text-rose-700'
        : 'bg-slate-50 text-slate-600'

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className={`grid h-8 w-8 place-items-center rounded-lg ${iconBg}`}>
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
      </div>
      <p className="mt-3 text-xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  )
}
