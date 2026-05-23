'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AICommandPanelProps {
  onSubmit: (command: string) => void;
}

export function AICommandPanel({ onSubmit }: AICommandPanelProps) {
  const [command, setCommand] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      onSubmit(command.trim());
      setCommand('');
    }
  };

  const quickCommands = [
    { label: '今天练什么', value: '今天练什么' },
    { label: '训练复盘', value: '训练复盘' },
    { label: '看看上次训练', value: '看看上次训练' },
    { label: '饮食建议', value: '饮食建议' },
  ];

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300">AI 教练指令</h3>
        <span className="text-xs text-gray-500">输入指令或点击快捷按钮</span>
      </div>

      {/* Quick commands */}
      <div className="mb-3 flex flex-wrap gap-2">
        {quickCommands.map((cmd) => (
          <button
            key={cmd.value}
            onClick={() => onSubmit(cmd.value)}
            className="rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
          >
            {cmd.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="输入指令，如：今天练什么、训练复盘、肩膀不舒服..."
          className="flex-1 border-gray-700 bg-gray-800 text-gray-100 placeholder:text-gray-500"
        />
        <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
