import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  label?: string
}

export default function LoadingState({ label = 'Loading…' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-16">
      <Loader2 className="h-7 w-7 animate-spin text-ocean-600" />
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  )
}
