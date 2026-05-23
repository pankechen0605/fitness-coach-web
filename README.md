# Fitness Coach Web

本地优先的 AI 私人训练控制台。

## 项目简介

这是一个单人使用的健身训练管理系统，用于：
- 训练计划管理
- 训练复盘与评分
- 饮食记录追踪
- 历史数据档案

**当前状态**：PR1 阶段，使用 Mock 数据，UI 框架已完成。

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

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

## 数据说明

本项目使用 Mock 数据进行开发。真实训练数据存储在本地 `D:/AI_Project/fitnessCOACH/` 目录，**不在本仓库中**。

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
└── dashboard/          # 仪表盘组件

lib/
└── mock-data.ts        # Mock 数据
```

## 开发原则

- 本地优先，无需数据库
- 无需登录认证
- 深色主题，数据仪表盘风格
- 数据驱动，不说口号
