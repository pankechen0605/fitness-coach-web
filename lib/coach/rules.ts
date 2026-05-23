/**
 * 健身教练规则引擎
 * 基于 fitness-coach skill 的核心原则
 */

// 容量管理规则
export const VOLUME_RULES = {
  // 单部位训练总量上限
  MAX_VOLUME_PER_PART: 80,
  // 建议训练量范围
  RECOMMENDED_VOLUME: { min: 60, max: 80 },
  // 动作变式数量建议
  RECOMMENDED_VARIATIONS: { min: 2, max: 3 },
} as const;

// 动作排序规则
export const EXERCISE_ORDER = {
  // 正确顺序：复合 → 拉背 → 孤立
  SEQUENCE: ['compound', 'pull', 'isolation'] as const,
  // 复合动作关键词
  COMPOUND_KEYWORDS: ['深蹲', '硬拉', '卧推', '划船', '推举'],
  // 拉背动作关键词
  PULL_KEYWORDS: ['下拉', '引体', '面拉'],
  // 孤立动作关键词
  ISOLATION_KEYWORDS: ['弯举', '下压', '飞鸟', '侧平举', '前平举'],
} as const;

// 左右不对称处理规则
export const ASYMMETRY_RULES = {
  // 弱侧优先
  WEAK_SIDE_FIRST: true,
  // 弱侧次数 = 强侧次数
  MATCH_REPS: true,
} as const;

// 补充剂追踪规则
export const SUPPLEMENT_RULES = {
  // 需要追踪的补充剂
  SUPPLEMENTS: ['肌酸', '氮泵', '咖啡', '蛋白粉'],
  // 肌酸建议用量
  CREATINE_DOSE: '5g',
  // 肌酸服用时间
  CREATINE_TIMING: '训练前30分钟',
} as const;

// 上下文反馈规则
export const FEEDBACK_RULES = {
  // 评分标准
  RATING_CRITERIA: {
    great: '完美执行计划甚至超出',
    good: '完成度好但有优化空间',
    okay: '明显不足',
    bad: '需要调整',
  },
  // 需要考虑的上下文维度
  CONTEXT_DIMENSIONS: [
    '前日训练',
    '训练状态',
    '动作目标',
    '客观环境',
    '补充剂影响',
  ],
} as const;
