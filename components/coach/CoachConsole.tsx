'use client';

import { useState } from 'react';
import { CoachResponse, CoachMessage } from '@/types';
import { AICommandPanel } from './AICommandPanel';
import { CoachOutputPanel } from './CoachOutputPanel';

interface CoachConsoleProps {
  responses: CoachResponse[];
}

export function CoachConsole({ responses }: CoachConsoleProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([]);

  const handleCommand = (command: string) => {
    const userMessage: CoachMessage = { role: 'user', content: command };
    setMessages((prev) => [...prev, userMessage]);

    const response = responses.find((r) =>
      command.includes(r.input) || r.input.includes(command)
    );

    setTimeout(() => {
      const coachMessage: CoachMessage = {
        role: 'coach',
        content:
          response?.output ||
          `收到指令：${command}\n\n正在分析您的训练数据...\n\n（此功能将在后续版本中完整实现）`,
      };
      setMessages((prev) => [...prev, coachMessage]);
    }, 500);
  };

  return (
    <div className="space-y-4">
      <AICommandPanel onSubmit={handleCommand} />
      <CoachOutputPanel messages={messages} />
    </div>
  );
}
