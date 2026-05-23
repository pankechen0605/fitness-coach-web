import { TrainingRecord } from '@/types';
import { mockTrainingRecords } from './mock-source';
import { DATA_CONFIG } from './config';

/**
 * 训练记录仓库
 * PR1.1: 返回 mock 数据
 * PR1.2: 从本地 JSON 文件读取
 */
export class TrainingRepository {
  /**
   * 获取所有训练记录
   */
  static async getAll(): Promise<TrainingRecord[]> {
    if (DATA_CONFIG.USE_MOCK) {
      return mockTrainingRecords;
    }

    // PR1.2: 从本地 JSON 文件读取
    // const filePath = path.join(DATA_CONFIG.LOCAL_DATA_DIR, DATA_CONFIG.FILES.TRAINING_LOG);
    // const data = await fs.readFile(filePath, 'utf-8');
    // return JSON.parse(data);

    return mockTrainingRecords;
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
