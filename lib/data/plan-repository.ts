import { TrainingPlan } from '@/types';
import { mockTrainingPlans } from './mock-source';
import { normalizeTrainingPlan } from './normalizers';
import { DATA_CONFIG } from './config';
import type { DataSource } from './local-json-source';

function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * 训练计划仓库
 */
export class PlanRepository {
  static lastSource: DataSource = 'mock-fallback';

  /**
   * 获取所有训练计划
   */
  static async getAll(): Promise<TrainingPlan[]> {
    if (DATA_CONFIG.USE_MOCK || !isServer()) {
      this.lastSource = 'mock-fallback';
      return mockTrainingPlans;
    }

    const { readTrainingPlans } = await import('./local-json-source');
    const result = await readTrainingPlans();

    // normalize 原始数据，过滤 null
    const normalized = result.data
      .map(normalizeTrainingPlan)
      .filter((p): p is TrainingPlan => p !== null);

    if (normalized.length === 0) {
      this.lastSource = 'mock-fallback';
      return mockTrainingPlans;
    }

    this.lastSource = result.source;
    return normalized;
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
