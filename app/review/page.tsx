import { BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ReviewRecordList } from '@/components/review/ReviewRecordList';
import { TrainingRepository } from '@/lib/data';
import { RATING_CONFIG, Rating } from '@/types';

const RATING_RANK: Record<Rating, number> = {
  great: 4,
  good: 3,
  okay: 2,
  bad: 1,
};

export default async function ReviewPage() {
  const trainingRecords = await TrainingRepository.getAll();

  // 计算平均 RPE
  const validRPEs = trainingRecords
    .map((r) => r.rpe)
    .filter((rpe) => typeof rpe === 'number' && Number.isFinite(rpe));
  const averageRPE =
    validRPEs.length > 0
      ? Math.round(
          (validRPEs.reduce((sum, rpe) => sum + rpe, 0) / validRPEs.length) * 10
        ) / 10
      : 0;

  // 计算完成率
  const allResults = trainingRecords.flatMap((r) => r.results ?? []);
  const completedCount = allResults.filter((r) => r.completed).length;
  const completionRate =
    allResults.length > 0
      ? Math.round((completedCount / allResults.length) * 100)
      : 0;

  // 计算最佳评分
  const bestRating = trainingRecords.reduce<Rating | null>((best, r) => {
    if (!best) return r.rating;
    return (RATING_RANK[r.rating] ?? 0) > (RATING_RANK[best] ?? 0) ? r.rating : best;
  }, null);
  const bestLabel = bestRating ? RATING_CONFIG[bestRating].label : '-';
  const bestColor = bestRating ? RATING_CONFIG[bestRating].color : 'text-gray-400';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-100">训练复盘</h2>
        <p className="mt-1 text-sm text-gray-400">
          分析历史训练数据，识别模式，持续优化
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-gray-800 bg-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">平均 RPE</p>
                <p className="text-2xl font-semibold text-gray-100">{averageRPE}</p>
              </div>
              <div className="rounded-lg bg-purple-400/10 p-2">
                <BarChart3 className="h-5 w-5 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">完成率</p>
                <p className="text-2xl font-semibold text-gray-100">{completionRate}%</p>
              </div>
              <div className="rounded-lg bg-green-400/10 p-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">最佳评分</p>
                <p className={`text-2xl font-semibold ${bestColor}`}>{bestLabel}</p>
              </div>
              <div className="rounded-lg bg-green-400/10 p-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training records */}
      <div>
        <h3 className="mb-4 text-lg font-medium text-gray-200">训练记录</h3>
        <ReviewRecordList records={trainingRecords} />
      </div>
    </div>
  );
}
