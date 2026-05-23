import type {
  TrainingRecord,
  TrainingPlan,
  DietRecord,
  ExerciseResult,
  Adjustment,
  Food,
  Macros,
} from '@/types';

// ── helpers ──────────────────────────────────────────────────────────

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toStr(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

/** 尝试将值转为有限数字，失败返回 fallback */
function toNum(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    // 提取第一个数字（处理 "60"、"60min"、"60-70min"、"75 分钟"）
    const match = value.match(/[\d.]+/);
    if (match) {
      const n = Number.parseFloat(match[0]);
      if (Number.isFinite(n)) return n;
    }
  }
  return fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

const VALID_RATINGS = new Set(['great', 'good', 'okay', 'bad']);
const VALID_MEALS = new Set(['breakfast', 'lunch', 'dinner', 'snack']);

// ── ExerciseResult / Adjustment / Food 子对象标准化 ─────────────────

function normalizeExerciseResult(raw: unknown): ExerciseResult {
  if (!isObject(raw)) {
    return { name: '未知动作', planned: '', actual: '', completed: false };
  }
  return {
    name: toStr(raw.name, '未知动作'),
    planned: toStr(raw.planned, ''),
    actual: toStr(raw.actual, ''),
    completed: Boolean(raw.completed),
    ...(typeof raw.note === 'string' ? { note: raw.note } : {}),
  };
}

function normalizeAdjustment(raw: unknown): Adjustment {
  if (!isObject(raw)) {
    return { action: 'modify', reason: '' };
  }
  const validActions = new Set(['replace', 'modify', 'remove', 'add']);
  const action = validActions.has(raw.action as string)
    ? (raw.action as Adjustment['action'])
    : 'modify';
  return {
    action,
    ...(typeof raw.from === 'string' ? { from: raw.from } : {}),
    ...(typeof raw.to === 'string' ? { to: raw.to } : {}),
    reason: toStr(raw.reason, ''),
  };
}

function normalizeFood(raw: unknown): Food {
  if (!isObject(raw)) {
    return { name: '未命名食物', amount: '', calories: 0 };
  }
  return {
    name: toStr(raw.name, '未命名食物'),
    amount: toStr(raw.amount, ''),
    calories: toNum(raw.calories, 0),
  };
}

function normalizeMacros(raw: unknown): Macros {
  if (!isObject(raw)) {
    return { protein: 0, carbs: 0, fat: 0 };
  }
  return {
    protein: toNum(raw.protein, 0),
    carbs: toNum(raw.carbs, 0),
    fat: toNum(raw.fat, 0),
  };
}

// ── 主标准化函数 ────────────────────────────────────────────────────

/**
 * 标准化训练记录。
 * 接受任意原始数据，返回标准化后的 TrainingRecord 或 null（完全不可用）。
 * 纯函数：不读文件、不写文件、不修改传入对象。
 */
export function normalizeTrainingRecord(raw: unknown): TrainingRecord | null {
  if (!isObject(raw)) return null;

  // 至少需要 date 或 plan_id 才有意义
  const planId = toStr(raw.plan_id, '');
  const date = toStr(raw.date, '');
  if (!planId && !date) return null;

  const rating = raw.rating;
  const safeRating: TrainingRecord['rating'] =
    VALID_RATINGS.has(rating as string) ? (rating as TrainingRecord['rating']) : 'okay';

  const rpe = clamp(toNum(raw.rpe, 0), 0, 10);

  const results = Array.isArray(raw.results)
    ? raw.results.map(normalizeExerciseResult)
    : [];

  const adjustments = Array.isArray(raw.adjustments)
    ? raw.adjustments.map(normalizeAdjustment)
    : [];

  return {
    plan_id: planId || `unknown-${date}`,
    date: date || '未知日期',
    part: toStr(raw.part, 'unknown'),
    status_before: toStr(raw.status_before, ''),
    rpe,
    rating: safeRating,
    notes: toStr(raw.notes, ''),
    results,
    adjustments,
  };
}

/**
 * 标准化饮食记录。
 * 纯函数：不读文件、不写文件、不修改传入对象。
 */
export function normalizeDietRecord(raw: unknown): DietRecord | null {
  if (!isObject(raw)) return null;

  const id = toStr(raw.id, '') || toStr(raw.meal_id, '');
  const date = toStr(raw.date, '');
  if (!id && !date) return null;

  const meal = raw.meal;
  const safeMeal: DietRecord['meal'] =
    VALID_MEALS.has(meal as string) ? (meal as DietRecord['meal']) : 'snack';

  const foods = Array.isArray(raw.foods) ? raw.foods.map(normalizeFood) : [];

  return {
    id: id || `unknown-${date}`,
    date: date || '未知日期',
    meal: safeMeal,
    foods,
    totalCalories: toNum(raw.totalCalories, 0),
    macros: normalizeMacros(raw.macros),
  };
}

/**
 * 标准化训练计划。
 * 纯函数：不读文件、不写文件、不修改传入对象。
 */
export function normalizeTrainingPlan(raw: unknown): TrainingPlan | null {
  if (!isObject(raw)) return null;

  const planId = toStr(raw.plan_id, '');
  const date = toStr(raw.date, '');
  if (!planId && !date) return null;

  const duration = raw.duration !== undefined && raw.duration !== null
    ? (typeof raw.duration === 'number' ? raw.duration : toNum(raw.duration, 0))
    : 0;

  return {
    plan_id: planId || `plan-${date}`,
    title: toStr(raw.title, '未命名计划'),
    date: date || '未知日期',
    status: toStr(raw.status, 'unknown'),
    duration,
    warmup: Array.isArray(raw.warmup) ? raw.warmup : [],
    main: Array.isArray(raw.main) ? raw.main : [],
    finisher: Array.isArray(raw.finisher) ? raw.finisher : [],
    posture: toStr(raw.posture, ''),
  };
}
