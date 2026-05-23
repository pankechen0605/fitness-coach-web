import { ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrainingPlan } from '@/types';

interface ArchivePlanPreviewProps {
  plans: TrainingPlan[];
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

export function ArchivePlanPreview({ plans }: ArchivePlanPreviewProps) {
  const recentPlans = sortByDateDesc(plans).slice(0, 5);
  const pendingCount = plans.filter((p) => p.status === '待执行').length;

  return (
    <Card className="border-gray-800 bg-gray-900">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-base text-gray-100">
              训练计划预览
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-gray-400 border-gray-600 text-xs">
              总计 {plans.length} 个
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">
              待执行 {pendingCount} 个
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {recentPlans.length === 0 ? (
          <p className="text-sm text-gray-400">暂无训练计划</p>
        ) : (
          <div className="space-y-3">
            {recentPlans.map((plan, idx) => {
              const mainCount = Array.isArray(plan.main) ? plan.main.length : 0;
              return (
                <div
                  key={plan.plan_id || idx}
                  className="flex items-center justify-between rounded-md border border-gray-800 bg-gray-800/50 px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {plan.date || '未知日期'}
                    </span>
                    <span className="text-sm text-gray-200">
                      {plan.title || '未命名计划'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{plan.status || '未知状态'}</span>
                    <span>
                      {typeof plan.duration === 'number' &&
                      Number.isFinite(plan.duration)
                        ? `${plan.duration}分钟`
                        : '-'}
                    </span>
                    <span>{mainCount} 个主训练</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
