import 'server-only';
import { DATA_CONFIG } from './config';
import { normalizeTrainingPlan } from './normalizers';
import type { TrainingPlan } from '@/types';

/**
 * 安全写入训练计划。
 * - 只写入 DATA_CONFIG.LOCAL_DATA_DIR / training_plans / *.json
 * - 写入前自动备份同名旧文件
 * - 不写 training_log / diet_log
 */

interface SaveResult {
  ok: true;
  filename: string;
  savedPath: string;
  backupPath: string | null;
}

interface SaveError {
  ok: false;
  error: string;
}

export type SaveResponse = SaveResult | SaveError;

/**
 * Sanitize plan_id/title into a safe filename.
 * Only allows: a-z A-Z 0-9 - _ .json
 */
function sanitizeFilename(raw: string): string {
  // Replace Chinese and special chars with transliteration-safe fallback
  let safe = raw
    .replace(/[^a-zA-Z0-9\-_.]/g, '_')  // Replace unsafe chars with _
    .replace(/_+/g, '_')                   // Collapse multiple _
    .replace(/^_|_$/g, '');                // Trim leading/trailing _

  if (!safe) safe = 'plan';
  if (!safe.endsWith('.json')) safe += '.json';
  return safe;
}

/**
 * Validate and normalize a plan for saving.
 * Returns a stable TrainingPlan shape or null if completely unusable.
 */
export function validatePlanForSave(raw: unknown): TrainingPlan | null {
  return normalizeTrainingPlan(raw);
}

/**
 * Save a training plan to disk with backup.
 * - Ensures training_plans and backups directories exist
 * - Backs up existing file before overwriting
 * - Writes UTF-8 JSON with 2-space indent
 */
export async function saveTrainingPlan(plan: TrainingPlan): Promise<SaveResponse> {
  const { join } = await import('path');
  const { mkdir, writeFile, copyFile, access } = await import('fs/promises');

  const dataDir = DATA_CONFIG.LOCAL_DATA_DIR;
  const plansDir = join(dataDir, 'training_plans');
  const backupDir = join(dataDir, 'backups', 'training_plans');

  // Ensure directories exist
  await mkdir(plansDir, { recursive: true });
  await mkdir(backupDir, { recursive: true });

  // Generate safe filename
  const filename = sanitizeFilename(plan.plan_id || `${plan.date}_${plan.title}`);
  const filePath = join(plansDir, filename);

  // Backup existing file if present
  let backupPath: string | null = null;
  try {
    await access(filePath);
    // File exists — back it up
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilename = `${timestamp}_${filename}`;
    const backupFilePath = join(backupDir, backupFilename);
    await copyFile(filePath, backupFilePath);
    backupPath = backupFilePath;
  } catch {
    // File doesn't exist — no backup needed
  }

  // Write the plan
  try {
    const json = JSON.stringify(plan, null, 2);
    await writeFile(filePath, json, 'utf-8');
    return { ok: true, filename, savedPath: filePath, backupPath };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `写入失败: ${message}` };
  }
}
