import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../../components/Logo'
import { api } from '../../lib/api'

export function AdminLogin() {
  const nav = useNavigate()
  const [user, setUser] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setPending(true)
    setError('')
    try {
      await api('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ user, password }),
      })
      nav('/admin/home')
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-ink px-4">
      <form onSubmit={onSubmit} className="panel w-full max-w-sm rounded-3xl p-8">
        <Logo to="/admin/login" />
        <h1 className="mt-6 font-display text-3xl">内容后台</h1>
        <p className="mt-2 text-sm text-mute">改首页、充值档、倍率、下载与文档。不是卡密计费后台。</p>
        <label className="mt-6 block text-xs text-mute">
          用户名
          <input
            className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm text-petal outline-none"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label className="mt-4 block text-xs text-mute">
          密码
          <input
            type="password"
            className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm text-petal outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error ? <p className="mt-3 text-sm text-gold">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-full bg-leaf py-2.5 text-sm text-petal disabled:opacity-60"
        >
          {pending ? '登录中…' : '进入后台'}
        </button>
      </form>
    </div>
  )
}
