import { TrainingPlan } from '@/types';
import { mockTrainingPlans } from './mock-source';
import { DATA_CONFIG } from './config';

/**
 * 检查是否在服务端环境
 */
function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * 训练计划仓库
 */
export class PlanRepository {
  /**
   * 获取所有训练计划
   */
  static async getAll(): Promise<TrainingPlan[]> {
    if (DATA_CONFIG.USE_MOCK || !isServer()) {
      return mockTrainingPlans;
    }

    // 服务端环境：从本地 JSON 文件读取
    const { readTrainingPlans } = await import('./local-json-source');
    const plans = await readTrainingPlans();

    // 如果真实数据为空，回退到 mock
    if (plans.length === 0) {
      console.warn('[PlanRepository] 真实数据为空，使用 mock 数据');
      return mockTrainingPlans;
    }

    return plans;
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
