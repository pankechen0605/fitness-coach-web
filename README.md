# Fitness Coach Web

本地优先的私人训练控制台。只读 JSON 数据驱动，无登录，无数据库。

## 当前状态

**PR5: Photo diet record with AI vision + safe save** — /diet 支持拍照识别饮食并安全保存到 diet_log.json。

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
| Coach (`/coach`) | 只读训练计划 + AI 生成预览 + 安全保存到 training_plans |
| Review (`/review`) | 只读复盘视图，平均 RPE、完成率、最佳评分 |
| Diet (`/diet`) | 只读饮食日志 + 拍照识别饮食 + 安全保存到 diet_log.json |
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

- **仅写入 training_plans 和 diet_log** — PR4 安全写入训练计划，PR5 安全追加饮食记录（写入前自动备份），仍不写 training_log
- **AI 生成 + 保存** — AI 生成计划预览后可确认保存
- **饮食拍照识别** — PR5 支持食物照片 AI 识别，图片保存到 diet_photos，记录追加到 diet_log.json
- **不登录/认证** — 单人本地使用
- **不使用数据库** — 纯本地文件
- **不保存/编辑** — 无表单提交、无 CRUD

## 只读边界

本项目是只读工作台。所有数据通过 `lib/data/` 下的 repository 只读获取，不会写回源 JSON。读取层对旧格式/坏数据做只读兼容（过滤 null、非 object、空对象、缺字段记录），不修复源文件。

## 项目结构

```
app/
├── page.tsx            # Dashboard
├── api/coach/route.ts  # AI 教练 API（POST，生成预览）
├── api/plans/save/route.ts # 保存训练计划（POST，带备份）
├── api/diet/photo/analyze/route.ts # AI 食物识别（POST，返回预览）
├── api/diet/photo/save/route.ts # 保存饮食记录+图片（POST，带备份）
├── coach/page.tsx      # 只读训练计划 + AI 生成预览
├── review/page.tsx     # 只读复盘
├── diet/page.tsx       # 只读饮食日志
└── archive/page.tsx    # 只读档案

components/
├── layout/             # Sidebar, Header, SystemModeBadge
├── dashboard/          # WeeklySummaryCards, RecentTrainingList, MVPStatusCard
├── coach/              # TrainingPlanList, PlanSourceNotice, AICoachPanel
├── review/             # ReviewRecordList, ReviewSourceNotice
├── diet/               # DietRecordList, DietSourceNotice, PhotoDietPanel
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
├── data-quality.ts     # 只读数据质量检测
├── safe-writer.ts      # 安全写入训练计划（validate + backup + write training_plans）
└── safe-diet-writer.ts # 安全写入饮食（save photo + append diet_log.json with backup）

lib/ai/                 # AI 教练层
├── model-config.ts     # AI 模型配置（环境变量）
├── prompt-builder.ts   # Prompt 构建（融合历史数据）
├── coach-client.ts     # AI 训练计划生成客户端（OpenAI 兼容格式）
└── food-client.ts      # AI 食物识别客户端（Vision API）

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
| PR3 | AI Coach API + training plan preview |
| PR4 | Safe save generated training plan |
| **PR5** | **Photo diet record with AI vision + safe save（当前）** |

## 后续方向

见 `docs/NEXT_STEPS.md`。
