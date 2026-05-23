'use client';

import { useState } from 'react';
import { Dumbbell, Play, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockTrainingPlans } from '@/lib/data';

export default function CoachPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {mockTrainingPlans.map((plan) => (
            <Card
              key={plan.plan_id}
              className={`border-gray-800 bg-gray-900 transition-all ${
                selectedPlan === plan.plan_id
                  ? 'ring-2 ring-blue-500'
                  : 'hover:border-gray-700'
              }`}
              onClick={() => setSelectedPlan(plan.plan_id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-gray-100">
                    {plan.title}
                  </CardTitle>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {plan.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{plan.duration}分钟</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Dumbbell className="h-3 w-3" />
                    <span>{plan.main.length}个主训练</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {plan.main.slice(0, 3).map((exercise, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-300">{exercise.name}</span>
                      <span className="text-gray-500">
                        {exercise.sets}组x{exercise.reps}x{exercise.weight}
                      </span>
                    </div>
                  ))}
                  {plan.main.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{plan.main.length - 3}个动作
                    </p>
                  )}
                </div>

                {plan.posture && (
                  <div className="mt-3 rounded-md bg-yellow-500/10 p-2">
                    <p className="text-xs text-yellow-400">💡 {plan.posture}</p>
                  </div>
                )}

                <Button
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  <Play className="mr-2 h-4 w-4" />
                  开始训练
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
