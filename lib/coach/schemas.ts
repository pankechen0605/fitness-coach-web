/**
 * 数据验证 Schema
 * 用于验证训练数据格式
 */

/**
 * 验证训练记录格式
 */
export function validateTrainingRecord(record: unknown): boolean {
  if (typeof record !== 'object' || record === null) return false;

  const r = record as Record<string, unknown>;

  return (
    typeof r.plan_id === 'string' &&
    typeof r.date === 'string' &&
    typeof r.part === 'string' &&
    typeof r.rpe === 'number' &&
    r.rpe >= 1 &&
    r.rpe <= 10 &&
    ['good', 'great', 'okay', 'bad'].includes(r.rating as string) &&
    Array.isArray(r.results)
  );
}

/**
 * 验证训练计划格式
 */
export function validateTrainingPlan(plan: unknown): boolean {
  if (typeof plan !== 'object' || plan === null) return false;

  const p = plan as Record<string, unknown>;

  return (
    typeof p.plan_id === 'string' &&
    typeof p.title === 'string' &&
    typeof p.date === 'string' &&
    (typeof p.duration === 'number' || typeof p.duration === 'string') &&
    Array.isArray(p.warmup) &&
    Array.isArray(p.main) &&
    Array.isArray(p.finisher)
  );
}

/**
 * 验证饮食记录格式
 */
export function validateDietRecord(record: unknown): boolean {
  if (typeof record !== 'object' || record === null) return false;

  const r = record as Record<string, unknown>;

  return (
    typeof r.id === 'string' &&
    typeof r.date === 'string' &&
    ['breakfast', 'lunch', 'dinner', 'snack'].includes(r.meal as string) &&
    Array.isArray(r.foods) &&
    typeof r.totalCalories === 'number' &&
    r.totalCalories >= 0
  );
}
