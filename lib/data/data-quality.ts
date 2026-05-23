import 'server-only';
import { readTrainingLog, readDietLog } from './local-json-source';

// --- Types ---

export type IssueCategory =
  | 'mojibake'
  | 'missing-field'
  | 'legacy-format'
  | 'invalid-value'
  | 'invalid-record';

export interface DataQualityIssue {
  category: IssueCategory;
  field: string;
  message: string;
  recordIndex: number;
}

export interface DataQualityReport {
  totalRecords: number;
  issueRecords: number;
  issues: DataQualityIssue[];
  summary: {
    mojibake: number;
    missingField: number;
    legacyFormat: number;
    invalidValue: number;
    invalidRecord: number;
  };
}

// --- Mojibake detection ---

const MOJIBAKE_MARKERS = [
  '�',       // replacement character
  'ï¿½',         // UTF-8 misread as Latin-1
  'Ã',            // common UTF-8 → Latin-1 artifact
  'å', 'ä', 'ç', // partial CJK mojibake
  'æ', 'ø', 'ö', // Scandinavian misread
];

export function detectSuspiciousText(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  return MOJIBAKE_MARKERS.some((marker) => value.includes(marker));
}

// --- Helpers ---

function isObjectRecord(item: unknown): item is Record<string, unknown> {
  return item !== null && item !== undefined && typeof item === 'object' && !Array.isArray(item);
}

function hasField(obj: Record<string, unknown>, key: string): boolean {
  return key in obj && obj[key] !== undefined && obj[key] !== null;
}

// --- Training record inspection ---

export function inspectTrainingRecords(records: unknown[]): DataQualityReport {
  const issues: DataQualityIssue[] = [];
  let issueRecords = 0;

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    let hasIssue = false;

    // Non-object / null / empty
    if (!isObjectRecord(record) || Object.keys(record).length === 0) {
      issues.push({ category: 'invalid-record', field: '(root)', message: '非 object / null / 空对象', recordIndex: i });
      issueRecords++;
      continue;
    }

    // Missing required fields
    for (const field of ['plan_id', 'date', 'part', 'rpe', 'rating', 'notes']) {
      if (!hasField(record, field)) {
        issues.push({ category: 'missing-field', field, message: `缺少字段: ${field}`, recordIndex: i });
        hasIssue = true;
      }
    }

    // Legacy format: results not array
    if (hasField(record, 'results') && !Array.isArray(record.results)) {
      issues.push({ category: 'legacy-format', field: 'results', message: 'results 不是数组（旧格式）', recordIndex: i });
      hasIssue = true;
    }

    // Legacy format: adjustments not array
    if (hasField(record, 'adjustments') && !Array.isArray(record.adjustments)) {
      issues.push({ category: 'legacy-format', field: 'adjustments', message: 'adjustments 不是数组（旧格式）', recordIndex: i });
      hasIssue = true;
    }

    // Invalid RPE
    if (hasField(record, 'rpe')) {
      const rpe = record.rpe;
      if (typeof rpe !== 'number' || !Number.isFinite(rpe)) {
        issues.push({ category: 'invalid-value', field: 'rpe', message: 'rpe 不是有效数字', recordIndex: i });
        hasIssue = true;
      } else if (rpe < 0 || rpe > 10) {
        issues.push({ category: 'invalid-value', field: 'rpe', message: `rpe 超出范围 (0-10): ${rpe}`, recordIndex: i });
        hasIssue = true;
      }
    }

    // Mojibake detection on string fields
    const stringFields = ['plan_id', 'date', 'part', 'status_before', 'notes', 'rating'];
    for (const field of stringFields) {
      if (hasField(record, field) && detectSuspiciousText(record[field])) {
        issues.push({ category: 'mojibake', field, message: `字段 ${field} 疑似乱码`, recordIndex: i });
        hasIssue = true;
      }
    }

    // Mojibake in nested results
    if (Array.isArray(record.results)) {
      for (let j = 0; j < record.results.length; j++) {
        const result = record.results[j];
        if (isObjectRecord(result)) {
          for (const field of ['name', 'planned', 'actual', 'note']) {
            if (hasField(result, field) && detectSuspiciousText(result[field])) {
              issues.push({ category: 'mojibake', field: `results[${j}].${field}`, message: `results[${j}].${field} 疑似乱码`, recordIndex: i });
              hasIssue = true;
            }
          }
        }
      }
    }

    if (hasIssue) issueRecords++;
  }

  return {
    totalRecords: records.length,
    issueRecords,
    issues,
    summary: {
      mojibake: issues.filter((i) => i.category === 'mojibake').length,
      missingField: issues.filter((i) => i.category === 'missing-field').length,
      legacyFormat: issues.filter((i) => i.category === 'legacy-format').length,
      invalidValue: issues.filter((i) => i.category === 'invalid-value').length,
      invalidRecord: issues.filter((i) => i.category === 'invalid-record').length,
    },
  };
}

