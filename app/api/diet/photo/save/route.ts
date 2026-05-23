import { NextRequest, NextResponse } from 'next/server';
import { validateDietRecordForSave, saveDietPhoto, appendDietRecord } from '@/lib/data/safe-diet-writer';

/**
 * POST /api/diet/photo/save
 * 保存食物图片 + 追加饮食记录到 diet_log.json。
 * - 图片保存到 diet_photos/
 * - 记录追加到 diet_log.json（写入前备份）
 * - 不写 training_log / training_plans
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { record: rawRecord, imageBase64, mimeType } = body;

    if (!rawRecord || typeof rawRecord !== 'object') {
      return NextResponse.json(
        { ok: false, error: '缺少饮食记录数据（record）' },
        { status: 400 },
      );
    }

    // Validate and normalize record
    const record = validateDietRecordForSave(rawRecord);
    if (!record) {
      return NextResponse.json(
        { ok: false, error: '饮食记录数据无效：缺少 id/date 或格式不正确' },
        { status: 400 },
      );
    }

    // Save photo if provided
    if (imageBase64 && typeof imageBase64 === 'string' && mimeType && typeof mimeType === 'string') {
      const buffer = Buffer.from(imageBase64, 'base64');
      const safeBaseName = `food-${record.date}-${Date.now()}`;
      const photoResult = await saveDietPhoto(buffer, mimeType, safeBaseName);

      if (!photoResult.ok) {
        return NextResponse.json(photoResult, { status: 500 });
      }
    }

    // Append record to diet_log.json
    const appendResult = await appendDietRecord(record);

    if (!appendResult.ok) {
      return NextResponse.json(appendResult, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      record: appendResult.record,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, error: `服务器错误: ${message}` },
      { status: 500 },
    );
  }
}
