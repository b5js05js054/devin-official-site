import type { SiteContent } from '../types'

export const BRAND = 'Devin hub'

export const DEFAULT_CONTENT: SiteContent = {
  notice: {
    enabled: true,
    text: 'Devin hub 客户端现已支持 Windows 与 macOS',
    href: '/downloads',
  },
  home: {
    kicker: '为 Windsurf / Devin 提供稳定、透明的模型访问',
    headline: '不换编辑器，',
    highlight: '按用量把账算清楚。',
    sub: '在 Windsurf 里继续原来的工作方式。Devin hub 负责连接、模型调度和用量结算。钱包充值，按 Token × 倍率扣费，没有产出不扣。',
    ctaPrimary: '下载 Windows 客户端',
    ctaSecondary: '查看计费',
    stats: [
      { value: '按量', label: '充多少用多少' },
      { value: '× 倍率', label: '按模型结算' },
      { value: '0', label: '免费模型不预检' },
      { value: '1:1', label: '充值到钱包' },
    ],
    capabilities: [
      {
        id: 'connect',
        title: '请求不停在一个失败节点',
        desc: '上游走 HTTP/2 多路复用与探活。排队超时、平滑重启、进行中的对话都可以被说清楚，而不是静默断掉。',
        points: ['线路状态持续可见', '并发排队与超时可配置', '平滑重启不丢进行中的对话'],
      },
      {
        id: 'usage',
        title: '知道每次请求去了哪里、花了多少',
        desc: '高级模型先预检钱包余额，结束后按真实 token 结算。输入、输出、缓存读写分开记账；没产出不扣费。',
        points: ['费用 = Token × 当时倍率', '余额不足在转发前拒绝', '结算按 request_id 幂等，不重复扣'],
      },
      {
        id: 'manage',
        title: '把账号、模型和钱包放回一处',
        desc: '卡密进门，模型目录和倍率由后台同步。官方通道与 OpenAI / Anthropic 兼容渠道按模型分流。',
        points: ['钱包余额连续结算', '倍率改完下次请求生效', '内容审核挡在扣费之前'],
      },
    ],
    faqs: [
      {
        q: '开始使用需要做什么？',
        a: '下载 Devin hub 客户端并登录，给钱包充值（免费模型可不充），在连接页启动工作环境，然后照常打开 Windsurf。',
      },
      {
        q: '怎么计费？',
        a: '按用量计费，不是包月套餐。高级模型：转发前预检余额，请求结束后按真实 Token × 当时倍率从钱包扣除。倍率为 0 的模型免费放行。',
      },
      {
        q: '最终费用怎么算？',
        a: '输入 token、输出 token、缓存读写，乘以该模型当时的倍率。没有产出不扣费；上游没给 usage 时按已产出内容估算并标记。',
      },
      {
        q: '充值是订阅吗？',
        a: '不是。充值进入钱包，用多少扣多少，不是按月清零的 Lite / Pro / Max 套餐。',
      },
      {
        q: '本地代理做什么？',
        a: '客户端在本机承接 Windsurf 的请求并转到 Devin hub 中继。连接页会展示本地代理与 Windsurf 进程状态。退出客户端后不再转发。',
      },
      {
        q: '支持哪些系统？',
        a: '目前提供 Windows 10 / 11 64 位安装包，以及同时覆盖 Apple 芯片与 Intel 的 macOS 通用包。',
      },
    ],
    downloadTitle: '下载 Devin hub，从一个清楚的连接开始。',
    downloadSub: '安装后登录并给钱包充值，再从连接页启动 Windsurf。',
  },
  plans: [
    {
      id: 1,
      slug: 'c50',
      name: '50',
      badge: '入门',
      price: '¥50',
      period: '',
      officialPrice: '',
      officialLabel: '',
      description: '到账钱包，按量扣除',
      features: ['充值进入钱包，不是包月', '按 Token × 倍率结算', '免费模型不扣这档余额', '够日常试跑连接'],
      quotas: [{ label: '到账', value: '¥50', note: '1:1 入账' }],
      highlighted: false,
      published: true,
      sort: 1,
    },
    {
      id: 2,
      slug: 'c100',
      name: '100',
      badge: '',
      price: '¥100',
      period: '',
      officialPrice: '',
      officialLabel: '',
      description: '常用充值档',
      features: ['充值进入钱包，不是包月', '按 Token × 倍率结算', '余额跨请求累计', '不够再续充即可'],
      quotas: [{ label: '到账', value: '¥100', note: '1:1 入账' }],
      highlighted: false,
      published: true,
      sort: 2,
    },
    {
      id: 3,
      slug: 'c200',
      name: '200',
      badge: '常用',
      price: '¥200',
      period: '',
      officialPrice: '',
      officialLabel: '',
      description: '主力充值档',
      features: ['充值进入钱包，不是包月', '适合持续开发', '高级模型走预检 + 结算', '明细可在用量页回看'],
      quotas: [{ label: '到账', value: '¥200', note: '1:1 入账' }],
      highlighted: true,
      published: true,
      sort: 3,
    },
    {
      id: 4,
      slug: 'c500',
      name: '500',
      badge: '',
      price: '¥500',
      period: '',
      officialPrice: '',
      officialLabel: '',
      description: '重度使用',
      features: ['充值进入钱包，不是包月', '长思考与高倍率模型更从容', '用不完留在钱包', '结算失败会重放，不重复扣'],
      quotas: [{ label: '到账', value: '¥500', note: '1:1 入账' }],
      highlighted: false,
      published: true,
      sort: 4,
    },
  ],
  rates: [
    {
      id: 1,
      name: 'swe-* 官方通道',
      kind: '官方',
      ratio: '0',
      note: '后台未下发倍率时视为免费，不预检、不扣钱包',
      published: true,
      sort: 1,
    },
    {
      id: 2,
      name: '目录中倍率为 0 的模型',
      kind: '免费',
      ratio: '0',
      note: '预检直接放行，零网络开销',
      published: true,
      sort: 2,
    },
    {
      id: 3,
      name: '第三方 / 高级模型',
      kind: '按量',
      ratio: '后台配置',
      note: '转发前预检余额，结束后按真实 Token × 当时倍率扣费',
      published: true,
      sort: 3,
    },
    {
      id: 4,
      name: '缓存读写 token',
      kind: '按量',
      ratio: '计入用量',
      note: '输入含 cache_read / cache_write，与输出一并上报结算',
      published: true,
      sort: 4,
    },
  ],
  downloads: [
    {
      id: 1,
      version: '1.0.0',
      windsurfMax: '1.2.0',
      size: '48.6 MB',
      url: '',
      notes: '当前推荐。覆盖连接、账号、用量与钱包。',
      recommended: true,
      published: true,
      releasedAt: '2026-10-12',
      sort: 1,
    },
    {
      id: 2,
      version: '0.9.4',
      windsurfMax: '1.1.8',
      size: '46.2 MB',
      url: '',
      notes: '上一稳定版，适合尚未升级 Windsurf 的环境。',
      recommended: false,
      published: true,
      releasedAt: '2026-09-28',
      sort: 2,
    },
  ],
  docs: [
    {
      id: 1,
      groupName: '开始使用',
      slug: 'what-is-devinhub',
      title: 'Devin hub 是什么',
      published: true,
      sort: 1,
      body: `Devin hub 是面向 Windsurf / Devin 的连接与用量管理平台。你继续在编辑器里写代码，客户端负责本地连接，中继负责鉴权、模型分流、审核与结算。

计费是钱包按量，不是 Cursor 那种官方月费套餐的折扣仿品，也不是 Lite / Pro / Max 包月档。充值进入钱包，用多少扣多少。`,
    },
    {
      id: 2,
      groupName: '开始使用',
      slug: 'getting-started',
      title: '开始使用需要做什么',
      published: true,
      sort: 2,
      body: `1. 安装 Windsurf，在「关于」里记下当前版本号。
2. 到下载中心取与该版本匹配的 Devin hub 客户端。
3. 打开客户端并登录。
4. 给钱包充值（若只用免费模型可先不充）。
5. 在连接页启动工作环境，确认本地代理与 Windsurf 均为运行中。
6. 回到 Windsurf 选择目录里的模型，正常对话即可。

退出 Devin hub 后，转发会停止。`,
    },
    {
      id: 3,
      groupName: '计费',
      slug: 'billing',
      title: '计费规则说明',
      published: true,
      sort: 3,
      body: `Devin hub 按用量计费。

**公式：** 费用 =（输入 + 输出 + 缓存读写）Token × 该模型当时的倍率。

- 倍率为 0，或官方 swe-* 且目录没下发倍率 → 免费，预检直接放行。
- 其余模型在排队前预检钱包；余额不足拒绝，不占并发槽、不到上游。
- 请求结束后按真实 usage 结算。没有产出不扣费。
- 倍率在运营后台改完，下一次请求立即生效，中继不用重启。
- 上报失败会重试并落盘重放，按 request_id 幂等，不会重复扣。

充值是往钱包加余额，不是购买月度套餐。`,
    },
    {
      id: 4,
      groupName: '接入',
      slug: 'windsurf',
      title: '如何在 Windsurf 里使用',
      published: true,
      sort: 4,
      body: `完成准备工作后，在 Devin hub 客户端连接页启动工作环境。

Windsurf 保持原样。模型列表以客户端 / 后台目录为准。若所选模型已被下线，中继会直接提示重新选择，而不是静默落到别的模型。`,
    },
    {
      id: 5,
      groupName: '接入',
      slug: 'channels',
      title: '官方通道与第三方渠道',
      published: true,
      sort: 5,
      body: `官方通道处理 Windsurf 协议请求。名称落在第三方目录里的模型，会改走 OpenAI chat.completions 或 Anthropic Messages。

渠道地址以 \`/v1/messages\` 结尾时按 Anthropic 处理，以 \`/v1/chat/completions\` 结尾时按 OpenAI 处理。思考流、工具调用、自动续答和用量统计在中继内部统一后再回给编辑器。`,
    },
    {
      id: 6,
      groupName: '常见问题',
      slug: 'faq',
      title: '使用前可能想确认的事',
      published: true,
      sort: 6,
      body: `**是不是包月 Pro / Max？** 不是。钱包按量，费用由 Token 和倍率决定。

**长思考会不会被当成卡死？** 默认只按「完全无数据」的读超时判断，避免把少量保活帧的推理误杀。

**审核命中会怎样？** 在余额预检和排队之前拦截，不扣费、不到上游。`,
    },
  ],
}
