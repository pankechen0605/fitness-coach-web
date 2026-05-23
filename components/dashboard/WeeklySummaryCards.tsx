'use client';

import { Flame, Clock, Dumbbell, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { WeeklySummary, RATING_CONFIG } from '@/types';

interface WeeklySummaryCardsProps {
  summary: WeeklySummary;
}

export function WeeklySummaryCards({ summary }: WeeklySummaryCardsProps) {
  const cards = [
    {
      title: '训练天数',
      value: summary.trainingDays,
      unit: '天',
      icon: Dumbbell,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      unavailable: false,
    },
    {
      title: '总时长',
      value: summary.totalDuration,
      unit: '分钟',
      icon: Clock,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      unavailable: summary.totalDuration === 0,
    },
    {
      title: '消耗热量',
      value: summary.totalCalories,
      unit: 'kcal',
      icon: Flame,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      unavailable: summary.totalCalories === 0,
    },
    {
      title: '平均 RPE',
      value: summary.averageRPE,
      unit: '',
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      unavailable: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-gray-800 bg-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">{card.title}</p>
                <div className="mt-1 flex items-baseline gap-1">
                  {card.unavailable ? (
                    <span className="text-base font-medium text-gray-500">
                      暂无数据
                    </span>
                  ) : (
                    <>
                      <span className="text-2xl font-semibold text-gray-100">
                        {card.value}
                      </span>
                      {card.unit && (
                        <span className="text-sm text-gray-500">{card.unit}</span>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className={`rounded-lg p-2 ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Rating Distribution */}
      <Card className="border-gray-800 bg-gray-900 sm:col-span-2 lg:col-span-4">
        <CardContent className="p-4">
          <p className="mb-3 text-xs text-gray-400">本周评分分布</p>
          <div className="flex gap-3">
            {Object.entries(summary.ratingDistribution).map(([rating, count]) => (
              <div
                key={rating}
                className={`flex items-center gap-2 rounded-md px-3 py-2 ${
                  RATING_CONFIG[rating as keyof typeof RATING_CONFIG].bgColor
                }`}
              >
                <span
                  className={`text-lg font-bold ${
                    RATING_CONFIG[rating as keyof typeof RATING_CONFIG].color
                  }`}
                >
                  {RATING_CONFIG[rating as keyof typeof RATING_CONFIG].label}
                </span>
                <span className="text-sm text-gray-300">{count}次</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
