import { getModelConfig, type ModelConfig } from './model-config';
import { buildSystemPrompt, buildUserPrompt } from './prompt-builder';
import type { TrainingRecord, TrainingPlan, DietRecord } from '@/types';

export interface GeneratePlanInput {
  userMessage: string;
  recentRecords: TrainingRecord[];
  recentPlans: TrainingPlan[];
  recentDiet: DietRecord[];
}

export interface GeneratePlanResult {
  ok: true;
  plan: Record<string, unknown>;
  rawText: string;
}

export interface GeneratePlanError {
  ok: false;
  error: string;
  rawText?: string;
}

export type GeneratePlanResponse = GeneratePlanResult | GeneratePlanError;

/**
 * Call the AI to generate a training plan.
 * Auto-detects OpenAI vs Anthropic format from config.
 */
export async function generatePlan(
  input: GeneratePlanInput,
): Promise<GeneratePlanResponse> {
  const config = getModelConfig();
  if (!config) {
    return {
      ok: false,
      error: 'AI_API_KEY 未配置。请在 .env.local 中设置 AI_API_KEY（或 ANTHROPIC_AUTH_TOKEN）。',
    };
  }

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(
    input.userMessage,
    input.recentRecords,
    input.recentPlans,
    input.recentDiet,
  );

  try {
    const rawText = config.format === 'anthropic'
      ? await callAnthropic(config, systemPrompt, userPrompt)
      : await callOpenAI(config, systemPrompt, userPrompt);

    if (!rawText.trim()) {
      return { ok: false, error: 'AI 返回为空', rawText };
    }

    const jsonStr = extractJson(rawText);
    if (!jsonStr) {
      return { ok: false, error: 'AI 返回中未找到合法 JSON', rawText };
    }

    try {
      const plan = JSON.parse(jsonStr);
      return { ok: true, plan, rawText };
    } catch {
      return { ok: false, error: 'AI 返回的 JSON 解析失败', rawText: jsonStr };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `AI 请求异常: ${message}` };
  }
}

// ── OpenAI-compatible format ───────────────────────────────────

async function callOpenAI(
  config: ModelConfig,
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: config.maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`AI 请求失败: ${response.status} ${response.statusText} ${errorText}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

// ── Anthropic-compatible format ────────────────────────────────

async function callAnthropic(
  config: ModelConfig,
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const response = await fetch(`${config.baseUrl}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`AI 请求失败: ${response.status} ${response.statusText} ${errorText}`);
  }

  const data = await response.json();
  const content = data?.content;
  if (Array.isArray(content) && content.length > 0) {
    return content.map((c: { text?: string }) => c.text ?? '').join('');
  }
  return '';
}

// ── Helpers ────────────────────────────────────────────────────

function extractJson(text: string): string | null {
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0].trim();

  return null;
}
