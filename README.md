# CodeM Demo Admin

一个可在本机部署的客户项目演示与需求反馈后台。前端页面、管理接口和数据存储均在同一个 Next.js 仓库中。

## 功能

- 客户项目展示页与项目进度
- 客户在线提交修改需求
- 管理员查看反馈并更新处理状态
- 管理员设置全站主色与强调色，支持预设和自定义颜色
- JSON 文件本地持久化，无需额外数据库服务
- 支持局域网访问或通过安全隧道分享给客户

## 本地启动

要求 Node.js 20.9 或更高版本。

```bash
npm install
cp .env.example .env.local
npm run dev
```

打开：

- 客户首页：[http://localhost:3000](http://localhost:3000)
- 管理后台：[http://localhost:3000/admin](http://localhost:3000/admin)

请在 `.env.local` 中修改管理员密码。未配置时，开发环境默认密码为 `codem-demo`。

## 一键重启

首次使用先增加执行权限：

```bash
chmod +x restart.sh
```

以后在项目目录执行：

```bash
./restart.sh
```

脚本会依次停止该项目的旧进程、执行生产构建，并在后台重新启动服务。运行日志保存在 `.runtime/server.log`。

如需修改端口：

```bash
PORT=3001 ./restart.sh
```

## 让局域网客户访问

```bash
npm run dev -- --hostname 0.0.0.0
```

客户访问 `http://你的局域网IP:3000`。跨网络访问建议使用带 HTTPS 和访问控制的隧道，不要直接把本机端口暴露到公网。

## 数据

演示数据保存在 `data/store.json`。提交反馈和更新状态会直接修改该文件。正式投入使用前建议迁移到 SQLite 或托管数据库，并增加备份、限流和正式身份认证。
