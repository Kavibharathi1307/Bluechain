import { useEffect, useState } from 'react'
import { AlertTriangle, Camera, MapPin, Upload, X } from 'lucide-react'
import { fetchProjectsApi } from '../lib/api'

interface EvidenceFormProps {
  projectId: string
  onSubmit: (data: {
    photoUrl: string
    latitude: number
    longitude: number
    capturedAt: string
    notes: string
  }) => void
  onCancel: () => void
  isSubmitting: boolean
}

const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
]

export default function EvidenceForm({
  projectId,
  onSubmit,
  onCancel,
  isSubmitting,
}: EvidenceFormProps) {
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [capturedAt, setCapturedAt] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    const now = new Date()
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    setCapturedAt(local)
  }, [])

  const handlePhotoSelect = () => {
    const photo = SAMPLE_PHOTOS[Math.floor(Math.random() * SAMPLE_PHOTOS.length)]
    setPhotoUrl(photo)
    setPhotoPreview(photo)
  }

  const handleAutoLocation = async () => {
    try {
      const sites = await fetchProjectsApi()
      const site = sites.find((s: any) => s.id === projectId)
      const cLat = site ? site.coordinates.lat : 21.95
      const cLng = site ? site.coordinates.lng : 88.88
      setLatitude((cLat + (Math.random() - 0.5) * 0.1).toFixed(4))
      setLongitude((cLng + (Math.random() - 0.5) * 0.1).toFixed(4))
    } catch {
      setLatitude((21.95 + (Math.random() - 0.5) * 0.1).toFixed(4))
      setLongitude((88.88 + (Math.random() - 0.5) * 0.1).toFixed(4))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: string[] = []
    if (!photoUrl) errs.push('Photo is required.')
    if (!latitude || !longitude) errs.push('GPS coordinates are required.')
    if (!capturedAt) errs.push('Capture date/time is required.')
    if (!notes.trim()) errs.push('Notes are required.')
    if (errs.length > 0) { setErrors(errs); return }
    setErrors([])
    onSubmit({
      photoUrl,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      capturedAt: new Date(capturedAt).toISOString(),
      notes: notes.trim(),
    })
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-ocean-500/30 transition-shadow focus:border-ocean-500 focus:ring-2'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-ocean-50 text-ocean-700">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-slate-900">Upload Evidence</h3>
              <p className="text-[11px] text-slate-500">Submit field evidence for {projectId}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.length > 0 && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                <div className="space-y-1">
                  {errors.map((err, i) => (
                    <p key={i} className="text-[12px] text-rose-700">{err}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5" /> Photo evidence
                </span>
              </label>
              {photoPreview ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-200">
                  <img src={photoPreview} alt="Evidence preview" className="h-40 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPhotoUrl(''); setPhotoPreview('') }}
                    className="absolute right-2 top-2 rounded-lg bg-black/50 p-1.5 text-white backdrop-blur hover:bg-black/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handlePhotoSelect}
                  className="flex h-40 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition-colors hover:border-ocean-400 hover:bg-ocean-50/30 hover:text-ocean-600"
                >
                  <Camera className="h-8 w-8" />
                  <p className="mt-2 text-[13px] font-medium">Click to select photo</p>
                  <p className="mt-0.5 text-[11px]">(Simulated — picks a sample image)</p>
                </button>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> GPS Coordinates
                </span>
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={handleAutoLocation}
                  className="shrink-0 rounded-lg border border-slate-300 px-3 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Auto
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
                Capture date &amp; time
              </label>
              <input
                type="datetime-local"
                value={capturedAt}
                onChange={(e) => setCapturedAt(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
                Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe what you observed in the field…"
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-ocean-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ocean-700 disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {isSubmitting ? 'Submitting…' : 'Submit evidence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
