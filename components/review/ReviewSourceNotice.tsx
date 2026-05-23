import { Database, AlertCircle, Info } from 'lucide-react';
import type { DataSource } from '@/lib/data';

interface ReviewSourceNoticeProps {
  source: DataSource;
  recordCount: number;
}

export function ReviewSourceNotice({ source, recordCount }: ReviewSourceNoticeProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
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

      <div className="flex items-center gap-1.5 rounded-md bg-blue-500/10 px-3 py-1.5">
        <span className="text-xs text-blue-400">训练记录：{recordCount} 条</span>
      </div>

      <div className="flex items-center gap-1.5 rounded-md bg-yellow-500/10 px-3 py-1.5">
        <Info className="h-3.5 w-3.5 text-yellow-400" />
        <span className="text-xs text-yellow-400">只读复盘 · 复盘写入与 AI 生成尚未启用</span>
      </div>
    </div>
  );
}
