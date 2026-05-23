/**
 * AI model configuration.
 * Uses OpenAI-compatible API format so the provider can be swapped later.
 * API key is read from environment variables — never hardcoded.
 */

export interface ModelConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  maxTokens: number;
}

const DEFAULT_MODEL = 'deepseek-chat';
const DEFAULT_BASE_URL = 'https://api.deepseek.com/v1';
const DEFAULT_MAX_TOKENS = 4096;

/**
 * Read model config from environment variables.
 * Returns null if API key is not configured.
 */
export function getModelConfig(): ModelConfig | null {
  const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY || '';
  if (!apiKey) return null;

  return {
    baseUrl: process.env.AI_BASE_URL || DEFAULT_BASE_URL,
    apiKey,
    model: process.env.AI_MODEL || DEFAULT_MODEL,
    maxTokens: Number(process.env.AI_MAX_TOKENS) || DEFAULT_MAX_TOKENS,
  };
}
