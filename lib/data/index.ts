// 统一导出数据层
export { TrainingRepository } from './training-repository';
export { DietRepository } from './diet-repository';
export { PlanRepository } from './plan-repository';
export { DashboardSummary } from './dashboard-summary';
export { DATA_CONFIG } from './config';
export type { DataSource } from './local-json-source';

// 数据质量检测
export {
  inspectTrainingRecords,
  inspectDietRecords,
  buildDataQualityReport,
  detectSuspiciousText,
} from './data-quality';
export type { DataQualityIssue, DataQualityReport, FullDataQualityReport } from './data-quality';

// 导出 mock 数据（用于测试和开发）
export {
  mockTrainingRecords,
  mockTrainingPlans,
  mockDietRecords,
  mockWeeklySummary,
  mockCoachResponses,
} from './mock-source';
