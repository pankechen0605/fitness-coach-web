'use client';

import { Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'coach';
  content: string;
}

interface CoachOutputPanelProps {
  messages: Message[];
}

export function CoachOutputPanel({ messages }: CoachOutputPanelProps) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-gray-800 bg-gray-900 p-8">
        <div className="text-center">
          <Bot className="mx-auto mb-3 h-12 w-12 text-gray-600" />
          <p className="text-sm text-gray-500">
            输入指令开始与 AI 教练对话
          </p>
          <p className="mt-1 text-xs text-gray-600">
            支持：今天练什么、训练复盘、伤病调整、饮食建议
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Bot className="h-5 w-5 text-blue-400" />
        <h3 className="text-sm font-medium text-gray-300">AI 教练回复</h3>
      </div>

      <div className="max-h-[400px] space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
          >
            {msg.role === 'coach' && (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                <Bot className="h-4 w-4 text-blue-400" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-200'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
            </div>

            {msg.role === 'user' && (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-700">
                <User className="h-4 w-4 text-gray-300" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
