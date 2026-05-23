'use client';

import { Coffee, Sun, Moon, Cookie } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DietRecord } from '@/types';

const mealConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  breakfast: { label: '早餐', icon: Coffee, color: 'text-yellow-400' },
  lunch: { label: '午餐', icon: Sun, color: 'text-orange-400' },
  dinner: { label: '晚餐', icon: Moon, color: 'text-blue-400' },
  snack: { label: '加餐', icon: Cookie, color: 'text-purple-400' },
};

interface DietRecordListProps {
  records: DietRecord[];
}

export function DietRecordList({ records }: DietRecordListProps) {
  // Group by date
  const groupedByDate = records.reduce(
    (acc, record) => {
      if (!acc[record.date]) {
        acc[record.date] = [];
      }
      acc[record.date].push(record);
      return acc;
    },
    {} as Record<string, DietRecord[]>
  );

  return (
    <div className="space-y-6">
      {Object.entries(groupedByDate).map(([date, meals]) => (
        <div key={date}>
          <h3 className="mb-4 text-lg font-medium text-gray-200">{date}</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {meals.map((meal) => {
              const config = mealConfig[meal.meal];
              const Icon = config.icon;

              return (
                <Card key={meal.id} className="border-gray-800 bg-gray-900">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${config.color}`} />
                        <CardTitle className="text-base text-gray-100">
                          {config.label}
                        </CardTitle>
                      </div>
                      <span className="text-sm font-medium text-gray-300">
                        {meal.totalCalories} kcal
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {meal.foods.map((food, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-300">{food.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500">{food.amount}</span>
                            <span className="text-gray-400">
                              {food.calories} kcal
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Macros */}
                    <div className="mt-3 flex gap-2 border-t border-gray-800 pt-3">
                      <span className="rounded bg-blue-500/10 px-2 py-1 text-xs text-blue-400">
                        蛋白质 {meal.macros.protein}g
                      </span>
                      <span className="rounded bg-green-500/10 px-2 py-1 text-xs text-green-400">
                        碳水 {meal.macros.carbs}g
                      </span>
                      <span className="rounded bg-yellow-500/10 px-2 py-1 text-xs text-yellow-400">
                        脂肪 {meal.macros.fat}g
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
