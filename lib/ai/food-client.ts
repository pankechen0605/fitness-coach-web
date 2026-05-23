import { getModelConfig, type ModelConfig } from './model-config';

export interface FoodAnalyzeInput {
  imageBase64: string;
  mimeType: string;
  mealType?: string;
  note?: string;
}

export interface FoodAnalyzeResult {
  ok: true;
  record: {
    id: string;
    date: string;
    meal: string;
    foods: Array<{ name: string; amount: string; calories: number }>;
    totalCalories: number;
    macros: { protein: number; carbs: number; fat: number };
    source: 'photo';
    imagePath: null;
    confidence: 'high' | 'medium' | 'low';
    aiComment: string;
  };
  rawText: string;
}

export interface FoodAnalyzeError {
  ok: false;
  error: string;
  rawText?: string;
}

export type FoodAnalyzeResponse = FoodAnalyzeResult | FoodAnalyzeError;

const FOOD_SYSTEM_PROMPT = `你是一个食物营养估算助手。用户会发送食物照片，你需要识别食物并估算营养成分。

## 规则
- 中文输出
- 只做估算，不声称精准
- 不做医学诊断
- 不推荐补剂
- 不编造精确克数，使用范围或合理估算
- 无法识别时返回低置信度和说明

## 输出格式

你必须输出合法 JSON，不要包含任何其他文字：

\`\`\`json
{
  "foods": [
    {"name": "食物名", "amount": "估算份量", "calories": 200}
  ],
  "totalCalories": 500,
  "macros": {
    "protein": 30,
    "carbs": 50,
    "fat": 15
  },
  "confidence": "medium",
  "aiComment": "识别说明和估算依据"
}
\`\`\`

## 字段说明
- foods: 识别到的食物列表，每项包含名称、估算份量、估算卡路里
- totalCalories: 总卡路里估算
- macros: 宏量营养素估算（蛋白质、碳水、脂肪，单位克）
- confidence: 置信度 high/medium/low
- aiComment: 识别说明，如估算依据、不确定性等`;

/**
 * Analyze a food photo using AI vision.
 */
export async function analyzeFoodPhoto(
  input: FoodAnalyzeInput,
): Promise<FoodAnalyzeResponse> {
  const config = getModelConfig();
  if (!config) {
    return {
      ok: false,
      error: 'AI_API_KEY 未配置。请在 .env.local 中设置 AI_API_KEY（或 ANTHROPIC_AUTH_TOKEN）。',
    };
  }

  const mealHint = input.mealType ? `\n用户标记的餐次：${input.mealType}` : '';
  const noteHint = input.note ? `\n用户备注：${input.note}` : '';
  const userContent = `请识别这张食物照片中的食物并估算营养成分。${mealHint}${noteHint}`;

  try {
    const rawText = config.format === 'anthropic'
      ? await callAnthropicVision(config, userContent, input.imageBase64, input.mimeType)
      : await callOpenAIVision(config, userContent, input.imageBase64, input.mimeType);

    if (!rawText.trim()) {
      return { ok: false, error: 'AI 返回为空', rawText };
    }

    const jsonStr = extractJson(rawText);
    if (!jsonStr) {
      return { ok: false, error: 'AI 返回中未找到合法 JSON', rawText };
    }

    try {
      const parsed = JSON.parse(jsonStr);
      const today = new Date().toISOString().split('T')[0];
      const meal = ['breakfast', 'lunch', 'dinner', 'snack'].includes(input.mealType ?? '')
        ? input.mealType!
        : 'snack';

      const record = {
        id: `photo-${today}-${Date.now()}`,
        date: today,
        meal,
        foods: Array.isArray(parsed.foods) ? parsed.foods : [],
        totalCalories: typeof parsed.totalCalories === 'number' ? parsed.totalCalories : 0,
        macros: {
          protein: typeof parsed.macros?.protein === 'number' ? parsed.macros.protein : 0,
          carbs: typeof parsed.macros?.carbs === 'number' ? parsed.macros.carbs : 0,
          fat: typeof parsed.macros?.fat === 'number' ? parsed.macros.fat : 0,
        },
        source: 'photo' as const,
        imagePath: null,
        confidence: ['high', 'medium', 'low'].includes(parsed.confidence) ? parsed.confidence : 'low',
        aiComment: typeof parsed.aiComment === 'string' ? parsed.aiComment : '',
      };

      return { ok: true, record, rawText };
    } catch {
      return { ok: false, error: 'AI 返回的 JSON 解析失败', rawText: jsonStr };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `AI 请求异常: ${message}` };
  }
}

// ── OpenAI-compatible vision ───────────────────────────────────

async function callOpenAIVision(
  config: ModelConfig,
  userText: string,
  imageBase64: string,
  mimeType: string,
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
        { role: 'system', content: FOOD_SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: userText },
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${imageBase64}` },
            },
          ],
        },
      ],
      max_tokens: config.maxTokens,
      temperature: 0.5,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`AI 请求失败: ${response.status} ${response.statusText} ${errorText}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

// ── Anthropic-compatible vision ────────────────────────────────

async function callAnthropicVision(
  config: ModelConfig,
  userText: string,
  imageBase64: string,
  mimeType: string,
): Promise<string> {
  const mediaType = mimeType === 'image/jpg' ? 'image/jpeg' : mimeType;

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
      system: FOOD_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: imageBase64 },
            },
            { type: 'text', text: userText },
          ],
        },
      ],
      temperature: 0.5,
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
