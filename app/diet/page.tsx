import { Apple } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DietRecordList } from '@/components/diet/DietRecordList';
import { DietSourceNotice } from '@/components/diet/DietSourceNotice';
import { PhotoDietPanel } from '@/components/diet/PhotoDietPanel';
import { DietRepository } from '@/lib/data';

export default async function DietPage() {
  const dietRecords = await DietRepository.getAll();
  const source = DietRepository.lastSource;

  const totalDailyCalories = dietRecords.reduce(
    (sum, record) => sum + (record.totalCalories ?? 0),
    0
  );

  const totalMacros = dietRecords.reduce(
    (acc, record) => ({
      protein: acc.protein + (record.macros?.protein ?? 0),
      carbs: acc.carbs + (record.macros?.carbs ?? 0),
      fat: acc.fat + (record.macros?.fat ?? 0),
    }),
    { protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-100">饮食记录</h2>
        <p className="mt-1 text-sm text-gray-400">
          只读查看饮食日志 · 当前展示 diet_log.json 中的历史饮食记录
        </p>
      </div>

      {/* Source notice */}
      <DietSourceNotice source={source} recordCount={dietRecords.length} />

      {/* Photo diet panel */}
      <PhotoDietPanel />

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
      {dietRecords.length === 0 ? (
        <Card className="border-gray-800 bg-gray-900">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-gray-400">暂无饮食记录</p>
          </CardContent>
        </Card>
      ) : (
        <DietRecordList records={dietRecords} />
      )}
    </div>
  );
}
