# 后续方向

以下为可能的后续演进方向，当前均未实现。

## PR2.1 — 读取时数据标准化 ✅

- 新增 `lib/data/normalizers.ts` 纯函数标准化层
- `normalizeTrainingRecord`：rpe 字符串转数字 + clamp 0-10、rating 未知→okay、缺字段安全 fallback
- `normalizeDietRecord`：totalCalories 字符串转数字、macros 缺失→0、foods 非数组→[]
- `normalizeTrainingPlan`：duration 字符串提取数字（"60-70min"→60）、缺字段安全 fallback
- Repository 接入：读取原始 JSON → normalize → 过滤 null → 空则 mock fallback
- 不修改源 JSON 文件，只在读取时标准化

## PR2.2 — Archive 只读搜索与筛选 ✅

- 新增 `components/archive/ArchiveSearchPanel.tsx` client component
- 关键词搜索：训练记录（date/part/rating/notes/results 动作名）、饮食记录（date/meal/foods.name）、训练计划（date/title/status/main 动作名）
- 类型筛选：全部 / 训练记录 / 饮食记录 / 训练计划
- 日期筛选：全部 / 最近 7 天 / 最近 30 天
- 计划状态筛选：全部 / planned / pending / completed / unknown
- 结果最多显示 20 条，按日期降序
- 纯前端内存筛选，不写 JSON，不调 API

## PR3 — AI Coach API + training plan preview ✅

- 新增 `app/api/coach/route.ts` POST 接口
- 新增 `lib/ai/` 模块（model-config / prompt-builder / coach-client）
- AI provider 使用 OpenAI 兼容格式，API key 从环境变量读取
- Prompt 融合 fitness-coach 规则 + 历史训练/饮食/计划数据
- /coach 页面新增 AICoachPanel：状态、想练/不想练、时间、不适、器械
- 生成结果展示：人类可读计划 + JSON preview
- 明确提示：预览未写入文件
- 不写入 JSON，不保存 training_plans

## PR4 — 安全写入 + 训练计划保存

- 写入前自动备份源 JSON
- 写入操作需要用户确认
- AI 生成的计划保存到 training_plans/
- 写入日志记录

## PR5 — 图片上传与识别

- 饮食拍照识别
- 图片压缩与本地存储

## PR6 — 多设备同步

- 可选的云同步机制
- 冲突解决策略
