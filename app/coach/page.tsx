import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrainingPlanList } from '@/components/coach/TrainingPlanList';
import { PlanRepository } from '@/lib/data';

export default async function CoachPage() {
  const trainingPlans = await PlanRepository.getPending();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-100">今日教练台</h2>
        <p className="mt-1 text-sm text-gray-400">
          根据您的状态和历史数据，为您推荐今日训练计划
        </p>
      </div>

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
        <TrainingPlanList plans={trainingPlans} />
      </div>
    </div>
  );
}
