import { DietRecord } from '@/types';
import { mockDietRecords } from './mock-source';
import { DATA_CONFIG } from './config';
import type { DataSource } from './local-json-source';

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
  static lastSource: DataSource = 'mock-fallback';

  /**
   * 获取所有饮食记录
   */
  static async getAll(): Promise<DietRecord[]> {
    if (DATA_CONFIG.USE_MOCK || !isServer()) {
      this.lastSource = 'mock-fallback';
      return mockDietRecords;
    }

    const { readDietLog } = await import('./local-json-source');
    const result = await readDietLog();

    if (result.data.length === 0) {
      this.lastSource = 'mock-fallback';
      return mockDietRecords;
    }

    this.lastSource = result.source;
    return result.data;
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
