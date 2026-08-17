import { Camera } from 'lucide-react'
import type { AiAnalysisResult, EvidenceSubmission } from '../types'
import EvidenceCard from './EvidenceCard'
import EmptyState from './EmptyState'

interface EvidenceListProps {
  evidence: EvidenceSubmission[]
  analyses?: Map<string, AiAnalysisResult>
  analyzingIds?: Set<string>
  onAnalyze?: (evidenceId: string) => void
}

export default function EvidenceList({
  evidence,
  analyses,
  analyzingIds,
  onAnalyze,
}: EvidenceListProps) {
  if (evidence.length === 0) {
    return (
      <EmptyState
        icon={Camera}
        title="No evidence submitted yet"
        description="Upload field evidence to document restoration progress and trigger verification."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {evidence.map((item) => (
        <EvidenceCard
          key={item.id}
          evidence={item}
          analysis={analyses?.get(item.id) ?? null}
          isAnalyzing={analyzingIds?.has(item.id)}
          onAnalyze={onAnalyze ? () => onAnalyze(item.id) : undefined}
        />
      ))}
    </div>
  )
}
