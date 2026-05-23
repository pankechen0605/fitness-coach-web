# 后续方向

以下为可能的后续演进方向，当前均未实现。

## PR2.1 — 读取时数据标准化 ✅

- 新增 `lib/data/normalizers.ts` 纯函数标准化层
- `normalizeTrainingRecord`：rpe 字符串转数字 + clamp 0-10、rating 未知→okay、缺字段安全 fallback
- `normalizeDietRecord`：totalCalories 字符串转数字、macros 缺失→0、foods 非数组→[]
- `normalizeTrainingPlan`：duration 字符串提取数字（"60-70min"→60）、缺字段安全 fallback
- Repository 接入：读取原始 JSON → normalize → 过滤 null → 空则 mock fallback
- 不修改源 JSON 文件，只在读取时标准化

## PR2.2 — 只读筛选/搜索

- /review 按部位/日期筛选
- /diet 按日期筛选
- /archive 搜索训练计划

## PR3 — 写入前备份机制

- 写入前自动备份源 JSON
- 写入操作需要用户确认
- 写入日志记录

## PR4 — AI 计划生成

- 接入 AI API 生成训练计划
- 基于历史数据的智能推荐
- 复盘分析与建议

## PR5 — 图片上传与识别

- 饮食拍照识别
- 图片压缩与本地存储

## PR6 — 多设备同步

- 可选的云同步机制
- 冲突解决策略
