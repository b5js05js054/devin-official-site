import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { DEFAULT_CONTENT } from '../data/defaults'
import type { SiteContent } from '../types'
import { fetchSite } from './api'

const ContentContext = createContext<SiteContent>(DEFAULT_CONTENT)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)

  useEffect(() => {
    let cancelled = false
    const load = () =>
      fetchSite().then((data) => {
        if (!cancelled) setContent(data)
      })
    load()
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => {
      cancelled = true
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

export function useContent() {
  return useContext(ContentContext)
}
