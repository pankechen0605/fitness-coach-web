# v0.1 Read-only MVP — 验收清单

## 构建验证

- [x] `npm run lint` 通过
- [x] `npm run build` 通过
- [x] 无 TypeScript 错误

## 页面可访问

- [x] `/` — Dashboard 数据总览
- [x] `/coach` — 只读训练计划视图
- [x] `/review` — 只读复盘视图
- [x] `/diet` — 只读饮食日志视图
- [x] `/archive` — 只读档案预览

## 数据 fallback

- [x] 本地 JSON 文件缺失时，页面不崩溃
- [x] JSON 解析失败时，页面不崩溃
- [x] 旧格式/缺字段记录被过滤，不崩溃
- [x] 数据源状态 badge 正确显示 Local JSON / Mock fallback

## 只读边界

- [x] 不写入任何 JSON 文件
- [x] 不使用 writeFile / appendFile / mkdir / rm / unlink
- [x] 不接 AI API
- [x] 不使用数据库
- [x] 不新增登录/认证
- [x] 不新增图片上传
- [x] 不新增表单提交

## UI 一致性

- [x] 深色工作台风格
- [x] Header 显示系统模式标识
- [x] 各页面 Source Notice 显示数据源和记录数量
- [x] 空数据时显示轻量空状态
