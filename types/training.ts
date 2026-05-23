// 训练动作
export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  rest?: string;
  posture?: boolean;
  note?: string;
}

// 动作执行结果
export interface ExerciseResult {
  name: string;
  planned: string;
  actual: string;
  completed: boolean;
  note?: string;
}

// 训练调整
export interface Adjustment {
  action: 'replace' | 'modify' | 'remove' | 'add';
  from?: string;
  to?: string;
  reason: string;
}

// 训练计划
export interface TrainingPlan {
  plan_id: string;
  title: string;
  date: string;
  status: string;
  duration: number | string;
  warmup: Exercise[];
  main: Exercise[];
  finisher: Exercise[];
  posture: string;
}

// 训练记录（复盘格式）
export interface TrainingRecord {
  plan_id: string;
  date: string;
  part: string;
  status_before: string;
  rpe: number;
  rating: 'good' | 'great' | 'okay' | 'bad';
  notes: string;
  results: ExerciseResult[];
  adjustments: Adjustment[];
}

// 评分类型
export type Rating = 'great' | 'good' | 'okay' | 'bad';

// 评分显示配置
export const RATING_CONFIG: Record<Rating, { label: string; color: string; bgColor: string }> = {
  great: { label: 'A', color: 'text-green-400', bgColor: 'bg-green-400/10' },
  good: { label: 'B', color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
  okay: { label: 'C', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' },
  bad: { label: 'D', color: 'text-red-400', bgColor: 'bg-red-400/10' },
};

// 训练部位
export type TrainingPart = 'back' | 'chest' | 'legs' | 'shoulders' | 'arms' | 'core' | 'cardio';

// 部位中文映射
export const PART_LABELS: Record<TrainingPart, string> = {
  back: '背部',
  chest: '胸部',
  legs: '腿部',
  shoulders: '肩部',
  arms: '手臂',
  core: '核心',
  cardio: '有氧',
};
