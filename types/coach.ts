// AI 教练消息
export interface CoachMessage {
  role: 'user' | 'coach';
  content: string;
}

// 用户意图
export type UserIntent = 'plan' | 'review' | 'injury' | 'diet' | 'unknown';

// 教练回复
export interface CoachResponse {
  input: string;
  output: string;
}
