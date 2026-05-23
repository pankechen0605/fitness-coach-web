import { TrainingRecord, TrainingPlan } from '@/types';

/**
 * 提示词构建器
 * 用于构建发送给 AI 的提示词
 */

/**
 * 构建训练计划生成提示词
 */
export function buildPlanGeneratorPrompt(
  userStatus: string,
  recentRecords: TrainingRecord[]
): string {
  const recentSummary = recentRecords
    .slice(0, 3)
    .map((r) => `${r.date} ${r.part} - ${r.rating} (RPE ${r.rpe})`)
    .join('\n');

  return `你是一个数据驱动的健身教练。根据用户状态和历史数据生成训练计划。

用户当前状态：${userStatus}

最近训练记录：
${recentSummary}

请生成一个适合的训练计划，考虑：
1. 上次训练的恢复情况
2. 用户当前状态
3. 容量管理（单部位60-80次）
4. 动作排序（复合→拉背→孤立）`;
}

/**
 * 构建训练复盘分析提示词
 */
export function buildReviewAnalyzerPrompt(record: TrainingRecord): string {
  const completedCount = record.results.filter((r) => r.completed).length;
  const totalCount = record.results.length;

  return `分析以下训练记录，给出复盘反馈。

训练日期：${record.date}
训练部位：${record.part}
训练前状态：${record.status_before}
RPE：${record.rpe}
评分：${record.rating}

完成情况：${completedCount}/${totalCount}

动作详情：
${record.results.map((r) => `- ${r.name}: ${r.completed ? '完成' : '未完成'} ${r.note || ''}`).join('\n')}

调整记录：
${record.adjustments.map((a) => `- ${a.action}: ${a.reason}`).join('\n')}

请给出：
1. 整体评分（A/B/C/D）和理由
2. 亮点
3. 优化建议
4. 补充剂建议（如有）`;
}

/**
 * 构建伤病调整提示词
 */
export function buildInjuryAdjusterPrompt(
  injuryDescription: string,
  currentPlan: TrainingPlan
): string {
  return `用户报告身体不适，需要调整训练计划。

不适描述：${injuryDescription}

当前计划：${currentPlan.title}
主训练动作：
${currentPlan.main.map((e) => `- ${e.name} ${e.sets}组x${e.reps}`).join('\n')}

请给出：
1. 替代动作建议
2. 减重减量建议
3. 是否需要跳过某些动作
4. 注意事项`;
}

/**
 * 构建饮食建议提示词
 */
export function buildDietAdvisorPrompt(
  trainingDate: string,
  trainingPart: string,
  currentCalories: number
): string {
  return `根据训练安排给出饮食建议。

训练日期：${trainingDate}
训练部位：${trainingPart}
当前热量摄入：${currentCalories} kcal

请给出：
1. 训练前餐建议
2. 训练后餐建议
3. 蛋白质摄入建议
4. 水分补充建议`;
}
