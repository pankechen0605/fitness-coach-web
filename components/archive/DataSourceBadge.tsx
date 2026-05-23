import { Database, AlertCircle } from 'lucide-react';
import { TrainingRepository, DietRepository, PlanRepository } from '@/lib/data';

/**
 * 数据源状态标识
 * 显示当前各数据源是从本地 JSON 还是 mock fallback 读取
 */
export async function DataSourceBadge() {
  // 触发数据加载以获取 source 状态
  await Promise.all([
    TrainingRepository.getAll(),
    DietRepository.getAll(),
    PlanRepository.getAll(),
  ]);

  const sources = [
    { name: '训练日志', source: TrainingRepository.lastSource },
    { name: '饮食日志', source: DietRepository.lastSource },
    { name: '训练计划', source: PlanRepository.lastSource },
  ];

  const allLocal = sources.every((s) => s.source === 'local');
  const anyLocal = sources.some((s) => s.source === 'local');

  return (
    <div className="flex items-center gap-2">
      {allLocal ? (
        <div className="flex items-center gap-1.5 rounded-md bg-green-500/10 px-3 py-1.5">
          <Database className="h-3.5 w-3.5 text-green-400" />
          <span className="text-xs text-green-400">当前数据源：Local JSON</span>
        </div>
      ) : anyLocal ? (
        <div className="flex items-center gap-1.5 rounded-md bg-yellow-500/10 px-3 py-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-yellow-400" />
          <span className="text-xs text-yellow-400">当前数据源：部分 Local / 部分 Mock</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 rounded-md bg-gray-500/10 px-3 py-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-xs text-gray-400">当前数据源：Mock fallback</span>
        </div>
      )}
    </div>
  );
}
