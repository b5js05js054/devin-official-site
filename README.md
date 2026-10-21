# DevinHub 官网

Windsurf / Devin 连接与按量计费的配套官网，带内容后台。

## 开发

```bat
cd website
npm install
cd api
npm install
cd ..
npm run dev
```

- 前台：http://localhost:5173
- 内容后台：http://localhost:5173/admin
- API：http://127.0.0.1:8787

默认管理员 `admin` / `bailan-admin`。可用环境变量 `ADMIN_USER`、`ADMIN_PASSWORD`、`SESSION_SECRET` 覆盖。

## 后台能改什么

首页文案、顶栏公告、充值档、模型倍率说明、下载版本、使用指南。保存即发布。用户注册与钱包充值不在此后台。
