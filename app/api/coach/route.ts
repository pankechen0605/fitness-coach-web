import { NextRequest, NextResponse } from 'next/server';
import { TrainingRepository, DietRepository, PlanRepository } from '@/lib/data';
import { generatePlan } from '@/lib/ai/coach-client';

/**
 * POST /api/coach
 * Generate a training plan preview using AI.
 * Does NOT write any JSON files.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userMessage = typeof body.message === 'string' ? body.message.trim() : '';

    if (!userMessage) {
      return NextResponse.json(
        { ok: false, error: '请输入训练需求' },
        { status: 400 },
      );
    }

    // Read context from local data (read-only)
    const [recentRecords, recentPlans, recentDiet] = await Promise.all([
      TrainingRepository.getRecent(5),
      PlanRepository.getAll().then((plans) => plans.slice(0, 3)),
      DietRepository.getAll().then((records) => records.slice(0, 3)),
    ]);

    const result = await generatePlan({
      userMessage,
      recentRecords,
      recentPlans,
      recentDiet,
    });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error, rawText: result.rawText },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      plan: result.plan,
      rawText: result.rawText,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, error: `服务器错误: ${message}` },
      { status: 500 },
    );
  }
}
