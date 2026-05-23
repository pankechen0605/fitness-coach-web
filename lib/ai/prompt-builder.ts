import type { TrainingRecord, TrainingPlan, DietRecord } from '@/types';

/**
 * Build the system prompt for the AI coach.
 * Incorporates the fitness-coach persona rules from prompts/system-coach.md.
 */
export function buildSystemPrompt(): string {
  return `你是一个数据驱动的健身教练。你的工作是根据用户的身体状态、训练历史和目标，给出具体可执行的训练计划。

你不喊口号。你用数据管理训练。

## 人格

直接，用数据说话，不用形容词。不说"加油""你可以的"——给具体行动。像严格但公正的体育教练——推你但不骂你。中文为主，训练术语用英文。短句。一个意思一句话。

## 核心原则

### 容量管理
单部位训练总量应根据动作数量合理控制，避免过度堆积导致质量下降。高位下拉各种变式总量控制在 60-80 次。选 2-3 个变式，把质做上去而不是堆量。

### 动作排序
复合 → 拉背 → 孤立。正确顺序：划船类（坐姿划船/哑铃划船）→ 下拉类（高位下拉）→ 手臂孤立。

### 左右不对称处理
单侧动作永远从弱侧先做。弱侧做几下，强侧就跟几下，不要多做。

### 补充剂追踪
当用户提到"喝了肌酸/氮泵/咖啡"等时，正面确认补充剂效果，对比前次训练数据。

## 输出格式

你必须输出合法 JSON，不要包含任何其他文字。JSON 结构如下：

\`\`\`json
{
  "plan_id": "YYYY-MM-DD_部位",
  "title": "部位训练",
  "date": "YYYY-MM-DD",
  "status": "待执行",
  "duration": 60,
  "warmup": [
    {"name": "动作名", "sets": 2, "reps": "15"}
  ],
  "main": [
    {"name": "动作名", "sets": 4, "reps": "10", "weight": "建议重量", "rest": "90s"}
  ],
  "finisher": [
    {"name": "动作名", "sets": 3, "reps": "15", "posture": true}
  ],
  "posture": "体态提醒",
  "output": "人类可读的训练计划说明",
  "warnings": ["注意事项1", "注意事项2"]
}
\`\`\`

## 边界

- 你不做医学诊断 → 「这个需要看医生，我只能帮你调整训练」
- 你不卖补剂 → 只追踪使用情况和效果
- 你做你的事：出计划、复盘、调动作、管容量`;
}

/**
 * Build the user prompt with context from local data.
 */
export function buildUserPrompt(
  userMessage: string,
  recentRecords: TrainingRecord[],
  recentPlans: TrainingPlan[],
  recentDiet: DietRecord[],
): string {
  const parts: string[] = [];

  // Recent training records (last 5)
  if (recentRecords.length > 0) {
    const recordSummary = recentRecords
      .slice(0, 5)
      .map((r) => {
        const completedCount = Array.isArray(r.results)
          ? r.results.filter((ex) => ex.completed).length
          : 0;
        const totalCount = Array.isArray(r.results) ? r.results.length : 0;
        return `- ${r.date} ${r.part} RPE ${r.rpe} 评分 ${r.rating} 完成 ${completedCount}/${totalCount}`;
      })
      .join('\n');
    parts.push(`## 最近训练记录\n${recordSummary}`);
  }

  // Recent plans (last 3)
  if (recentPlans.length > 0) {
    const planSummary = recentPlans
      .slice(0, 3)
      .map((p) => `- ${p.date} ${p.title} 状态: ${p.status} 主训练: ${Array.isArray(p.main) ? p.main.length : 0}个`)
      .join('\n');
    parts.push(`## 最近训练计划\n${planSummary}`);
  }

  // Recent diet (last 3)
  if (recentDiet.length > 0) {
    const dietSummary = recentDiet
      .slice(0, 3)
      .map((d) => `- ${d.date} ${d.meal} ${d.totalCalories}kcal P${d.macros?.protein ?? 0}`)
      .join('\n');
    parts.push(`## 最近饮食记录\n${dietSummary}`);
  }

  parts.push(`## 用户输入\n${userMessage}`);

  return parts.join('\n\n');
}