// --- Diet record inspection ---

export function inspectDietRecords(records: unknown[]): DataQualityReport {
  const issues: DataQualityIssue[] = [];
  let issueRecords = 0;

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    let hasIssue = false;

    // Non-object / null / empty
    if (!isObjectRecord(record) || Object.keys(record).length === 0) {
      issues.push({ category: 'invalid-record', field: '(root)', message: '非 object / null / 空对象', recordIndex: i });
      issueRecords++;
      continue;
    }

    // Missing required fields
    for (const field of ['id', 'date', 'meal', 'foods', 'totalCalories', 'macros']) {
      if (!hasField(record, field)) {
        issues.push({ category: 'missing-field', field, message: `缺少字段: ${field}`, recordIndex: i });
        hasIssue = true;
      }
    }

    // Legacy format: foods not array
    if (hasField(record, 'foods') && !Array.isArray(record.foods)) {
      issues.push({ category: 'legacy-format', field: 'foods', message: 'foods 不是数组（旧格式）', recordIndex: i });
      hasIssue = true;
    }

    // Legacy format: macros missing
    if (!hasField(record, 'macros') || !isObjectRecord(record.macros)) {
      issues.push({ category: 'legacy-format', field: 'macros', message: 'macros 缺失或非 object（旧格式）', recordIndex: i });
      hasIssue = true;
    }

    // Invalid totalCalories
    if (hasField(record, 'totalCalories')) {
      const cal = record.totalCalories;
      if (typeof cal !== 'number' || !Number.isFinite(cal)) {
        issues.push({ category: 'invalid-value', field: 'totalCalories', message: 'totalCalories 不是有效数字', recordIndex: i });
        hasIssue = true;
      }
    }

    // Mojibake detection on string fields
    const stringFields = ['id', 'date', 'meal'];
    for (const field of stringFields) {
      if (hasField(record, field) && detectSuspiciousText(record[field])) {
        issues.push({ category: 'mojibake', field, message: `字段 ${field} 疑似乱码`, recordIndex: i });
        hasIssue = true;
      }
    }

    // Mojibake in nested foods
    if (Array.isArray(record.foods)) {
      for (let j = 0; j < record.foods.length; j++) {
        const food = record.foods[j];
        if (isObjectRecord(food)) {
          for (const field of ['name', 'amount']) {
            if (hasField(food, field) && detectSuspiciousText(food[field])) {
              issues.push({ category: 'mojibake', field: `foods[${j}].${field}`, message: `foods[${j}].${field} 疑似乱码`, recordIndex: i });
              hasIssue = true;
            }
          }
        }
      }
    }

    if (hasIssue) issueRecords++;
  }

  return {
    totalRecords: records.length,
    issueRecords,
    issues,
    summary: {
      mojibake: issues.filter((i) => i.category === 'mojibake').length,
      missingField: issues.filter((i) => i.category === 'missing-field').length,
      legacyFormat: issues.filter((i) => i.category === 'legacy-format').length,
      invalidValue: issues.filter((i) => i.category === 'invalid-value').length,
      invalidRecord: issues.filter((i) => i.category === 'invalid-record').length,
    },
  };
}

// --- Full report builder ---

export interface FullDataQualityReport {
  training: DataQualityReport;
  diet: DataQualityReport;
}

export async function buildDataQualityReport(): Promise<FullDataQualityReport> {
  const [trainingResult, dietResult] = await Promise.all([
    readTrainingLog().catch(() => ({ data: [], source: 'mock-fallback' as const })),
    readDietLog().catch(() => ({ data: [], source: 'mock-fallback' as const })),
  ]);

  return {
    training: inspectTrainingRecords(trainingResult.data),
    diet: inspectDietRecords(dietResult.data),
  };
}
