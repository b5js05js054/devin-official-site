import type { SiteContent } from '../types'

export const BRAND = 'DevinHub'

export const DEFAULT_CONTENT: SiteContent = {
  notice: {
    enabled: true,
    text: 'DevinHub 客户端覆盖 Windows 与 macOS，当前已发布 macOS 1.2.7',
    href: '/downloads',
  },
  home: {
    kicker: '给 Devin 桌面端接上可核对的模型与用量',
    headline: '不换编辑器，',
    highlight: '日卡，或按量。',
    sub: '继续用 Devin。免费模型走日卡，无限额度，按天计算。收费模型按用量从余额扣，没有产出不扣。',
    ctaPrimary: '查看客户端',
    ctaSecondary: '查看计费',
    stats: [
      { value: '日卡', label: '免费模型无限额度' },
      { value: '按天', label: '到期即止' },
      { value: '按量', label: '收费模型按用量扣' },
      { value: '余额', label: '用多少扣多少' },
    ],
    capabilities: [
      {
        id: 'connect',
        title: '本机拦截，退出就恢复',
        desc: '客户端把目标域名指到本机，用自带证书终止 HTTPS，再转到 DevinHub 中继。拦截的是 Devin。退出时恢复 hosts，并卸掉这次装上的根证书。',
        points: ['启动后本地拦截与 Devin 进程状态可见', '排队超时、并发上限可配置', '中继平滑重启会等进行中的对话结束'],
      },
      {
        id: 'usage',
        title: '日卡无限，按量才扣余额',
        desc: '日卡覆盖免费模型，额度不按 token 扣，有效期一天。收费模型走按量，转发前看余额，结束后按真实用量扣除。',
        points: ['日卡到期后免费模型停止', '按量余额不足会在转发前拒绝', '没有任何产出不扣费'],
      },
      {
        id: 'manage',
        title: '卡密、模型和计价在一处',
        desc: '用卡密激活，一卡一机。模型目录、单价和倍率由管理后台下发。官方 swe-* 走原协议，其余模型名按渠道地址走 OpenAI 或 Anthropic 兼容接口。',
        points: ['充值用充值码，加到这张卡的余额', '改价后下次请求按新规则结算', '内容审核挡在扣费之前'],
      },
    ],
    faqs: [
      {
        q: '开始使用需要做什么？',
        a: '安装 DevinHub 客户端，用卡密激活。只用免费模型可以先不充值。在客户端启动本地拦截，确认 Devin 处于运行中，然后在 Devin 里选目录中的模型。',
      },
      {
        q: '怎么计费？',
        a: '两类。日卡：免费模型，无限额度，按天。按量计费：收费模型按用量从余额扣，用多少扣多少。',
      },
      {
        q: '最终费用怎么算？',
        a: '日卡不按 token 扣。按量按实际用量从余额扣，没有产出不扣。余额不够时，收费模型在转发前拒绝。',
      },
      {
        q: '日卡和按量怎么选？',
        a: '只用免费模型，买日卡，无限额度，当天有效。要用收费模型，走按量，余额用完再充。',
      },
      {
        q: '本地拦截做什么？',
        a: '运行时改 hosts，把 Devin 的请求接到本机，再转到中继。页面上能看到本地拦截和 Devin 进程状态。退出客户端后恢复 hosts，不再转发。',
      },
      {
        q: '支持哪些系统？',
        a: '客户端有 Windows 和 macOS。已核对的发布记录是 macOS 通用包 1.2.7。安装包在 https://gx.08879.cn/ 下载，版本以实际安装包为准。',
      },
    ],
    downloadTitle: '先装客户端，再用卡密把连接打开。',
    downloadSub: '激活后启动本地拦截。收费模型不够余额时，用充值码给这张卡加余额。',
  },
  plans: [
    {
      id: 1,
      slug: 'day-pass',
      name: '日卡',
      badge: '免费模型',
      price: '无限额度',
      period: '按天',
      officialPrice: '',
      officialLabel: '',
      description: '当天有效，到期即止。',
      features: ['只含免费模型', '额度不按 token 扣', '有效期一天'],
      quotas: [],
      highlighted: false,
      published: true,
      sort: 1,
    },
    {
      id: 2,
      slug: 'usage',
      name: '按量计费',
      badge: '收费模型',
      price: '用多少扣多少',
      period: '',
      officialPrice: '',
      officialLabel: '',
      description: '按实际用量从余额扣除。',
      features: ['余额记在卡密上', '余额不足，转发前拒绝', '没有产出不扣'],
      quotas: [],
      highlighted: true,
      published: true,
      sort: 2,
    },
  ],
  rates: [
    {
      id: 1,
      name: 'swe-* 官方通道',
      kind: '官方',
      ratio: '未标价则免费',
      note: '目录没下发倍率时不预检、不扣余额',
      published: true,
      sort: 1,
    },
    {
      id: 2,
      name: '目录中倍率为 0 的模型',
      kind: '免费',
      ratio: '0',
      note: '预检直接放行',
      published: true,
      sort: 2,
    },
    {
      id: 3,
      name: '非 swe 模型',
      kind: '第三方',
      ratio: '按模型配置',
      note: '走 OpenAI 或 Anthropic 兼容渠道；没下发倍率时仍会预检，不视为免费',
      published: true,
      sort: 3,
    },
    {
      id: 4,
      name: '缓存 token',
      kind: '明细',
      ratio: '含在输入里',
      note: '结算用的输入已包含缓存命中。缓存读写另报，不在输入之外再加一次。官方通道目前只解析到缓存读取',
      published: true,
      sort: 4,
    },
  ],
  downloads: [
    {
      id: 1,
      version: '1.2.7',
      windsurfMax: 'macOS 通用包',
      size: '以安装包为准',
      url: 'https://gx.08879.cn/',
      notes: '已核对的最新 macOS 发布。拦截 Devin，退出后恢复 hosts。',
      recommended: true,
      published: true,
      releasedAt: '2026-10-16',
      sort: 1,
    },
  ],
  docs: [
    {
      id: 1,
      groupName: '开始使用',
      slug: 'what-is-devinhub',
      title: 'DevinHub 是什么',
      published: true,
      sort: 1,
      body: `DevinHub 是 Devin 桌面端的连接与用量管理。你继续在 Devin 里写代码。客户端负责本机拦截，中继负责鉴权、模型分流、审核与结算。

模型协议沿用官方 swe-*。计费扣的是卡密余额，不是网页上的月费套餐，也没有固定金额的充值档。`,
    },
    {
      id: 2,
      groupName: '开始使用',
      slug: 'getting-started',
      title: '开始使用需要做什么',
      published: true,
      sort: 2,
      body: `1. 安装 Devin，并安装对应系统的 DevinHub 客户端。
2. 打开客户端，用卡密激活。授权与本机绑定，一卡一机。
3. 只用免费模型可以先不充值。收费模型余额不够时，在客户端用充值码给这张卡加余额。
4. 启动本地拦截，确认拦截已运行、Devin 进程在运行。
5. 回到 Devin，选择目录里的模型，正常对话。

退出客户端后会恢复 hosts，转发停止。`,
    },
    {
      id: 3,
      groupName: '计费',
      slug: 'billing',
      title: '计费规则说明',
      published: true,
      sort: 3,
      body: `DevinHub 有两类：

**日卡。** 免费模型，无限额度，按天计算。到期后免费模型停止。

**按量计费。** 收费模型按实际用量从余额扣除。余额不足时，转发前拒绝。请求没有产出，不扣余额。

按量余额用充值码加到当前卡密上。`,
    },
    {
      id: 4,
      groupName: '接入',
      slug: 'devin',
      title: '如何在 Devin 里使用',
      published: true,
      sort: 4,
      body: `在 DevinHub 客户端启动本地拦截。客户端会改 hosts，并把本次使用的根证书装上；退出时恢复 hosts、卸掉证书。

Devin 本身不用改配置。模型列表以客户端同步的后台目录为准。所选模型若已下线，中继会直接提示重新选择，不会静默换成别的模型。`,
    },
    {
      id: 5,
      groupName: '接入',
      slug: 'channels',
      title: '官方通道与第三方渠道',
      published: true,
      sort: 5,
      body: `官方 swe-* 走原来的协议。模型名不是 swe-* 时，改走第三方渠道。

渠道地址以 \`/v1/messages\` 结尾时按 Anthropic 处理，以 \`/v1/chat/completions\` 结尾时按 OpenAI 处理。思考、工具调用和用量在中继内部整理后再回给 Devin。

中继上游默认是一条 HTTP/2 连接，带探活。这不是多线路自动切换。`,
    },
    {
      id: 6,
      groupName: '常见问题',
      slug: 'faq',
      title: '使用前可能想确认的事',
      published: true,
      sort: 6,
      body: `**怎么收费？** 日卡是免费模型无限额度，按天。按量是收费模型，用多少扣多少。

**网页能注册账号吗？** 不能。激活和充值都在客户端里完成。

**长思考会不会被当成卡死？** 停滞检测默认关闭。默认只按一段时间完全没有数据来判断读超时。

**审核命中会怎样？** 在余额预检和排队之前拦截，不扣费、不到上游。

**后台挂了会怎样？** 收费模型预检失败会拒绝转发。已经同步过的模型目录会暂时沿用上一次结果。`,
    },
  ],
}
