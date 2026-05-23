import { Card, CardContent } from '@/components/ui/card';
import { TrainingPlanList } from '@/components/coach/TrainingPlanList';
import { PlanSourceNotice } from '@/components/coach/PlanSourceNotice';
import { AICoachPanel } from '@/components/coach/AICoachPanel';
import { PlanRepository } from '@/lib/data';

export default async function CoachPage() {
  const trainingPlans = await PlanRepository.getPending();
  const source = PlanRepository.lastSource;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-100">训练计划</h2>
        <p className="mt-1 text-sm text-gray-400">
          只读查看本地训练计划 · AI 生成预览 · 当前展示 training_plans/*.json 中的待执行计划
        </p>
      </div>

      {/* Source notice */}
      <PlanSourceNotice source={source} pendingCount={trainingPlans.length} />

      {/* AI Coach Panel */}
      <AICoachPanel />

      {/* Existing training plans */}
      <div>
        <h3 className="mb-4 text-lg font-medium text-gray-200">待执行计划</h3>
        {trainingPlans.length === 0 ? (
          <Card className="border-gray-800 bg-gray-900">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-gray-400">暂无待执行计划</p>
            </CardContent>
          </Card>
        ) : (
          <TrainingPlanList plans={trainingPlans} />
        )}
      </div>
    </div>
  );
}
