import 'server-only';
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
 * 判断是否为非空对象
 */
function isObjectRecord(item: unknown): item is Record<string, unknown> {
  if (item === null || item === undefined || typeof item !== 'object') {
    return false;
  }
  return Object.keys(item).length > 0;
}

/**
 * 安全读取 JSON 文件
 * - 只读，不写入
 * - 文件不存在、解析失败时返回空数组
 * - 过滤 null/undefined/非 object
 * - 不做字段验证，由 repository 层 normalize
 */
async function safeReadJson(filePath: string): Promise<DataResult<Record<string, unknown>>> {
  const { readFile } = await import('fs/promises');
  try {
    const content = await readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    const arr = Array.isArray(parsed) ? parsed : [parsed];

    const valid = arr.filter(isObjectRecord);

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
 * 读取训练日志（原始对象，由 repository 层 normalize）
 */
export async function readTrainingLog(): Promise<DataResult<Record<string, unknown>>> {
  const { join } = await import('path');
  const filePath = join(DATA_DIR, 'training_log.json');
  return safeReadJson(filePath);
}

/**
 * 读取饮食日志（原始对象，由 repository 层 normalize）
 */
export async function readDietLog(): Promise<DataResult<Record<string, unknown>>> {
  const { join } = await import('path');
  const filePath = join(DATA_DIR, 'diet_log.json');
  return safeReadJson(filePath);
}

/**
 * 读取所有训练计划（原始对象，由 repository 层 normalize）
 */
export async function readTrainingPlans(): Promise<DataResult<Record<string, unknown>>> {
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

    const allRaw: Record<string, unknown>[] = [];
    for (const file of jsonFiles) {
      const filePath = join(plansDir, file);
      const result = await safeReadJson(filePath);
      allRaw.push(...result.data);
    }

    if (allRaw.length === 0) {
      return { data: [], source: 'mock-fallback' };
    }

    return { data: allRaw, source: 'local' };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn(`[local-json-source] 目录不存在: ${plansDir}`);
    } else {
      console.warn(`[local-json-source] 读取目录失败: ${plansDir}`, error);
    }
    return { data: [], source: 'mock-fallback' };
  }
}
