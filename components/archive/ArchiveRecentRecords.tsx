import { Dumbbell, Utensils } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrainingRecord, DietRecord, RATING_CONFIG } from '@/types';

interface ArchiveRecentRecordsProps {
  trainingRecords: TrainingRecord[];
  dietRecords: DietRecord[];
}

function sortByDateDesc<T extends { date: string }>(records: T[]): T[] {
  return [...records].sort((a, b) => {
    const da = Date.parse(a.date);
    const db = Date.parse(b.date);
    if (Number.isNaN(da) && Number.isNaN(db)) return 0;
    if (Number.isNaN(da)) return 1;
    if (Number.isNaN(db)) return -1;
    return db - da;
  });
}

export function ArchiveRecentRecords({
  trainingRecords,
  dietRecords,
}: ArchiveRecentRecordsProps) {
  const recentTraining = sortByDateDesc(trainingRecords).slice(0, 5);
  const recentDiet = sortByDateDesc(dietRecords).slice(0, 5);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Training records */}
      <Card className="border-gray-800 bg-gray-900">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-base text-gray-100">
              最近训练记录
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {recentTraining.length === 0 ? (
            <p className="text-sm text-gray-400">暂无训练记录</p>
          ) : (
            <div className="space-y-3">
              {recentTraining.map((record, idx) => {
                const ratingCfg =
                  record.rating in RATING_CONFIG
                    ? RATING_CONFIG[record.rating]
                    : null;
                const completedCount = Array.isArray(record.results)
                  ? record.results.filter((r) => r.completed).length
                  : 0;
                return (
                  <div
                    key={record.plan_id || idx}
                    className="flex items-center justify-between rounded-md border border-gray-800 bg-gray-800/50 px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">
                        {record.date || '未知日期'}
                      </span>
                      <span className="text-sm text-gray-200">
                        {record.part || '未知部位'}
                      </span>
                      {ratingCfg && (
                        <Badge
                          variant="outline"
                          className={`${ratingCfg.color} border-current text-xs`}
                        >
                          {ratingCfg.label}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>
                        RPE{' '}
                        {typeof record.rpe === 'number' &&
                        Number.isFinite(record.rpe)
                          ? record.rpe
                          : '-'}
                      </span>
                      <span>{completedCount} 完成</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diet records */}
      <Card className="border-gray-800 bg-gray-900">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-orange-400" />
            <CardTitle className="text-base text-gray-100">
              最近饮食记录
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {recentDiet.length === 0 ? (
            <p className="text-sm text-gray-400">暂无饮食记录</p>
          ) : (
            <div className="space-y-3">
              {recentDiet.map((record, idx) => (
                <div
                  key={record.id || idx}
                  className="flex items-center justify-between rounded-md border border-gray-800 bg-gray-800/50 px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {record.date || '未知日期'}
                    </span>
                    <span className="text-sm text-gray-200">
                      {record.meal || '未知餐次'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{record.totalCalories ?? 0} kcal</span>
                    <span>P{record.macros?.protein ?? 0}</span>
                    <span>C{record.macros?.carbs ?? 0}</span>
                    <span>F{record.macros?.fat ?? 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
