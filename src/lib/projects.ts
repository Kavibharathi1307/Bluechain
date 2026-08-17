import { fetchProjectsApi, fetchProjectByIdApi } from './api'
import type { RestorationSite } from '../types'

/**
 * API-backed project service. Falls back to error if backend is not running.
 */
export async function fetchProjects(): Promise<RestorationSite[]> {
  try {
    return await fetchProjectsApi()
  } catch {
    console.warn('Backend not available for fetchProjects')
    return []
  }
}

export async function fetchProjectById(
  id: string,
): Promise<RestorationSite | undefined> {
  try {
    return await fetchProjectByIdApi(id)
  } catch {
    console.warn('Backend not available for fetchProjectById')
    return undefined
  }
}
