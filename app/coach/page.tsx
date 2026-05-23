import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrainingPlanList } from '@/components/coach/TrainingPlanList';
import { PlanSourceNotice } from '@/components/coach/PlanSourceNotice';
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
          只读查看本地训练计划 · 当前展示 training_plans/*.json 中的待执行计划
        </p>
      </div>

      {/* Source notice */}
      <PlanSourceNotice source={source} pendingCount={trainingPlans.length} />

      {/* Status input */}
      <Card className="border-gray-800 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-sm text-gray-300">今日状态</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['状态好', '状态一般', '有点疲劳', '喝了肌酸', '睡眠不足'].map((status) => (
              <button
                key={status}
                className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
              >
                {status}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training plans */}
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
