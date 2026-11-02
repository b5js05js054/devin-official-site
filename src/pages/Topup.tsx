const SHOP_URL = 'https://pay.ldxp.cn/shop/wanjia'

const steps = [
  ['购买充值码', '在商店里买充值码。免费模型不扣余额，可以先不买。'],
  ['打开客户端', 'DevinHub 里点顶部的卡密。网页不能把余额加到卡上。'],
  ['填码充值', '输入 TP- 开头的充值码。金额加到当前这张卡，收费模型从这里扣。'],
]

export function Topup() {
  return (
    <div className="grid-paper">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <p className="text-sm font-medium text-volt">充值</p>
        <h1 className="mt-3 font-display text-4xl text-balance md:text-6xl">给这张卡加余额</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-mute">
          收费模型按用量从卡密余额扣。充值码在商店购买，回到客户端兑换。日卡里的免费模型不走余额。
        </p>
        <a
          href={SHOP_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex rounded-full bg-volt px-5 py-2.5 text-sm font-medium text-white no-underline"
        >
          去购买充值码
        </a>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map(([title, desc], index) => (
            <article key={title} className="rounded-3xl border border-line bg-surface p-6">
              <p className="font-mono text-sm font-medium text-volt">{index + 1}</p>
              <h2 className="mt-3 font-display text-2xl">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-mute">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
