import { BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ReviewRecordList } from '@/components/review/ReviewRecordList';
import { TrainingRepository } from '@/lib/data';

export default async function ReviewPage() {
  const trainingRecords = await TrainingRepository.getAll();

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
                <p className="text-2xl font-semibold text-gray-100">7.5</p>
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
                <p className="text-2xl font-semibold text-gray-100">85%</p>
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
                <p className="text-2xl font-semibold text-green-400">A</p>
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
