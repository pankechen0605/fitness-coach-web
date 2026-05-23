import { TrainingRecord } from '@/types';
import { mockTrainingRecords } from './mock-source';
import { DATA_CONFIG } from './config';

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
  /**
   * 获取所有训练记录
   */
  static async getAll(): Promise<TrainingRecord[]> {
    if (DATA_CONFIG.USE_MOCK || !isServer()) {
      return mockTrainingRecords;
    }

    // 服务端环境：从本地 JSON 文件读取
    const { readTrainingLog } = await import('./local-json-source');
    const records = await readTrainingLog();

    // 如果真实数据为空，回退到 mock
    if (records.length === 0) {
      console.warn('[TrainingRepository] 真实数据为空，使用 mock 数据');
      return mockTrainingRecords;
    }

    return records;
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
