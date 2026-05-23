'use client';

import { Apple, Coffee, Sun, Moon, Cookie } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dietRecords } from '@/lib/mock-data';

const mealConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  breakfast: { label: '早餐', icon: Coffee, color: 'text-yellow-400' },
  lunch: { label: '午餐', icon: Sun, color: 'text-orange-400' },
  dinner: { label: '晚餐', icon: Moon, color: 'text-blue-400' },
  snack: { label: '加餐', icon: Cookie, color: 'text-purple-400' },
};

export default function DietPage() {
  // Group by date
  const groupedByDate = dietRecords.reduce(
    (acc, record) => {
      if (!acc[record.date]) {
        acc[record.date] = [];
      }
      acc[record.date].push(record);
      return acc;
    },
    {} as Record<string, typeof dietRecords>
  );

  const totalDailyCalories = dietRecords.reduce(
    (sum, record) => sum + record.totalCalories,
    0
  );

  const totalMacros = dietRecords.reduce(
    (acc, record) => ({
      protein: acc.protein + record.macros.protein,
      carbs: acc.carbs + record.macros.carbs,
      fat: acc.fat + record.macros.fat,
    }),
    { protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-100">饮食记录</h2>
        <p className="mt-1 text-sm text-gray-400">
          追踪每日营养摄入，确保训练效果最大化
        </p>
      </div>

      {/* Daily summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-gray-800 bg-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">总热量</p>
                <p className="text-2xl font-semibold text-orange-400">
                  {totalDailyCalories}
                </p>
                <p className="text-xs text-gray-500">kcal</p>
              </div>
              <div className="rounded-lg bg-orange-400/10 p-2">
                <Apple className="h-5 w-5 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900">
          <CardContent className="p-4">
            <p className="text-xs text-gray-400">蛋白质</p>
            <p className="text-2xl font-semibold text-blue-400">
              {totalMacros.protein}g
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900">
          <CardContent className="p-4">
            <p className="text-xs text-gray-400">碳水</p>
            <p className="text-2xl font-semibold text-green-400">
              {totalMacros.carbs}g
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900">
          <CardContent className="p-4">
            <p className="text-xs text-gray-400">脂肪</p>
            <p className="text-2xl font-semibold text-yellow-400">
              {totalMacros.fat}g
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Meals by date */}
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
