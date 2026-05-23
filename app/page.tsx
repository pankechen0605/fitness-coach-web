'use client';

import { useState } from 'react';
import { AICommandPanel } from '@/components/coach/AICommandPanel';
import { CoachOutputPanel } from '@/components/coach/CoachOutputPanel';
import { WeeklySummaryCards } from '@/components/dashboard/WeeklySummaryCards';
import { RecentTrainingList } from '@/components/dashboard/RecentTrainingList';
import { mockWeeklySummary, mockTrainingRecords, mockCoachResponses } from '@/lib/data';

interface Message {
  role: 'user' | 'coach';
  content: string;
}

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleCommand = (command: string) => {
    // Add user message
    const userMessage: Message = { role: 'user', content: command };
    setMessages((prev) => [...prev, userMessage]);

    // Find matching response
    const response = mockCoachResponses.find((r) =>
      command.includes(r.input) || r.input.includes(command)
    );

    // Add coach response after a short delay
    setTimeout(() => {
      const coachMessage: Message = {
        role: 'coach',
        content: response?.output || `收到指令：${command}\n\n正在分析您的训练数据...\n\n（此功能将在后续版本中完整实现）`,
      };
      setMessages((prev) => [...prev, coachMessage]);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-100">欢迎回来</h2>
        <p className="mt-1 text-sm text-gray-400">
          数据驱动的训练管理 · 本地优先 · 无需登录
        </p>
      </div>

      {/* Weekly Summary */}
      <WeeklySummaryCards summary={mockWeeklySummary} />

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left column: AI Command + Output */}
        <div className="space-y-4">
          <AICommandPanel onSubmit={handleCommand} />
          <CoachOutputPanel messages={messages} />
        </div>

        {/* Right column: Recent Training */}
        <RecentTrainingList records={mockTrainingRecords} />
      </div>
    </div>
  );
}
