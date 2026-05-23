import 'server-only';
import { TrainingRecord, TrainingPlan, DietRecord } from '@/types';
import { DATA_CONFIG } from './config';

const DATA_DIR = DATA_CONFIG.LOCAL_DATA_DIR;

/**
 * 数据源类型
 */
export type DataSource = 'local' | 'mock-fallback';

/**
 * 带数据源标识的结果
 */
export interface DataResult<T> {
  data: T[];
  source: DataSource;
}

/**
 * 安全读取 JSON 文件
 * - 只读，不写入
 * - 文件不存在、解析失败时返回空数组
 * - 过滤 null/undefined/非 object
 */
type ObjectGuard = (item: Record<string, unknown>) => boolean;

function isObjectRecord(item: unknown): item is Record<string, unknown> {
  if (item === null || item === undefined || typeof item !== 'object') {
    return false;
  }
  // 过滤空对象
  const keys = Object.keys(item);
  return keys.length > 0;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isRating(value: unknown): value is TrainingRecord['rating'] {
  return value === 'great' || value === 'good' || value === 'okay' || value === 'bad';
}

function isTrainingRecord(item: Record<string, unknown>): boolean {
  return (
    isString(item.plan_id) &&
    isString(item.date) &&
    isString(item.part) &&
    isNumber(item.rpe) &&
    isRating(item.rating) &&
    isString(item.notes) &&
    Array.isArray(item.results) &&
    Array.isArray(item.adjustments)
  );
}

function isDietRecord(item: Record<string, unknown>): boolean {
  return (
    isString(item.id) &&
    isString(item.date) &&
    isString(item.meal) &&
    Array.isArray(item.foods) &&
    isNumber(item.totalCalories) &&
    isObjectRecord(item.macros)
  );
}

function isTrainingPlan(item: Record<string, unknown>): boolean {
  return (
    isString(item.plan_id) &&
    isString(item.title) &&
    isString(item.date) &&
    isString(item.status) &&
    isNumber(item.duration) &&
    Array.isArray(item.warmup) &&
    Array.isArray(item.main) &&
    Array.isArray(item.finisher)
  );
}

async function safeReadJson<T>(
  filePath: string,
  guard: ObjectGuard
): Promise<DataResult<T>> {
  const { readFile } = await import('fs/promises');
  try {
    const content = await readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    const arr = Array.isArray(parsed) ? parsed : [parsed];

    // 过滤 null/undefined/非 object/缺少页面必需字段的记录
    const valid = arr.filter((item) => isObjectRecord(item) && guard(item)) as T[];

    if (valid.length === 0) {
      console.warn(`[local-json-source] 文件无有效记录: ${filePath}`);
      return { data: [], source: 'mock-fallback' };
    }

    return { data: valid, source: 'local' };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn(`[local-json-source] 文件不存在: ${filePath}`);
    } else if (error instanceof SyntaxError) {
      console.warn(`[local-json-source] JSON 解析失败: ${filePath}`);
    } else {
      console.warn(`[local-json-source] 读取失败: ${filePath}`, error);
    }
    return { data: [], source: 'mock-fallback' };
  }
}

/**
 * 读取训练日志
 */
export async function readTrainingLog(): Promise<DataResult<TrainingRecord>> {
  const { join } = await import('path');
  const filePath = join(DATA_DIR, 'training_log.json');
  return safeReadJson<TrainingRecord>(filePath, isTrainingRecord);
}

/**
 * 读取饮食日志
 */
export async function readDietLog(): Promise<DataResult<DietRecord>> {
  const { join } = await import('path');
  const filePath = join(DATA_DIR, 'diet_log.json');
  return safeReadJson<DietRecord>(filePath, isDietRecord);
}

/**
 * 读取所有训练计划
 */
export async function readTrainingPlans(): Promise<DataResult<TrainingPlan>> {
  const { join } = await import('path');
  const { readdir } = await import('fs/promises');
  const plansDir = join(DATA_DIR, 'training_plans');

  try {
    const files = await readdir(plansDir);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));

    if (jsonFiles.length === 0) {
      console.warn(`[local-json-source] 目录无 JSON 文件: ${plansDir}`);
      return { data: [], source: 'mock-fallback' };
    }

    const allPlans: TrainingPlan[] = [];
    for (const file of jsonFiles) {
      const filePath = join(plansDir, file);
      const result = await safeReadJson<TrainingPlan>(filePath, isTrainingPlan);
      allPlans.push(...result.data);
    }

    if (allPlans.length === 0) {
      return { data: [], source: 'mock-fallback' };
    }

    return { data: allPlans, source: 'local' };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn(`[local-json-source] 目录不存在: ${plansDir}`);
    } else {
      console.warn(`[local-json-source] 读取目录失败: ${plansDir}`, error);
    }
    return { data: [], source: 'mock-fallback' };
  }
}
