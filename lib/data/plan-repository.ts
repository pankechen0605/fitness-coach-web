import { TrainingPlan } from '@/types';
import { mockTrainingPlans } from './mock-source';
import { DATA_CONFIG } from './config';

/**
 * 训练计划仓库
 * PR1.1: 返回 mock 数据
 * PR1.2: 从本地 JSON 文件读取
 */
export class PlanRepository {
  /**
   * 获取所有训练计划
   */
  static async getAll(): Promise<TrainingPlan[]> {
    if (DATA_CONFIG.USE_MOCK) {
      return mockTrainingPlans;
    }

    // PR1.2: 从本地 JSON 文件读取
    return mockTrainingPlans;
  }

  /**
   * 获取待执行的训练计划
   */
  static async getPending(): Promise<TrainingPlan[]> {
    const plans = await this.getAll();
    return plans.filter((p) => p.status === '待执行');
  }

  /**
   * 按日期筛选训练计划
   */
  static async getByDate(date: string): Promise<TrainingPlan[]> {
    const plans = await this.getAll();
    return plans.filter((p) => p.date === date);
  }

  /**
   * 按计划 ID 获取训练计划
   */
  static async getById(planId: string): Promise<TrainingPlan | null> {
    const plans = await this.getAll();
    return plans.find((p) => p.plan_id === planId) || null;
  }
}
