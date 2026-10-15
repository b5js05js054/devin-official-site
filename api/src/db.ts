import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'
import { DEFAULT_CONTENT } from '../../src/data/defaults.ts'
import type { DocItem, DownloadItem, HomeContent, ModelRate, Notice, Plan, SiteContent } from '../../src/types.ts'

const dir = dirname(fileURLToPath(import.meta.url))
const dataDir = join(dir, '..', 'data')
mkdirSync(dataDir, { recursive: true })

const db = new DatabaseSync(join(dataDir, 'cms.sqlite'))

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    badge TEXT NOT NULL DEFAULT '',
    price TEXT NOT NULL DEFAULT '',
    period TEXT NOT NULL DEFAULT '',
    official_price TEXT NOT NULL DEFAULT '',
    official_label TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    features TEXT NOT NULL DEFAULT '[]',
    quotas TEXT NOT NULL DEFAULT '[]',
    highlighted INTEGER NOT NULL DEFAULT 0,
    published INTEGER NOT NULL DEFAULT 1,
    sort INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS downloads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version TEXT NOT NULL,
    windsurf_max TEXT NOT NULL DEFAULT '',
    size TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    recommended INTEGER NOT NULL DEFAULT 0,
    published INTEGER NOT NULL DEFAULT 1,
    released_at TEXT NOT NULL DEFAULT '',
    sort INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS docs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL DEFAULT '',
    published INTEGER NOT NULL DEFAULT 1,
    sort INTEGER NOT NULL DEFAULT 0
  );
`)

function getSetting<T>(key: string, fallback: T): T {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as
    | { value: string }
    | undefined
  if (!row) return fallback
  try {
    return JSON.parse(row.value) as T
  } catch {
    return fallback
  }
}

function setSetting(key: string, value: unknown) {
  db.prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
  ).run(key, JSON.stringify(value))
}

function planFromRow(row: Record<string, unknown>): Plan {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    name: String(row.name),
    badge: String(row.badge),
    price: String(row.price),
    period: String(row.period),
    officialPrice: String(row.official_price),
    officialLabel: String(row.official_label),
    description: String(row.description),
    features: JSON.parse(String(row.features || '[]')),
    quotas: JSON.parse(String(row.quotas || '[]')),
    highlighted: Boolean(row.highlighted),
    published: Boolean(row.published),
    sort: Number(row.sort),
  }
}

function downloadFromRow(row: Record<string, unknown>): DownloadItem {
  return {
    id: Number(row.id),
    version: String(row.version),
    windsurfMax: String(row.windsurf_max),
    size: String(row.size),
    url: String(row.url),
    notes: String(row.notes),
    recommended: Boolean(row.recommended),
    published: Boolean(row.published),
    releasedAt: String(row.released_at),
    sort: Number(row.sort),
  }
}

function docFromRow(row: Record<string, unknown>): DocItem {
  return {
    id: Number(row.id),
    groupName: String(row.group_name),
    slug: String(row.slug),
    title: String(row.title),
    body: String(row.body),
    published: Boolean(row.published),
    sort: Number(row.sort),
  }
}

export function seedIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM plans').get() as { n: number }
  const existingRates = getSetting<ModelRate[] | null>('rates', null)
  if (!existingRates || !existingRates.length) {
    setSetting('rates', DEFAULT_CONTENT.rates)
  }
  if (count.n > 0) return
  setSetting('home', DEFAULT_CONTENT.home)
  setSetting('notice', DEFAULT_CONTENT.notice)
  setSetting('rates', DEFAULT_CONTENT.rates)
  const insertPlan = db.prepare(
    `INSERT INTO plans (slug, name, badge, price, period, official_price, official_label, description, features, quotas, highlighted, published, sort)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
  for (const p of DEFAULT_CONTENT.plans) {
    insertPlan.run(
      p.slug,
      p.name,
      p.badge,
      p.price,
      p.period,
      p.officialPrice,
      p.officialLabel,
      p.description,
      JSON.stringify(p.features),
      JSON.stringify(p.quotas),
      p.highlighted ? 1 : 0,
      p.published ? 1 : 0,
      p.sort,
    )
  }
  const insertDl = db.prepare(
    `INSERT INTO downloads (version, windsurf_max, size, url, notes, recommended, published, released_at, sort)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
  for (const d of DEFAULT_CONTENT.downloads) {
    insertDl.run(
      d.version,
      d.windsurfMax,
      d.size,
      d.url,
      d.notes,
      d.recommended ? 1 : 0,
      d.published ? 1 : 0,
      d.releasedAt,
      d.sort,
    )
  }
  const insertDoc = db.prepare(
    `INSERT INTO docs (group_name, slug, title, body, published, sort) VALUES (?, ?, ?, ?, ?, ?)`,
  )
  for (const d of DEFAULT_CONTENT.docs) {
    insertDoc.run(d.groupName, d.slug, d.title, d.body, d.published ? 1 : 0, d.sort)
  }
}

export function getSite(): SiteContent {
  const plans = db
    .prepare('SELECT * FROM plans ORDER BY sort, id')
    .all()
    .map((row) => planFromRow(row as Record<string, unknown>))
  const downloads = db
    .prepare('SELECT * FROM downloads ORDER BY sort, id')
    .all()
    .map((row) => downloadFromRow(row as Record<string, unknown>))
  const docs = db
    .prepare('SELECT * FROM docs ORDER BY sort, id')
    .all()
    .map((row) => docFromRow(row as Record<string, unknown>))
  return {
    notice: getSetting<Notice>('notice', DEFAULT_CONTENT.notice),
    home: getSetting<HomeContent>('home', DEFAULT_CONTENT.home),
    plans,
    rates: getSetting<ModelRate[]>('rates', DEFAULT_CONTENT.rates),
    downloads,
    docs,
  }
}

export function saveRates(rates: ModelRate[]) {
  setSetting('rates', rates)
}

export function saveHome(home: HomeContent) {
  setSetting('home', home)
}

export function saveNotice(notice: Notice) {
  setSetting('notice', notice)
}

export function upsertPlan(input: Plan): Plan {
  if (input.id) {
    db.prepare(
      `UPDATE plans SET slug=?, name=?, badge=?, price=?, period=?, official_price=?, official_label=?, description=?, features=?, quotas=?, highlighted=?, published=?, sort=? WHERE id=?`,
    ).run(
      input.slug,
      input.name,
      input.badge,
      input.price,
      input.period,
      input.officialPrice,
      input.officialLabel,
      input.description,
      JSON.stringify(input.features ?? []),
      JSON.stringify(input.quotas ?? []),
      input.highlighted ? 1 : 0,
      input.published ? 1 : 0,
      input.sort,
      input.id,
    )
    return planFromRow(db.prepare('SELECT * FROM plans WHERE id=?').get(input.id) as Record<string, unknown>)
  }
  const result = db
    .prepare(
      `INSERT INTO plans (slug, name, badge, price, period, official_price, official_label, description, features, quotas, highlighted, published, sort)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.slug,
      input.name,
      input.badge,
      input.price,
      input.period,
      input.officialPrice,
      input.officialLabel,
      input.description,
      JSON.stringify(input.features ?? []),
      JSON.stringify(input.quotas ?? []),
      input.highlighted ? 1 : 0,
      input.published ? 1 : 0,
      input.sort,
    )
  const id = Number(result.lastInsertRowid)
  return planFromRow(db.prepare('SELECT * FROM plans WHERE id=?').get(id) as Record<string, unknown>)
}

