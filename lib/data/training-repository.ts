import { TrainingRecord } from '@/types';
import { mockTrainingRecords } from './mock-source';
import { DATA_CONFIG } from './config';
import type { DataSource } from './local-json-source';

/**
 * 检查是否在服务端环境
 */
function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * 训练记录仓库
 */
export class TrainingRepository {
  static lastSource: DataSource = 'mock-fallback';

  /**
   * 获取所有训练记录
   */
  static async getAll(): Promise<TrainingRecord[]> {
    if (DATA_CONFIG.USE_MOCK || !isServer()) {
      this.lastSource = 'mock-fallback';
      return mockTrainingRecords;
    }

    const { readTrainingLog } = await import('./local-json-source');
    const result = await readTrainingLog();

    if (result.data.length === 0) {
      this.lastSource = 'mock-fallback';
      return mockTrainingRecords;
    }

    this.lastSource = result.source;
    return result.data;
  }

  /**
   * 获取最近 N 条训练记录
   */
  static async getRecent(count: number = 5): Promise<TrainingRecord[]> {
    const records = await this.getAll();
    return records.slice(0, count);
  }

  /**
   * 按部位筛选训练记录
   */
  static async getByPart(part: string): Promise<TrainingRecord[]> {
    const records = await this.getAll();
    return records.filter((r) => r.part === part);
  }

  /**
   * 获取最新一条训练记录
   */
  static async getLatest(): Promise<TrainingRecord | null> {
    const records = await this.getRecent(1);
    return records[0] || null;
  }
}
