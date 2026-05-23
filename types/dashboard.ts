// 周汇总
export interface WeeklySummary {
  trainingDays: number;
  totalDuration: number;
  totalCalories: number;
  averageRPE: number;
  ratingDistribution: {
    great: number;
    good: number;
    okay: number;
    bad: number;
  };
}
