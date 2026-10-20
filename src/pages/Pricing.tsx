import { useContent } from '../lib/content'

export function Pricing() {
  const { plans } = useContent()
  const modes = plans.filter((plan) => plan.published).sort((a, b) => a.sort - b.sort)

  return (
    <div className="grid-paper">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <p className="text-sm font-medium text-volt">计费</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl text-balance md:text-6xl">
          两种用法。
          <span className="mt-2 block text-volt">日卡，或按量。</span>
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-mute">
          日卡使用免费模型，无限额度，按天计算。按量计费使用收费模型，按用量从余额扣除。
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {modes.map((plan) => (
            <article
              key={plan.slug}
              className={`flex min-h-80 flex-col rounded-3xl border p-8 ${
                plan.highlighted
                  ? 'border-volt bg-surface shadow-[0_0_0_1px_var(--color-volt),0_24px_48px_-24px_rgb(36_70_255/0.35)]'
                  : 'border-line bg-surface'
              }`}
            >
              <p className="text-sm font-medium text-volt">{plan.badge || plan.description}</p>
              <h2 className="mt-4 font-display text-5xl text-ink">{plan.name}</h2>
              <p className="mt-4 font-display text-3xl text-ink">{plan.price}</p>
              <p className="mt-3 text-sm leading-7 text-mute">{plan.description}</p>
              <ul className="mt-8 space-y-3 text-sm text-ink">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-volt" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-7 text-mute">
          日卡到期后，免费模型停止。按量余额不足时，收费模型在转发前拒绝。请求没有产出，不扣余额。
        </p>
      </div>
    </div>
  )
}
