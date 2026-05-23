import { NextRequest, NextResponse } from 'next/server';
import { validatePlanForSave, saveTrainingPlan } from '@/lib/data/safe-writer';

/**
 * POST /api/plans/save
 * Save an AI-generated training plan to training_plans/.
 * - Validates and normalizes the plan
 * - Backs up existing file if overwriting
 * - Does NOT write training_log.json or diet_log.json
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawPlan = body.plan;

    if (!rawPlan || typeof rawPlan !== 'object') {
      return NextResponse.json(
        { ok: false, error: '缺少 plan 数据' },
        { status: 400 },
      );
    }

    // Validate and normalize
    const plan = validatePlanForSave(rawPlan);
    if (!plan) {
      return NextResponse.json(
        { ok: false, error: 'plan 数据无效：缺少 plan_id/title/date 或格式不正确' },
        { status: 400 },
      );
    }

    // Save with backup
    const result = await saveTrainingPlan(plan);

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
