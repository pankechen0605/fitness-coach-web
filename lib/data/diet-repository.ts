import { DietRecord } from '@/types';
import { mockDietRecords } from './mock-source';
import { normalizeDietRecord } from './normalizers';
import { DATA_CONFIG } from './config';
import type { DataSource } from './local-json-source';

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

    // normalize 原始数据，过滤 null
    const normalized = result.data
      .map(normalizeDietRecord)
      .filter((r): r is DietRecord => r !== null);

    if (normalized.length === 0) {
      this.lastSource = 'mock-fallback';
      return mockDietRecords;
    }

    this.lastSource = result.source;
    return normalized;
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
    return records.reduce((sum, r) => sum + (r.totalCalories ?? 0), 0);
  }

  /**
   * 获取每日宏量营养素
   */
  static async getDailyMacros(date: string): Promise<{ protein: number; carbs: number; fat: number }> {
    const records = await this.getByDate(date);
    return records.reduce(
      (acc, r) => ({
        protein: acc.protein + (r.macros?.protein ?? 0),
        carbs: acc.carbs + (r.macros?.carbs ?? 0),
        fat: acc.fat + (r.macros?.fat ?? 0),
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );
  }
}
