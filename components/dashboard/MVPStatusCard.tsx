import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  { label: '本地只读', status: 'green' },
  { label: 'JSON 数据源', status: 'blue' },
  { label: '无登录', status: 'gray' },
  { label: 'AI 未启用', status: 'yellow' },
] as const;

const pages = [
  'Dashboard 数据总览',
  'Coach 只读训练计划',
  'Review 只读复盘',
  'Diet 只读饮食日志',
  'Archive 只读档案',
] as const;

const statusColors: Record<string, string> = {
  green: 'text-green-400',
  blue: 'text-blue-400',
  gray: 'text-gray-400',
  yellow: 'text-yellow-400',
};

export function MVPStatusCard() {
  return (
    <Card className="border-gray-800 bg-gray-900">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-gray-100">
          v0.1 Read-only MVP
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode badges */}
        <div className="flex flex-wrap gap-2">
          {features.map((f) => (
            <span
              key={f.label}
              className={`rounded bg-gray-800 px-2 py-1 text-xs ${statusColors[f.status]}`}
            >
              {f.label}
            </span>
          ))}
        </div>

        {/* Covered pages */}
        <div className="space-y-1.5">
          <p className="text-xs text-gray-400">已覆盖页面</p>
          {pages.map((page) => (
            <div key={page} className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
              <span>{page}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 border-t border-gray-800 pt-3">
          数据来自本地 JSON，不会写回源文件
        </p>
      </CardContent>
    </Card>
  );
}
