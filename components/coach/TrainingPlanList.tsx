'use client';

import { useState } from 'react';
import { Dumbbell, Play, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrainingPlan } from '@/types';

interface TrainingPlanListProps {
  plans: TrainingPlan[];
}

export function TrainingPlanList({ plans }: TrainingPlanListProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {plans.map((plan) => (
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
                <span>{typeof plan.duration === 'number' ? `${plan.duration}分钟` : plan.duration || '—'}</span>
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
  );
}
