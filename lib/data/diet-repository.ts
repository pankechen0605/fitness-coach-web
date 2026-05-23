import { DietRecord } from '@/types';
import { mockDietRecords } from './mock-source';
import { DATA_CONFIG } from './config';

/**
 * 检查是否在服务端环境
 */
function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * 饮食记录仓库
 */
export class DietRepository {
  /**
   * 获取所有饮食记录
   */
  static async getAll(): Promise<DietRecord[]> {
    if (DATA_CONFIG.USE_MOCK || !isServer()) {
      return mockDietRecords;
    }

    // 服务端环境：从本地 JSON 文件读取
    const { readDietLog } = await import('./local-json-source');
    const records = await readDietLog();

    // 如果真实数据为空，回退到 mock
    if (records.length === 0) {
      console.warn('[DietRepository] 真实数据为空，使用 mock 数据');
      return mockDietRecords;
    }

    return records;
  }

  /**
   * 按日期筛选饮食记录
   */
  static async getByDate(date: string): Promise<DietRecord[]> {
    const records = await this.getAll();
    return records.filter((r) => r.date === date);
  }

  /**
   * 获取今日饮食记录
   */
  static async getToday(): Promise<DietRecord[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getByDate(today);
  }

  /**
   * 获取每日总热量
   */
  static async getDailyCalories(date: string): Promise<number> {
    const records = await this.getByDate(date);
    return records.reduce((sum, r) => sum + r.totalCalories, 0);
  }

  /**
   * 获取每日宏量营养素
   */
  static async getDailyMacros(date: string): Promise<{ protein: number; carbs: number; fat: number }> {
    const records = await this.getByDate(date);
    return records.reduce(
      (acc, r) => ({
        protein: acc.protein + r.macros.protein,
        carbs: acc.carbs + r.macros.carbs,
        fat: acc.fat + r.macros.fat,
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );
  }
}
