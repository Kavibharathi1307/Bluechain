const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api'

function getToken(): string | null {
  return localStorage.getItem('bluechain_token')
}

export function setToken(token: string) {
  localStorage.setItem('bluechain_token', token)
}

export function clearToken() {
  localStorage.removeItem('bluechain_token')
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export function getCurrentUser(): { id: string; name: string; email: string; role: string } | null {
  const token = getToken()
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return { id: payload.id, name: payload.name, email: payload.email, role: payload.role }
  } catch {
    return null
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(body.error || `HTTP ${res.status}`)
  }

  return res.json()
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface AuthResponse {
  user: { id: string; name: string; email: string; role: string }
  token: string
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function fetchProjectsApi() {
  return apiFetch<any[]>('/projects')
}

export async function fetchProjectByIdApi(id: string) {
  return apiFetch<any>(`/projects/${id}`)
}

// ---------------------------------------------------------------------------
// Evidence
// ---------------------------------------------------------------------------

export async function fetchEvidenceByProjectApi(projectId: string) {
  return apiFetch<any[]>(`/evidence/project/${projectId}`)
}

export async function submitEvidenceApi(data: {
  projectId: string
  photoUrl: string
  latitude: number
  longitude: number
  capturedAt: string
  notes: string
  submittedBy: string
}) {
  return apiFetch<any>('/evidence', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------

export async function fetchAlertsApi() {
  return apiFetch<any[]>('/alerts')
}

export async function fetchAlertsByProjectApi(projectId: string) {
  return apiFetch<any[]>(`/alerts/project/${projectId}`)
}

// ---------------------------------------------------------------------------
// Audit
// ---------------------------------------------------------------------------

export async function fetchAuditRecordsApi() {
  return apiFetch<any[]>('/audit')
}

export async function fetchAuditRecordByIdApi(recordId: string) {
  return apiFetch<any>(`/audit/${recordId}`)
}

export async function fetchAuditRecordsByProjectApi(projectId: string) {
  return apiFetch<any[]>(`/audit/project/${projectId}`)
}

export async function verifyChainIntegrityApi() {
  return apiFetch<{ valid: boolean; checkedCount: number; firstInvalidRecordId: string | null }>('/audit/verify/integrity')
}

// ---------------------------------------------------------------------------
// Impact
// ---------------------------------------------------------------------------

export async function fetchImpactSummaryApi() {
  return apiFetch<any>('/impact')
}

export async function fetchProjectImpactDataApi() {
  return apiFetch<any[]>('/impact/projects')
}

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

export async function fetchReportsApi() {
  return apiFetch<any>('/impact/reports')
}
