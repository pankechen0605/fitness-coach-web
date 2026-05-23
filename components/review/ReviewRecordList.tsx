'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrainingRecord, RATING_CONFIG } from '@/types';

interface ReviewRecordListProps {
  records: TrainingRecord[];
}

export function ReviewRecordList({ records }: ReviewRecordListProps) {
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'great':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'good':
        return <TrendingUp className="h-4 w-4 text-blue-400" />;
      case 'okay':
        return <Minus className="h-4 w-4 text-yellow-400" />;
      case 'bad':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {records.map((record) => {
        const ratingConfig = RATING_CONFIG[record.rating];
        const isSelected = selectedRecord === record.plan_id;

        return (
          <Card
            key={record.plan_id}
            className={`border-gray-800 bg-gray-900 transition-all cursor-pointer ${
              isSelected ? 'ring-2 ring-blue-500' : 'hover:border-gray-700'
            }`}
            onClick={() => setSelectedRecord(isSelected ? null : record.plan_id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-medium text-gray-100">
                      {record.part}
                    </span>
                    <Badge
                      variant="outline"
                      className={`${ratingConfig.color} border-current`}
                    >
                      {ratingConfig.label}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {getRatingIcon(record.rating)}
                      <span className="text-sm text-gray-400">
                        RPE {record.rpe}
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-gray-400">{record.notes}</p>

                  {/* Adjustments */}
                  {record.adjustments.length > 0 && (
                    <div className="mt-2">
                      {record.adjustments.map((adj, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span className="rounded bg-yellow-500/10 px-1.5 py-0.5 text-yellow-400">
                            调整
                          </span>
                          <span className="text-gray-400">{adj.reason}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-xs text-gray-500">{record.date}</span>
              </div>

              {/* Expanded details */}
              {isSelected && (
                <div className="mt-4 border-t border-gray-800 pt-4">
                  <h4 className="mb-3 text-sm font-medium text-gray-300">
                    动作完成情况
                  </h4>
                  <div className="space-y-2">
                    {record.results.map((result, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-md bg-gray-800 p-2"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              result.completed
                                ? 'bg-green-400'
                                : 'bg-red-400'
                            }`}
                          />
                          <span className="text-sm text-gray-200">
                            {result.name}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {result.completed ? result.actual : result.note}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
