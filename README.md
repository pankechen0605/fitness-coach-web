# Fitness Coach Web

本地优先的 AI 私人训练控制台。

## 项目简介

这是一个单人使用的健身训练管理系统，用于：
- 训练计划管理
- 训练复盘与评分
- 饮食记录追踪
- 历史数据档案

**当前状态**：PR1.4 阶段，Dashboard 指标清晰度优化。

## 本地运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev
# 访问 http://localhost:3000

# 生产构建
npm run build
```

## 技术栈

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

## 数据说明

### 数据来源

本项目从本地 JSON 文件**只读**数据：

- `D:/AI_Project/fitnessCOACH/training_log.json` - 训练日志
- `D:/AI_Project/fitnessCOACH/diet_log.json` - 饮食日志
- `D:/AI_Project/fitnessCOACH/training_plans/*.json` - 训练计划

### 数据安全

- **只读**：不写入任何 JSON 文件
- **不接 AI API**：AI 功能在后续版本实现
- **不使用数据库**：纯本地文件
- **真实数据不在仓库中**：`D:/AI_Project/fitnessCOACH/` 目录不提交

### Mock 回退

如果本地 JSON 文件不存在或为空，系统会自动回退到 Mock 数据，确保页面不会崩溃。

### 旧格式兼容

读取层会对旧格式/坏数据做只读兼容：过滤 null、非 object、空对象、缺少必需字段的记录，不会写回源 JSON。

### 数据质量标记

系统会在历史档案页进行只读数据质量标记，用于提示旧格式/疑似乱码记录，不会写回源 JSON。

## 项目结构

```
app/
├── page.tsx            # CoachOS 仪表盘
├── coach/page.tsx      # 今日教练台
├── review/page.tsx     # 训练复盘
├── diet/page.tsx       # 饮食记录
└── archive/page.tsx    # 历史档案

components/
├── layout/             # 布局组件
├── dashboard/          # 仪表盘组件
├── coach/              # 教练相关组件
├── review/             # 复盘相关组件
├── diet/               # 饮食相关组件
└── archive/            # 档案相关组件

lib/
├── data/               # 数据层
│   ├── config.ts       # 数据源配置
│   ├── mock-source.ts  # Mock 数据
│   ├── local-json-source.ts  # 本地 JSON 读取
│   ├── training-repository.ts
│   ├── diet-repository.ts
│   ├── plan-repository.ts
│   ├── dashboard-summary.ts
│   └── data-quality.ts    # 只读数据质量检测
├── coach/              # 教练逻辑
│   ├── rules.ts        # 规则引擎
│   ├── prompt-builder.ts
│   ├── route-intent.ts
│   └── schemas.ts
└── utils.ts

prompts/                # AI 提示词模板
types/                  # TypeScript 类型定义
```

## 开发原则

- 本地优先，无需数据库
- 只读本地 JSON，不写入
- 无需登录认证
- 深色主题，数据仪表盘风格
- 数据驱动，不说口号

## 版本历史

- **PR1**: UI/Mock Dashboard 稳定
- **PR1.1**: 结构整理和数据适配层准备
- **PR1.2**: 只读本地 JSON 数据接入
- **PR1.3**: Review 页面轻量统计完善 + 数据质量标记
- **PR1.4**: Dashboard metric clarity polish（当前）
