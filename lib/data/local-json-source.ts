import 'server-only';
import { TrainingRecord, TrainingPlan, DietRecord } from '@/types';
import { DATA_CONFIG } from './config';

const DATA_DIR = DATA_CONFIG.LOCAL_DATA_DIR;

/**
 * 安全读取 JSON 文件
 * 文件不存在或解析失败时返回空数组并 console.warn
 */
async function safeReadJson<T>(filePath: string): Promise<T[]> {
  const { readFile } = await import('fs/promises');
  try {
    const content = await readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn(`[local-json-source] 文件不存在: ${filePath}`);
    } else {
      console.warn(`[local-json-source] 读取或解析失败: ${filePath}`, error);
    }
    return [];
  }
}

/**
 * 读取训练日志
 * 来源: D:/AI_Project/fitnessCOACH/training_log.json
 */
export async function readTrainingLog(): Promise<TrainingRecord[]> {
  const { join } = await import('path');
  const filePath = join(DATA_DIR, 'training_log.json');
  return safeReadJson<TrainingRecord>(filePath);
}

/**
 * 读取饮食日志
 * 来源: D:/AI_Project/fitnessCOACH/diet_log.json
 */
export async function readDietLog(): Promise<DietRecord[]> {
  const { join } = await import('path');
  const filePath = join(DATA_DIR, 'diet_log.json');
  return safeReadJson<DietRecord>(filePath);
}

/**
 * 读取所有训练计划
 * 来源: D:/AI_Project/fitnessCOACH/training_plans/*.json
 */
export async function readTrainingPlans(): Promise<TrainingPlan[]> {
  const { join } = await import('path');
  const { readdir } = await import('fs/promises');
  const plansDir = join(DATA_DIR, 'training_plans');

  try {
    const files = await readdir(plansDir);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));

    const plans: TrainingPlan[] = [];
    for (const file of jsonFiles) {
      const filePath = join(plansDir, file);
      const filePlans = await safeReadJson<TrainingPlan>(filePath);
      plans.push(...filePlans);
    }

    return plans;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn(`[local-json-source] 目录不存在: ${plansDir}`);
    } else {
      console.warn(`[local-json-source] 读取目录失败: ${plansDir}`, error);
    }
    return [];
  }
}
