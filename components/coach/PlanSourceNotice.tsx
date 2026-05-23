import { Database, AlertCircle, Info } from 'lucide-react';
import type { DataSource } from '@/lib/data';

interface PlanSourceNoticeProps {
  source: DataSource;
  pendingCount: number;
}

export function PlanSourceNotice({ source, pendingCount }: PlanSourceNoticeProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Source badge */}
      {source === 'local' ? (
        <div className="flex items-center gap-1.5 rounded-md bg-green-500/10 px-3 py-1.5">
          <Database className="h-3.5 w-3.5 text-green-400" />
          <span className="text-xs text-green-400">数据源：Local JSON</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 rounded-md bg-gray-500/10 px-3 py-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-xs text-gray-400">数据源：Mock fallback</span>
        </div>
      )}

      {/* Pending count */}
      <div className="flex items-center gap-1.5 rounded-md bg-blue-500/10 px-3 py-1.5">
        <span className="text-xs text-blue-400">
          待执行计划：{pendingCount} 个
        </span>
      </div>

      {/* Read-only notice */}
      <div className="flex items-center gap-1.5 rounded-md bg-yellow-500/10 px-3 py-1.5">
        <Info className="h-3.5 w-3.5 text-yellow-400" />
        <span className="text-xs text-yellow-400">只读模式 · AI 生成与写入尚未启用</span>
      </div>
    </div>
  );
}
