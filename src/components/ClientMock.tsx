import {
  Activity,
  Cable,
  Copy,
  LayoutGrid,
  Play,
  Settings,
  Store,
  UserRound,
  Wallet,
} from 'lucide-react'
import { useState } from 'react'
import { useContent } from '../lib/content'

const tabs = [
  { id: 'account', label: '账号', icon: UserRound },
  { id: 'connect', label: '连接', icon: Cable },
  { id: 'usage', label: '用量', icon: Activity },
  { id: 'shop', label: '商城', icon: Store },
  { id: 'settings', label: '设置', icon: Settings },
] as const

type TabId = (typeof tabs)[number]['id']

export function ClientMock() {
  const [tab, setTab] = useState<TabId>('connect')
  const { plans } = useContent()

  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="absolute -inset-8 -z-10 rounded-[36px] bg-gradient-to-b from-leaf/20 via-transparent to-transparent blur-2xl" />
      <div className="overflow-hidden rounded-[28px] border border-line bg-[#07110e] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-4 border-b border-line px-4 py-3">
          <div className="flex items-center gap-2 text-petal">
            <LayoutGrid size={16} className="text-mint" />
            <span className="text-sm font-medium">Devin hub</span>
          </div>
          <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
            {tabs.map((item) => {
              const Icon = item.icon
              const active = tab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${
                    active ? 'bg-ink-3 text-petal' : 'text-mute hover:text-petal'
                  }`}
                >
                  <Icon size={13} />
                  {item.label}
                </button>
              )
            })}
          </nav>
          <div className="hidden gap-2 text-mute sm:flex">
            <span className="h-3 w-3 rounded-full border border-line" />
            <span className="h-3 w-3 rounded-full border border-line" />
          </div>
        </div>
        <div className="min-h-[340px] p-5">
          {tab === 'account' ? <AccountPane /> : null}
          {tab === 'connect' ? <ConnectPane /> : null}
          {tab === 'usage' ? <UsagePane /> : null}
          {tab === 'shop' ? (
            <ShopPane
              plans={plans.slice(0, 3).map((p) => ({ name: p.name, price: p.price }))}
            />
          ) : null}
          {tab === 'settings' ? <SettingsPane /> : null}
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-mute">
        点击账号、连接、用量、商城与设置，体验与桌面端一致的导航。
      </p>
    </div>
  )
}

function AccountPane() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[
        ['账号', '登录后同步'],
        ['钱包', '按量余额'],
        ['今日用量', '从个人账本加载'],
      ].map(([title, sub]) => (
        <div key={title} className="rounded-2xl border border-line bg-ink-2 p-4">
          <p className="text-sm text-petal">{title}</p>
          <p className="mt-6 text-xs text-mute">{sub}</p>
        </div>
      ))}
    </div>
  )
}

function ConnectPane() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-ink-2 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm text-petal">
              工作环境
              <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] text-gold">
                登录后读取倍率
              </span>
            </p>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-leaf px-4 py-2 text-sm text-petal"
            >
              <Play size={14} />
              启动工作环境
            </button>
          </div>
          <div className="space-y-2 text-right text-xs">
            <p className="flex items-center justify-end gap-2 text-mute">
              本地代理
              <span className="rounded-full border border-line px-2 py-0.5">未运行</span>
            </p>
            <p className="flex items-center justify-end gap-2 text-mute">
              Windsurf
              <span className="rounded-full border border-line px-2 py-0.5">未运行</span>
            </p>
            <p className="flex items-center justify-end gap-2 text-mute">
              <Wallet size={12} />
              ¥ --
              <span className="text-gold">去充值</span>
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-mute">
        暂无日志
      </div>
    </div>
  )
}

function UsagePane() {
  return (
    <div className="rounded-2xl border border-line bg-ink-2 p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-petal">请求用量明细</p>
        <span className="rounded-full bg-leaf/20 px-2 py-0.5 text-[10px] text-mint">登录后加载</span>
      </div>
      <div className="space-y-2">
        {['模型请求进入', '主线路响应检查', '自动切换可用线路', '响应完成并结算'].map((row, i) => (
          <div key={row} className="flex items-center justify-between rounded-xl bg-ink px-4 py-3 text-sm">
            <span className="text-petal">{row}</span>
            <span className="font-mono text-[11px] text-mute">{i === 3 ? '已结清' : '示意'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ShopPane({ plans }: { plans: { name: string; price: string }[] }) {
  const items = plans.length ? plans : [
    { name: '50', price: '¥50' },
    { name: '100', price: '¥100' },
    { name: '200', price: '¥200' },
  ]
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((p) => (
        <div key={p.name} className="rounded-2xl border border-line bg-ink-2 p-4">
          <p className="text-sm text-petal">充值 {p.name}</p>
          <p className="mt-3 font-display text-2xl text-mint">{p.price}</p>
          <p className="mt-3 text-xs text-mute">1:1 到账钱包，按量扣除</p>
        </div>
      ))}
    </div>
  )
}

function SettingsPane() {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center justify-between rounded-2xl border border-line bg-ink-2 px-4 py-3">
        <span>关于 Devin hub</span>
        <span className="font-mono text-xs text-mute">v1.0.0</span>
      </div>
      <div className="flex items-center justify-between rounded-2xl border border-line bg-ink-2 px-4 py-3">
        <span>复制连接日志</span>
        <Copy size={14} className="text-mute" />
      </div>
    </div>
  )
}
