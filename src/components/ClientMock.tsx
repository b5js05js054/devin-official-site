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
      <div className="scope-dark overflow-hidden rounded-[20px] border border-line bg-paper shadow-[0_48px_96px_-32px_rgb(17_20_27/0.45)] ring-1 ring-black/5">
        <div className="flex items-center gap-4 border-b border-line px-4 py-3">
          <div className="flex shrink-0 items-center gap-2 text-ink">
            <LayoutGrid size={16} className="text-volt" />
            <span className="text-sm font-medium">Devin hub</span>
          </div>
          <nav className="flex flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none]">
            {tabs.map((item) => {
              const Icon = item.icon
              const active = tab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${
                    active ? 'bg-sunk text-ink' : 'text-mute hover:text-ink'
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
        <div key={title} className="rounded-2xl border border-line bg-surface p-4">
          <p className="text-sm text-ink">{title}</p>
          <p className="mt-6 text-xs text-mute">{sub}</p>
        </div>
      ))}
    </div>
  )
}

function ConnectPane() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm text-ink">
              工作环境
              <span className="rounded-full bg-flare/15 px-2 py-0.5 text-[10px] text-flare">
                登录后读取倍率
              </span>
            </p>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-volt px-4 py-2 text-sm text-white"
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
              <span className="text-flare">去充值</span>
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
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink">请求用量明细</p>
        <span className="rounded-full bg-volt/15 px-2 py-0.5 text-[10px] text-volt">登录后加载</span>
      </div>
      <div className="space-y-2">
        {['模型请求进入', '主线路响应检查', '自动切换可用线路', '响应完成并结算'].map((row, i) => (
          <div key={row} className="flex items-center justify-between rounded-xl bg-paper px-4 py-3 text-sm">
            <span className="text-ink">{row}</span>
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
        <div key={p.name} className="rounded-2xl border border-line bg-surface p-4">
          <p className="text-sm text-ink">充值 {p.name}</p>
          <p className="mt-3 font-display text-2xl text-volt">{p.price}</p>
          <p className="mt-3 text-xs text-mute">1:1 到账钱包，按量扣除</p>
        </div>
      ))}
    </div>
  )
}

function SettingsPane() {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3">
        <span>关于 Devin hub</span>
        <span className="font-mono text-xs text-mute">v1.0.0</span>
      </div>
      <div className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3">
        <span>复制连接日志</span>
        <Copy size={14} className="text-mute" />
      </div>
    </div>
  )
}
