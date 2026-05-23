import { WeeklySummary, TrainingRecord } from '@/types';
import { mockWeeklySummary } from './mock-source';
import { DATA_CONFIG } from './config';
import type { DataSource } from './local-json-source';

/**
 * 检查是否在服务端环境
 */
function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * 仪表盘汇总数据
 */
export class DashboardSummary {
  static lastSource: DataSource = 'mock-fallback';

  /**
   * 获取周汇总数据
   */
  static async getWeeklySummary(): Promise<WeeklySummary> {
    if (DATA_CONFIG.USE_MOCK || !isServer()) {
      this.lastSource = 'mock-fallback';
      return mockWeeklySummary;
    }

    const { readTrainingLog } = await import('./local-json-source');
    const result = await readTrainingLog();

    if (result.data.length === 0) {
      this.lastSource = 'mock-fallback';
      return mockWeeklySummary;
    }

    this.lastSource = result.source;
    return this.calculateFromRecords(result.data);
  }

  /**
   * 从训练记录计算周汇总
   * - 不伪造训练时长（真实数据无此字段）
   * - 不伪造热量消耗（真实数据无此字段）
   */
  static calculateFromRecords(records: TrainingRecord[]): WeeklySummary {
    const trainingDays = new Set(records.map((r) => r.date)).size;
    const averageRPE = records.reduce((sum, r) => sum + r.rpe, 0) / records.length;

    const ratingDistribution = records.reduce(
      (acc, r) => {
        acc[r.rating]++;
        return acc;
      },
      { great: 0, good: 0, okay: 0, bad: 0 }
    );

    return {
      trainingDays,
      totalDuration: 0, // 真实数据无此字段，不伪造
      totalCalories: 0, // 真实数据无此字段，不伪造
      averageRPE: Math.round(averageRPE * 10) / 10,
      ratingDistribution,
    };
  }
}
