import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import { createHmac, timingSafeEqual } from 'node:crypto'
import Fastify from 'fastify'
import {
  deleteDoc,
  deleteDownload,
  deletePlan,
  getSite,
  saveHome,
  saveNotice,
  saveRates,
  seedIfEmpty,
  upsertDoc,
  upsertDownload,
  upsertPlan,
} from './db.ts'

const PORT = Number(process.env.PORT || 8787)
const ADMIN_USER = process.env.ADMIN_USER || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bailan-admin'
const SESSION_SECRET = process.env.SESSION_SECRET || 'bailan-cms-dev-secret-change-me'
const COOKIE = 'bl_admin'

seedIfEmpty()

function sign(user: string) {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000
  const payload = Buffer.from(JSON.stringify({ u: user, exp })).toString('base64url')
  const sig = createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

function readUser(token?: string) {
  if (!token || !token.includes('.')) return null
  const [payload, sig] = token.split('.')
  const expect = createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expect)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { u: string; exp: number }
    if (data.exp < Date.now()) return null
    return data.u
  } catch {
    return null
  }
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

const app = Fastify({ logger: true })
await app.register(cors, { origin: true, credentials: true })
await app.register(cookie)

function requireAdmin(req: { cookies?: Record<string, string> }) {
  const user = readUser(req.cookies?.[COOKIE])
  if (!user) {
    const err = new Error('未登录') as Error & { statusCode?: number }
    err.statusCode = 401
    throw err
  }
  return user
}

app.get('/api/site', async () => getSite())

app.post('/api/admin/login', async (req, reply) => {
  const body = (req.body ?? {}) as { user?: string; password?: string }
  if (!safeEqual(body.user || '', ADMIN_USER) || !safeEqual(body.password || '', ADMIN_PASSWORD)) {
    reply.code(401)
    return { error: '用户名或密码不正确' }
  }
  reply.setCookie(COOKIE, sign(ADMIN_USER), {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
  })
  return { ok: true, user: ADMIN_USER }
})

app.post('/api/admin/logout', async (_req, reply) => {
  reply.clearCookie(COOKIE, { path: '/' })
  return { ok: true }
})

app.get('/api/admin/me', async (req) => {
  const user = requireAdmin(req)
  return { user }
})

app.put('/api/admin/home', async (req) => {
  requireAdmin(req)
  saveHome(req.body as never)
  return { ok: true }
})

app.put('/api/admin/notice', async (req) => {
  requireAdmin(req)
  saveNotice(req.body as never)
  return { ok: true }
})

app.put('/api/admin/rates', async (req) => {
  requireAdmin(req)
  const body = req.body as { rates?: unknown }
  const rates = Array.isArray(body.rates) ? body.rates : []
  saveRates(rates as never)
  return { rates }
})

app.post('/api/admin/plans', async (req) => {
  requireAdmin(req)
  return upsertPlan(req.body as never)
})
app.put('/api/admin/plans', async (req) => {
  requireAdmin(req)
  return upsertPlan(req.body as never)
})
app.delete('/api/admin/plans/:id', async (req) => {
  requireAdmin(req)
  deletePlan(Number((req.params as { id: string }).id))
  return { ok: true }
})

app.post('/api/admin/downloads', async (req) => {
  requireAdmin(req)
  return upsertDownload(req.body as never)
})
app.put('/api/admin/downloads', async (req) => {
  requireAdmin(req)
  return upsertDownload(req.body as never)
})
app.delete('/api/admin/downloads/:id', async (req) => {
  requireAdmin(req)
  deleteDownload(Number((req.params as { id: string }).id))
  return { ok: true }
})

app.post('/api/admin/docs', async (req) => {
  requireAdmin(req)
  return upsertDoc(req.body as never)
})
app.put('/api/admin/docs', async (req) => {
  requireAdmin(req)
  return upsertDoc(req.body as never)
})
app.delete('/api/admin/docs/:id', async (req) => {
  requireAdmin(req)
  deleteDoc(Number((req.params as { id: string }).id))
  return { ok: true }
})

app.setErrorHandler((err, _req, reply) => {
  const status = (err as { statusCode?: number }).statusCode || 500
  reply.code(status).send({ error: err.message || '服务器错误' })
})

await app.listen({ port: PORT, host: '127.0.0.1' })
console.log(`Devin hub 内容 API  http://127.0.0.1:${PORT}`)
console.log(`管理员 ${ADMIN_USER} / ${ADMIN_PASSWORD === 'bailan-admin' ? 'bailan-admin（请尽快改环境变量）' : '（已自定义）'}`)
