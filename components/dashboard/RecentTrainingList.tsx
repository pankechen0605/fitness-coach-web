'use client';

import { Calendar, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrainingRecord, RATING_CONFIG } from '@/types';

interface RecentTrainingListProps {
  records: TrainingRecord[];
}

export function RecentTrainingList({ records }: RecentTrainingListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300">最近训练记录</h3>
        <button className="flex items-center text-xs text-blue-400 hover:text-blue-300">
          查看全部
          <ChevronRight className="ml-1 h-3 w-3" />
        </button>
      </div>

      {records.map((record) => {
        const ratingConfig = RATING_CONFIG[record.rating];
        return (
          <Card
            key={record.plan_id}
            className="border-gray-800 bg-gray-900 transition-colors hover:border-gray-700"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-100">
                      {record.part}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${ratingConfig.color} border-current`}
                    >
                      {ratingConfig.label}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      RPE {record.rpe}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(record.date)}</span>
                    <span>·</span>
                    <span>{record.status_before}</span>
                  </div>

                  <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                    {record.notes}
                  </p>
                </div>

                <div className="ml-4 flex flex-col items-end gap-1">
                  <div
                    className={`rounded-md px-2 py-1 text-xs font-medium ${ratingConfig.bgColor} ${ratingConfig.color}`}
                  >
                    {record.rating === 'great' && '完美'}
                    {record.rating === 'good' && '良好'}
                    {record.rating === 'okay' && '一般'}
                    {record.rating === 'bad' && '较差'}
                  </div>
                  <span className="text-xs text-gray-500">
                    {record.results.filter((r) => r.completed).length}/
                    {record.results.length} 完成
                  </span>
                </div>
              </div>

              {/* Completed exercises summary */}
              <div className="mt-3 flex flex-wrap gap-1">
                {record.results.slice(0, 3).map((result, idx) => (
                  <span
                    key={idx}
                    className={`rounded px-1.5 py-0.5 text-xs ${
                      result.completed
                        ? 'bg-gray-800 text-gray-300'
                        : 'bg-red-500/10 text-red-400 line-through'
                    }`}
                  >
                    {result.name}
                  </span>
                ))}
                {record.results.length > 3 && (
                  <span className="rounded px-1.5 py-0.5 text-xs text-gray-500">
                    +{record.results.length - 3}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
