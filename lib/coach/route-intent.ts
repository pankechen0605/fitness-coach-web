import { UserIntent } from '@/types';

/**
 * 意图路由
 * 识别用户输入的意图，路由到对应功能
 */

// 意图关键词映射
const INTENT_KEYWORDS: Record<UserIntent, string[]> = {
  plan: ['今天练什么', '帮我做个计划', '训练计划', '练什么'],
  review: ['练完了', '训练复盘', '看看上次', '复盘', '上次训练'],
  injury: ['肩膀不舒服', '膝盖疼', '腰疼', '受伤', '不舒服', '疼痛'],
  diet: ['吃什么', '饮食建议', '饮食', '营养'],
  unknown: [],
};

/**
 * 识别用户意图
 */
export function detectIntent(input: string): UserIntent {
  const normalizedInput = input.toLowerCase().trim();

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (keywords.some((keyword) => normalizedInput.includes(keyword))) {
      return intent as UserIntent;
    }
  }

  return 'unknown';
}

/**
 * 获取意图描述
 */
export function getIntentDescription(intent: UserIntent): string {
  const descriptions: Record<UserIntent, string> = {
    plan: '生成训练计划',
    review: '训练复盘分析',
    injury: '伤病调整建议',
    diet: '饮食营养建议',
    unknown: '未识别的意图',
  };

  return descriptions[intent];
}
