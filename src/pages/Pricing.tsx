import { PricingCards } from '../components/PricingCards'
import { useContent } from '../lib/content'

const steps = [
  {
    title: '转发前预检',
    desc: '高级模型先看钱包。余额不够直接拒绝，不占并发、不到上游。',
  },
  {
    title: '结束后结算',
    desc: '按真实 Token 乘当时倍率从钱包扣。输入、输出、缓存读写分开记。',
  },
  {
    title: '没产出不扣',
    desc: '上游失败或立刻取消，不结算。倍率为 0 的模型预检直接放行。',
  },
]

export function Pricing() {
  const { plans, rates } = useContent()
  const visibleRates = rates.filter((r) => r.published).sort((a, b) => a.sort - b.sort)

  return (
    <div className="grain">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <p className="text-center font-mono text-xs tracking-[0.2em] text-gold uppercase">按用量计费</p>
        <h1 className="mt-4 text-center font-display text-4xl md:text-6xl">
          充多少用多少，
          <span className="mt-2 block text-mint">不是包月套餐。</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-7 text-mute">
          Devin hub 按钱包余额结算。充值 1:1 入账，费用由 Token 用量和模型倍率决定——没有 Lite / Pro / Max
          月费档，也没有加油包。
        </p>

        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-leaf/40 bg-leaf/10 px-6 py-8 text-center">
          <p className="font-mono text-[11px] tracking-[0.2em] text-gold uppercase">结算公式</p>
          <p className="mt-3 font-display text-2xl text-petal md:text-3xl">
            费用 = Token 用量 × 模型倍率
          </p>
          <p className="mt-3 text-sm text-mute">
            Token 含输入、输出与缓存读写。倍率由运营后台下发，改完下次请求生效。
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-3xl border border-line bg-ink-2 p-5">
              <p className="font-mono text-[11px] text-gold">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-2 text-lg text-petal">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-mute">{s.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-16 text-center font-display text-3xl">充值到钱包</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-mute">
          以下是到账金额，不是订阅周期。用不完留在钱包里，下次请求继续扣。
        </p>
        <div className="mt-10">
          <PricingCards plans={plans} />
        </div>

        <h2 className="mt-16 text-center font-display text-3xl">模型怎么扣</h2>
        <div className="mt-8 overflow-hidden rounded-3xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-3 font-mono text-[11px] tracking-wide text-mute">
              <tr>
                <th className="px-5 py-3 font-normal">模型 / 通道</th>
                <th className="px-5 py-3 font-normal">类型</th>
                <th className="px-5 py-3 font-normal">倍率</th>
                <th className="hidden px-5 py-3 font-normal md:table-cell">说明</th>
              </tr>
            </thead>
            <tbody>
              {visibleRates.map((r) => (
                <tr key={r.id} className="border-t border-line">
                  <td className="px-5 py-4 text-petal">{r.name}</td>
                  <td className="px-5 py-4 text-mute">{r.kind}</td>
                  <td className="px-5 py-4 font-mono text-mint">{r.ratio}</td>
                  <td className="hidden px-5 py-4 text-mute md:table-cell">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-center text-xs leading-6 text-mute">
          官方 swe-* 且目录未下发倍率时视为免费。后台不可达时高级模型会拒绝转发，避免故障期间被白嫖。
          倍率数字以客户端登录后同步的目录为准。
        </p>
      </div>
    </div>
  )
}