export function deletePlan(id: number) {
  db.prepare('DELETE FROM plans WHERE id=?').run(id)
}

export function upsertDownload(input: DownloadItem): DownloadItem {
  if (input.recommended) {
    db.prepare('UPDATE downloads SET recommended=0').run()
  }
  if (input.id) {
    db.prepare(
      `UPDATE downloads SET version=?, windsurf_max=?, size=?, url=?, notes=?, recommended=?, published=?, released_at=?, sort=? WHERE id=?`,
    ).run(
      input.version,
      input.windsurfMax,
      input.size,
      input.url,
      input.notes,
      input.recommended ? 1 : 0,
      input.published ? 1 : 0,
      input.releasedAt,
      input.sort,
      input.id,
    )
    return downloadFromRow(
      db.prepare('SELECT * FROM downloads WHERE id=?').get(input.id) as Record<string, unknown>,
    )
  }
  const result = db
    .prepare(
      `INSERT INTO downloads (version, windsurf_max, size, url, notes, recommended, published, released_at, sort)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.version,
      input.windsurfMax,
      input.size,
      input.url,
      input.notes,
      input.recommended ? 1 : 0,
      input.published ? 1 : 0,
      input.releasedAt,
      input.sort,
    )
  const id = Number(result.lastInsertRowid)
  return downloadFromRow(db.prepare('SELECT * FROM downloads WHERE id=?').get(id) as Record<string, unknown>)
}

export function deleteDownload(id: number) {
  db.prepare('DELETE FROM downloads WHERE id=?').run(id)
}

export function upsertDoc(input: DocItem): DocItem {
  if (input.id) {
    db.prepare(
      `UPDATE docs SET group_name=?, slug=?, title=?, body=?, published=?, sort=? WHERE id=?`,
    ).run(input.groupName, input.slug, input.title, input.body, input.published ? 1 : 0, input.sort, input.id)
    return docFromRow(db.prepare('SELECT * FROM docs WHERE id=?').get(input.id) as Record<string, unknown>)
  }
  const result = db
    .prepare(
      `INSERT INTO docs (group_name, slug, title, body, published, sort) VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(input.groupName, input.slug, input.title, input.body, input.published ? 1 : 0, input.sort)
  const id = Number(result.lastInsertRowid)
  return docFromRow(db.prepare('SELECT * FROM docs WHERE id=?').get(id) as Record<string, unknown>)
}

export function deleteDoc(id: number) {
  db.prepare('DELETE FROM docs WHERE id=?').run(id)
}
