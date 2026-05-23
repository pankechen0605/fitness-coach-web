'use client';

import { usePathname } from 'next/navigation';
import { Calendar, Clock } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/': 'CoachOS 仪表盘',
  '/coach': '今日教练台',
  '/review': '训练复盘',
  '/diet': '饮食记录',
  '/archive': '历史档案',
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'CoachOS';

  const now = new Date();
  const dateStr = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  const timeStr = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-950/80 px-6 backdrop-blur-sm">
      <h1 className="text-xl font-semibold text-gray-100">{title}</h1>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span>{dateStr}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>{timeStr}</span>
        </div>
      </div>
    </header>
  );
}
