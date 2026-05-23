'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, BarChart3, Apple, Archive, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'CoachOS', icon: Activity },
  { href: '/coach', label: '今日教练台', icon: Dumbbell },
  { href: '/review', label: '训练复盘', icon: BarChart3 },
  { href: '/diet', label: '饮食记录', icon: Apple },
  { href: '/archive', label: '历史档案', icon: Archive },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-800 bg-gray-950">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-800 px-6">
          <Activity className="mr-2 h-6 w-6 text-blue-500" />
          <span className="text-lg font-semibold text-gray-100">Fitness Coach</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-800 p-4">
          <div className="text-xs text-gray-500">
            <p>数据驱动的训练管理</p>
            <p className="mt-1">本地优先 · 无需登录</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
