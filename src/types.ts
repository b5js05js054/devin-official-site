export type Notice = {
  enabled: boolean
  text: string
  href: string
}

export type StatItem = {
  label: string
  value: string
}

export type Capability = {
  id: string
  title: string
  desc: string
  points: string[]
}

export type FaqItem = {
  q: string
  a: string
}

export type HomeContent = {
  kicker: string
  headline: string
  highlight: string
  sub: string
  ctaPrimary: string
  ctaSecondary: string
  stats: StatItem[]
  capabilities: Capability[]
  faqs: FaqItem[]
  downloadTitle: string
  downloadSub: string
}

export type PlanQuota = {
  label: string
  value: string
  note: string
}

export type Plan = {
  id: number
  slug: string
  name: string
  badge: string
  price: string
  period: string
  officialPrice: string
  officialLabel: string
  description: string
  features: string[]
  quotas: PlanQuota[]
  highlighted: boolean
  published: boolean
  sort: number
}

export type DownloadItem = {
  id: number
  version: string
  windsurfMax: string
  size: string
  url: string
  notes: string
  recommended: boolean
  published: boolean
  releasedAt: string
  sort: number
}

export type DocItem = {
  id: number
  groupName: string
  slug: string
  title: string
  body: string
  published: boolean
  sort: number
}

export type ModelRate = {
  id: number
  name: string
  kind: string
  ratio: string
  note: string
  published: boolean
  sort: number
}

export type SiteContent = {
  notice: Notice
  home: HomeContent
  plans: Plan[]
  rates: ModelRate[]
  downloads: DownloadItem[]
  docs: DocItem[]
}
