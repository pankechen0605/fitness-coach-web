import { WeeklySummary, TrainingRecord } from '@/types';
import { mockWeeklySummary } from './mock-source';
import { DATA_CONFIG } from './config';

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
  /**
   * 获取周汇总数据
   */
  static async getWeeklySummary(): Promise<WeeklySummary> {
    if (DATA_CONFIG.USE_MOCK || !isServer()) {
      return mockWeeklySummary;
    }

    // 服务端环境：从训练记录计算
    const { readTrainingLog } = await import('./local-json-source');
    const records = await readTrainingLog();

    // 如果真实数据为空，回退到 mock
    if (records.length === 0) {
      console.warn('[DashboardSummary] 真实数据为空，使用 mock 数据');
      return mockWeeklySummary;
    }

    return this.calculateFromRecords(records);
  }

  /**
   * 从训练记录计算周汇总
   */
  static calculateFromRecords(records: TrainingRecord[]): WeeklySummary {
    const trainingDays = new Set(records.map((r) => r.date)).size;
    const totalDuration = records.length * 60; // 假设每次 60 分钟
    const totalCalories = records.length * 500; // 假设每次 500 kcal
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
      totalDuration,
      totalCalories,
      averageRPE: Math.round(averageRPE * 10) / 10,
      ratingDistribution,
    };
  }
}
