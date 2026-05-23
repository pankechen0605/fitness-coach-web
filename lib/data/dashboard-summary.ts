import { WeeklySummary } from '@/types';
import { mockWeeklySummary, mockTrainingRecords } from './mock-source';

/**
 * 仪表盘汇总数据
 * PR1.1: 返回 mock 数据
 * PR1.2: 从训练记录计算
 */
export class DashboardSummary {
  /**
   * 获取周汇总数据
   */
  static async getWeeklySummary(): Promise<WeeklySummary> {
    // PR1.2: 从训练记录计算
    // const records = await TrainingRepository.getAll();
    // const weekRecords = filterThisWeek(records);
    // return calculateWeeklySummary(weekRecords);

    return mockWeeklySummary;
  }

  /**
   * 计算周汇总（PR1.2 使用）
   */
  static calculateFromRecords(records: typeof mockTrainingRecords): WeeklySummary {
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
