import { NextRequest, NextResponse } from 'next/server';
import { analyzeFoodPhoto } from '@/lib/ai/food-client';

/**
 * POST /api/diet/photo/analyze
 * 接收食物图片（base64），调用 AI vision 识别，返回预览结果。
 * 不写入任何文件。
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, mimeType, mealType, note } = body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return NextResponse.json(
        { ok: false, error: '缺少图片数据（imageBase64）' },
        { status: 400 },
      );
    }

    if (!mimeType || typeof mimeType !== 'string') {
      return NextResponse.json(
        { ok: false, error: '缺少图片类型（mimeType）' },
        { status: 400 },
      );
    }

    const result = await analyzeFoodPhoto({
      imageBase64,
      mimeType,
      mealType: typeof mealType === 'string' ? mealType : undefined,
      note: typeof note === 'string' ? note : undefined,
    });

    if (!result.ok) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, error: `服务器错误: ${message}` },
      { status: 500 },
    );
  }
}
