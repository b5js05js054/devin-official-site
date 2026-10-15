import { DEFAULT_CONTENT } from '../data/defaults'
import type { SiteContent } from '../types'

export async function fetchSite(): Promise<SiteContent> {
  try {
    const res = await fetch('/api/site', { credentials: 'include' })
    if (!res.ok) return DEFAULT_CONTENT
    const data = (await res.json()) as SiteContent
    return {
      notice: data.notice ?? DEFAULT_CONTENT.notice,
      home: data.home ?? DEFAULT_CONTENT.home,
      plans: Array.isArray(data.plans) && data.plans.length ? data.plans : DEFAULT_CONTENT.plans,
      rates: Array.isArray(data.rates) && data.rates.length ? data.rates : DEFAULT_CONTENT.rates,
      downloads:
        Array.isArray(data.downloads) && data.downloads.length
          ? data.downloads
          : DEFAULT_CONTENT.downloads,
      docs: Array.isArray(data.docs) && data.docs.length ? data.docs : DEFAULT_CONTENT.docs,
    }
  } catch {
    return DEFAULT_CONTENT
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })
  const text = await res.text()
  const body = text ? JSON.parse(text) : {}
  if (!res.ok) {
    throw new Error(body.error || `请求失败 ${res.status}`)
  }
  return body as T
}
