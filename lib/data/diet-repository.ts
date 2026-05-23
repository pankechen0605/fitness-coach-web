import { DietRecord } from '@/types';
import { mockDietRecords } from './mock-source';
import { DATA_CONFIG } from './config';

/**
 * 饮食记录仓库
 * PR1.1: 返回 mock 数据
 * PR1.2: 从本地 JSON 文件读取
 */
export class DietRepository {
  /**
   * 获取所有饮食记录
   */
  static async getAll(): Promise<DietRecord[]> {
    if (DATA_CONFIG.USE_MOCK) {
      return mockDietRecords;
    }

    // PR1.2: 从本地 JSON 文件读取
    return mockDietRecords;
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
