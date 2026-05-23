# Fitness Coach Web

本地优先的私人训练控制台。只读 JSON 数据驱动，无登录，无数据库。

## 当前状态

**PR3: AI Coach API + training plan preview** — /coach 支持 AI 生成训练计划预览（不写入 JSON）。

## 本地运行

```bash
npm install
npm run dev     # 开发模式 → http://localhost:3000
npm run build   # 生产构建
```

## 技术栈

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

## 当前已完成

| 页面 | 功能 |
|------|------|
| Dashboard (`/`) | 周训练天数、平均 RPE、评分分布、最近训练列表 |
| Coach (`/coach`) | 只读训练计划 + AI 生成计划预览（不写入） |
| Review (`/review`) | 只读复盘视图，平均 RPE、完成率、最佳评分 |
| Diet (`/diet`) | 只读饮食日志，总热量、蛋白质/碳水/脂肪 |
| Archive (`/archive`) | 训练/饮食/计划搜索筛选、记录预览、数据源状态、数据质量标记 |

全局特性：
- Header 系统模式标识（本地只读 / JSON 数据源 / 无登录 / AI 未启用）
- 数据源状态 badge（Local JSON / Mock fallback）
- 读取时数据标准化（旧格式/缺字段/字符串数字/未知枚举自动修复）
- 本地 JSON 缺失时自动 fallback 到 Mock 数据

## 数据来源

从本地 JSON 文件**只读**数据：

- `D:/AI_Project/fitnessCOACH/training_log.json` — 训练日志
- `D:/AI_Project/fitnessCOACH/diet_log.json` — 饮食日志
- `D:/AI_Project/fitnessCOACH/training_plans/*.json` — 训练计划

真实数据不在仓库中。如果文件不存在或为空，系统自动回退到 Mock 数据。

## 当前明确不支持

- **不写入 JSON** — 不会修改任何源文件
- **AI 仅生成预览** — PR3 开始接 AI，只生成计划预览，不写入 JSON
- **不上传图片** — 无图片识别
- **不登录/认证** — 单人本地使用
- **不使用数据库** — 纯本地文件
- **不保存/编辑** — 无表单提交、无 CRUD

## 只读边界

本项目是只读工作台。所有数据通过 `lib/data/` 下的 repository 只读获取，不会写回源 JSON。读取层对旧格式/坏数据做只读兼容（过滤 null、非 object、空对象、缺字段记录），不修复源文件。

## 项目结构

```
app/
├── page.tsx            # Dashboard
├── api/coach/route.ts  # AI 教练 API（POST，只生成预览，不写入）
├── coach/page.tsx      # 只读训练计划 + AI 生成预览
├── review/page.tsx     # 只读复盘
├── diet/page.tsx       # 只读饮食日志
└── archive/page.tsx    # 只读档案

components/
├── layout/             # Sidebar, Header, SystemModeBadge
├── dashboard/          # WeeklySummaryCards, RecentTrainingList, MVPStatusCard
├── coach/              # TrainingPlanList, PlanSourceNotice, AICoachPanel
├── review/             # ReviewRecordList, ReviewSourceNotice
├── diet/               # DietRecordList, DietSourceNotice
└── archive/            # DataSourceBadge, DataQualityCard, ArchiveRecentRecords, ArchivePlanPreview, ArchiveSearchPanel

lib/data/               # 数据层（只读）
├── config.ts           # 数据源配置
├── mock-source.ts      # Mock 数据
├── local-json-source.ts # 本地 JSON 读取（返回原始对象）
├── normalizers.ts      # 读取时数据标准化（纯函数）
├── training-repository.ts
├── diet-repository.ts
├── plan-repository.ts
├── dashboard-summary.ts
└── data-quality.ts     # 只读数据质量检测

lib/ai/                 # AI 教练层
├── model-config.ts     # AI 模型配置（环境变量）
├── prompt-builder.ts   # Prompt 构建（融合历史数据）
└── coach-client.ts     # AI 调用客户端（OpenAI 兼容格式）

types/                  # TypeScript 类型定义
prompts/                # AI 提示词模板（预留）
docs/                   # 文档
```

## 版本历史

| 阶段 | 说明 |
|------|------|
| PR1 | UI/Mock Dashboard 稳定 |
| PR1.1 | 结构整理和数据适配层准备 |
| PR1.2 | 只读本地 JSON 数据接入 |
| PR1.3 | Review 页面轻量统计完善 + 数据质量标记 |
| PR1.4 | Dashboard metric clarity polish |
| PR1.5 | Archive 只读档案预览 |
| PR1.6 | Coach page read-only plan clarity |
| PR1.7 | Review page read-only clarity |
| PR1.8 | Diet page read-only log clarity |
| PR1.9 | Archive read-only training plan preview |
| PR1.10 | Global read-only mode badge |
| PR1.11 | Read-only wording consistency cleanup |
| PR2 | v0.1 Read-only MVP finalization |
| PR2.1 | Read-time data normalization |
| PR2.2 | Archive read-only search & filters |
| **PR3** | **AI Coach API + training plan preview（当前）** |

## 后续方向

见 `docs/NEXT_STEPS.md`。
