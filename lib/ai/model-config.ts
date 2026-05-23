/**
 * AI model configuration.
 * Supports both OpenAI-compatible and Anthropic-compatible endpoints.
 * API key is read from environment variables — never hardcoded.
 */

export interface ModelConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  maxTokens: number;
  format: 'openai' | 'anthropic';
}

const DEFAULT_MODEL = 'deepseek-chat';
const DEFAULT_BASE_URL = 'https://api.deepseek.com/v1';
const DEFAULT_MAX_TOKENS = 4096;

/**
 * Read model config from environment variables.
 * Returns null if API key is not configured.
 *
 * Supported env vars (in priority order):
 *   AI_API_KEY / OPENAI_API_KEY / ANTHROPIC_AUTH_TOKEN
 *   AI_BASE_URL / ANTHROPIC_BASE_URL
 *   AI_MODEL / ANTHROPIC_MODEL
 *   AI_MAX_TOKENS
 */
export function getModelConfig(): ModelConfig | null {
  const apiKey =
    process.env.AI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.ANTHROPIC_AUTH_TOKEN ||
    '';
  if (!apiKey) return null;

  const baseUrl =
    process.env.AI_BASE_URL ||
    process.env.ANTHROPIC_BASE_URL ||
    DEFAULT_BASE_URL;

  const model =
    process.env.AI_MODEL ||
    process.env.ANTHROPIC_MODEL ||
    DEFAULT_MODEL;

  const maxTokens = Number(process.env.AI_MAX_TOKENS) || DEFAULT_MAX_TOKENS;

  // Detect format from base URL
  const format: 'openai' | 'anthropic' = baseUrl.includes('/anthropic')
    ? 'anthropic'
    : 'openai';

  return { baseUrl, apiKey, model, maxTokens, format };
}
