import { WeeklySummary, TrainingRecord } from '@/types';
import { mockWeeklySummary } from './mock-source';
import { normalizeTrainingRecord } from './normalizers';
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

    // normalize 原始数据
    const normalized = result.data
      .map(normalizeTrainingRecord)
      .filter((r): r is TrainingRecord => r !== null);

    if (normalized.length === 0) {
      this.lastSource = 'mock-fallback';
      return mockWeeklySummary;
    }

    this.lastSource = result.source;
    return this.calculateFromRecords(normalized);
  }

  /**
   * 从训练记录计算周汇总
   * - 不伪造训练时长（真实数据无此字段）
   * - 不伪造热量消耗（真实数据无此字段）
   */
  static calculateFromRecords(records: TrainingRecord[]): WeeklySummary {
    const trainingDays = new Set(records.map((r) => r.date)).size;
    const validRPEs = records
      .map((r) => r.rpe)
      .filter((rpe) => typeof rpe === 'number' && Number.isFinite(rpe));
    const averageRPE =
      validRPEs.length > 0
        ? validRPEs.reduce((sum, rpe) => sum + rpe, 0) / validRPEs.length
        : 0;

    const ratingDistribution = records.reduce(
      (acc, r) => {
        if (r.rating === 'great' || r.rating === 'good' || r.rating === 'bad') {
          acc[r.rating]++;
        } else {
          acc.okay++;
        }
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
