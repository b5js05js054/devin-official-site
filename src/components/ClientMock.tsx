import {
  Activity,
  Cable,
  Copy,
  LayoutGrid,
  Play,
  Settings,
  Ticket,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'

const tabs = [
  { id: 'account', label: '账号', icon: UserRound },
  { id: 'connect', label: '连接', icon: Cable },
  { id: 'usage', label: '用量', icon: Activity },
  { id: 'topup', label: '充值', icon: Ticket },
  { id: 'settings', label: '设置', icon: Settings },
] as const

type TabId = (typeof tabs)[number]['id']

export function ClientMock() {
  const [tab, setTab] = useState<TabId>('connect')

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
          {tab === 'topup' ? <TopupPane /> : null}
          {tab === 'settings' ? <SettingsPane /> : null}
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-mute">
        示意客户端里的账号、拦截、用量和充值码。桌面端以实际安装包为准。
      </p>
    </div>
  )
}

function AccountPane() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[
        ['卡密', '激活后可用'],
        ['余额', '记在这张卡上'],
        ['今日用量', '激活后加载'],
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
              本地拦截
              <span className="rounded-full bg-flare/15 px-2 py-0.5 text-[10px] text-flare">
                激活后读取计价
              </span>
            </p>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-volt px-4 py-2 text-sm text-white"
            >
              <Play size={14} />
              启动拦截
            </button>
          </div>
          <div className="space-y-2 text-right text-xs">
            <p className="flex items-center justify-end gap-2 text-mute">
              本地代理
              <span className="rounded-full border border-line px-2 py-0.5">未运行</span>
            </p>
            <p className="flex items-center justify-end gap-2 text-mute">
              Devin
              <span className="rounded-full border border-line px-2 py-0.5">未运行</span>
            </p>
            <p className="flex items-center justify-end gap-2 text-mute">
              卡密余额
              <span className="text-flare">充值码</span>
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
        <span className="rounded-full bg-volt/15 px-2 py-0.5 text-[10px] text-volt">激活后加载</span>
      </div>
      <div className="space-y-2">
        {['请求进入', '收费模型预检余额', '结束后按真实用量结算', '没有产出则不扣'].map((row) => (
          <div key={row} className="flex items-center justify-between rounded-xl bg-paper px-4 py-3 text-sm">
            <span className="text-ink">{row}</span>
            <span className="font-mono text-[11px] text-mute">示意</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopupPane() {
  return (
    <div className="max-w-md rounded-2xl border border-line bg-surface p-5">
      <p className="text-sm text-ink">给当前卡密加余额</p>
      <p className="mt-2 text-xs leading-5 text-mute">输入充值码，加到这张卡上。没有固定金额档。</p>
      <div className="mt-4 rounded-xl border border-dashed border-line px-4 py-3 font-mono text-sm text-mute">
        TP-····
      </div>
    </div>
  )
}

function SettingsPane() {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3">
        <span>关于 Devin hub</span>
        <span className="font-mono text-xs text-mute">v1.2.7</span>
      </div>
      <div className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3">
        <span>复制连接日志</span>
        <Copy size={14} className="text-mute" />
      </div>
    </div>
  )
}
