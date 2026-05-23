import 'server-only';
import { DATA_CONFIG } from './config';
import { normalizeDietRecord } from './normalizers';
import type { DietRecord } from '@/types';

/**
 * 安全写入饮食相关数据。
 * - 图片写入 diet_photos/
 * - diet_log.json append（写入前自动备份）
 * - 不写 training_log / training_plans
 */

// ── Types ─────────────────────────────────────────────────────

interface SavePhotoResult {
  ok: true;
  savedPath: string;
  relativePath: string;
}

interface AppendResult {
  ok: true;
  record: DietRecord;
  backupPath: string | null;
}

interface WriteError {
  ok: false;
  error: string;
}

export type SavePhotoResponse = SavePhotoResult | WriteError;
export type AppendDietResponse = AppendResult | WriteError;

// ── Validate ──────────────────────────────────────────────────

/**
 * 验证并标准化饮食记录用于保存。
 * 返回标准化后的 DietRecord 或 null（完全不可用）。
 */
export function validateDietRecordForSave(raw: unknown): DietRecord | null {
  return normalizeDietRecord(raw);
}

// ── Save photo ────────────────────────────────────────────────

/**
 * 保存食物图片到 diet_photos/。
 * @param fileBuffer 图片二进制内容
 * @param mimeType MIME 类型（image/jpeg 等）
 * @param safeBaseName 安全的文件名（不含扩展名）
 */
export async function saveDietPhoto(
  fileBuffer: Buffer,
  mimeType: string,
  safeBaseName: string,
): Promise<SavePhotoResponse> {
  const { join } = await import('path');
  const { mkdir, writeFile } = await import('fs/promises');

  const ext = mimeTypeToExt(mimeType);
  const filename = `${safeBaseName}.${ext}`;
  const photosDir = join(DATA_CONFIG.LOCAL_DATA_DIR, 'diet_photos');

  try {
    await mkdir(photosDir, { recursive: true });
    const filePath = join(photosDir, filename);
    await writeFile(filePath, fileBuffer);
    return {
      ok: true,
      savedPath: filePath,
      relativePath: `diet_photos/${filename}`,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `图片保存失败: ${message}` };
  }
}

// ── Append diet record ────────────────────────────────────────

/**
 * 将饮食记录追加到 diet_log.json。
 * - diet_log.json 不存在时创建 [] 再 append
 * - diet_log.json parse 失败时不覆盖，返回错误
 * - 写入前备份到 backups/diet_log/
 */
export async function appendDietRecord(record: DietRecord): Promise<AppendDietResponse> {
  const { join } = await import('path');
  const { mkdir, readFile, writeFile, copyFile, access } = await import('fs/promises');

  const dataDir = DATA_CONFIG.LOCAL_DATA_DIR;
  const logPath = join(dataDir, DATA_CONFIG.FILES.DIET_LOG);
  const backupDir = join(dataDir, 'backups', 'diet_log');

  // Ensure backup dir exists
  await mkdir(backupDir, { recursive: true });

  // Read existing log
  let existingRecords: DietRecord[] = [];
  let fileExists = false;

  try {
    await access(logPath);
    fileExists = true;
  } catch {
    // File doesn't exist — will create new
  }

  if (fileExists) {
    // Backup before modifying
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = join(backupDir, `${timestamp}_diet_log.json`);
      await copyFile(logPath, backupPath);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, error: `备份 diet_log.json 失败，已中止写入: ${message}` };
    }

    // Read and parse
    try {
      const raw = await readFile(logPath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return { ok: false, error: 'diet_log.json 内容不是数组，已中止写入（未修改文件）' };
      }
      existingRecords = parsed as DietRecord[];
    } catch {
      return { ok: false, error: 'diet_log.json 解析失败，已中止写入（未修改文件）' };
    }
  }

  // Append and write
  try {
    existingRecords.push(record);
    const json = JSON.stringify(existingRecords, null, 2);
    await writeFile(logPath, json, 'utf-8');
    return { ok: true, record, backupPath: fileExists ? 'backed up' : null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `写入 diet_log.json 失败: ${message}` };
  }
}

// ── Helpers ───────────────────────────────────────────────────

function mimeTypeToExt(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  return map[mimeType] ?? 'jpg';
}
