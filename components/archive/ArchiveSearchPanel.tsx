'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Dumbbell, Utensils, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { TrainingRecord, DietRecord, TrainingPlan } from '@/types';

interface ArchiveSearchPanelProps {
  trainingRecords: TrainingRecord[];
  dietRecords: DietRecord[];
  trainingPlans: TrainingPlan[];
}

type TypeFilter = 'all' | 'training' | 'diet' | 'plan';
type DateFilter = 'all' | '7d' | '30d';
type PlanStatusFilter = 'all' | 'planned' | 'pending' | 'completed' | 'unknown';

interface SearchResult {
  type: 'training' | 'diet' | 'plan';
  date: string;
  // training
  part?: string;
  rpe?: number;
  rating?: string;
  // diet
  meal?: string;
  totalCalories?: number;
  // plan
  title?: string;
  status?: string;
  mainCount?: number;
}

const MAX_RESULTS = 20;

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'training', label: '训练记录' },
  { value: 'diet', label: '饮食记录' },
  { value: 'plan', label: '训练计划' },
];

const DATE_FILTERS: { value: DateFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: '7d', label: '最近 7 天' },
  { value: '30d', label: '最近 30 天' },
];

const PLAN_STATUS_FILTERS: { value: PlanStatusFilter; label: string }[] = [
  { value: 'all', label: '全部状态' },
  { value: 'planned', label: 'planned' },
  { value: 'pending', label: 'pending' },
  { value: 'completed', label: 'completed' },
  { value: 'unknown', label: 'unknown' },
];

// ── helpers ──────────────────────────────────────────────────────

function matchesKeyword(value: unknown, keyword: string): boolean {
  if (typeof value === 'string') return value.toLowerCase().includes(keyword);
  if (typeof value === 'number') return String(value).includes(keyword);
  return false;
}

function isWithinDays(dateStr: string, days: number): boolean {
  const parsed = Date.parse(dateStr);
  if (Number.isNaN(parsed)) return false;
  const cutoff = Date.now() - days * 86_400_000;
  return parsed >= cutoff;
}

function normalizePlanStatus(status: string): PlanStatusFilter {
  const s = status.toLowerCase();
  if (s === 'planned' || s === '待执行') return 'planned';
  if (s === 'pending') return 'pending';
  if (s === 'completed' || s === '已完成') return 'completed';
  if (s) return 'unknown';
  return 'unknown';
}

// ── component ────────────────────────────────────────────────────

export function ArchiveSearchPanel({
  trainingRecords,
  dietRecords,
  trainingPlans,
}: ArchiveSearchPanelProps) {
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [planStatusFilter, setPlanStatusFilter] = useState<PlanStatusFilter>('all');

  const results = useMemo<SearchResult[]>(() => {
    const kw = keyword.trim().toLowerCase();
    const days = dateFilter === '7d' ? 7 : dateFilter === '30d' ? 30 : 0;

    const out: SearchResult[] = [];

    // Training records
    if (typeFilter === 'all' || typeFilter === 'training') {
      for (const r of trainingRecords) {
        if (days > 0 && !isWithinDays(r.date, days)) continue;
        if (kw) {
          const hit =
            matchesKeyword(r.date, kw) ||
            matchesKeyword(r.part, kw) ||
            matchesKeyword(r.rating, kw) ||
            matchesKeyword(r.notes, kw) ||
            (Array.isArray(r.results) &&
              r.results.some(
                (ex) => matchesKeyword(ex.name, kw) || matchesKeyword(ex.planned, kw)
              ));
          if (!hit) continue;
        }
        out.push({
          type: 'training',
          date: r.date,
          part: r.part,
          rpe: r.rpe,
          rating: r.rating,
        });
      }
    }

    // Diet records
    if (typeFilter === 'all' || typeFilter === 'diet') {
      for (const r of dietRecords) {
        if (days > 0 && !isWithinDays(r.date, days)) continue;
        if (kw) {
          const hit =
            matchesKeyword(r.date, kw) ||
            matchesKeyword(r.meal, kw) ||
            (Array.isArray(r.foods) && r.foods.some((f) => matchesKeyword(f.name, kw)));
          if (!hit) continue;
        }
        out.push({
          type: 'diet',
          date: r.date,
          meal: r.meal,
          totalCalories: r.totalCalories,
        });
      }
    }

    // Training plans
    if (typeFilter === 'all' || typeFilter === 'plan') {
      for (const p of trainingPlans) {
        if (days > 0 && !isWithinDays(p.date, days)) continue;
        const normStatus = normalizePlanStatus(p.status);
        if (planStatusFilter !== 'all' && normStatus !== planStatusFilter) continue;
        if (kw) {
          const hit =
            matchesKeyword(p.date, kw) ||
            matchesKeyword(p.title, kw) ||
            matchesKeyword(p.status, kw) ||
            (Array.isArray(p.main) &&
              p.main.some((ex) => matchesKeyword(ex.name, kw)));
          if (!hit) continue;
        }
        out.push({
          type: 'plan',
          date: p.date,
          title: p.title,
          status: p.status,
          mainCount: Array.isArray(p.main) ? p.main.length : 0,
        });
      }
    }

    // Sort by date desc
    out.sort((a, b) => {
      const da = Date.parse(a.date);
      const db = Date.parse(b.date);
      if (Number.isNaN(da) && Number.isNaN(db)) return 0;
      if (Number.isNaN(da)) return 1;
      if (Number.isNaN(db)) return -1;
      return db - da;
    });

    return out;
  }, [keyword, typeFilter, dateFilter, planStatusFilter, trainingRecords, dietRecords, trainingPlans]);

  const visibleResults = results.slice(0, MAX_RESULTS);

  return (
    <Card className="border-gray-800 bg-gray-900">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-cyan-400" />
          <CardTitle className="text-base text-gray-100">搜索档案</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="搜索日期、部位、动作、餐次..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border-gray-700 bg-gray-800 pl-9 text-sm text-gray-100 placeholder:text-gray-500"
          />
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-gray-500" />
          {TYPE_FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={typeFilter === f.value ? 'default' : 'outline'}
              size="sm"
              className={
                typeFilter === f.value
                  ? 'h-7 bg-cyan-600 text-xs hover:bg-cyan-700'
                  : 'h-7 border-gray-700 text-xs text-gray-300 hover:bg-gray-800'
              }
              onClick={() => setTypeFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {DATE_FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={dateFilter === f.value ? 'default' : 'outline'}
              size="sm"
              className={
                dateFilter === f.value
                  ? 'h-7 bg-cyan-600 text-xs hover:bg-cyan-700'
                  : 'h-7 border-gray-700 text-xs text-gray-300 hover:bg-gray-800'
              }
              onClick={() => setDateFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}

          {/* Plan status filter — only when type is plan or all */}
          {(typeFilter === 'all' || typeFilter === 'plan') && (
            <>
              <span className="ml-2 text-xs text-gray-500">计划状态:</span>
              {PLAN_STATUS_FILTERS.map((f) => (
                <Button
                  key={f.value}
                  variant={planStatusFilter === f.value ? 'default' : 'outline'}
                  size="sm"
                  className={
                    planStatusFilter === f.value
                      ? 'h-7 bg-purple-600 text-xs hover:bg-purple-700'
                      : 'h-7 border-gray-700 text-xs text-gray-300 hover:bg-gray-800'
                  }
                  onClick={() => setPlanStatusFilter(f.value)}
                >
                  {f.label}
                </Button>
              ))}
            </>
          )}
        </div>

        {/* Result count */}
        <div className="text-xs text-gray-400">
          共 {results.length} 条结果
          {results.length > MAX_RESULTS && (
            <span className="ml-1 text-gray-500">（仅显示前 {MAX_RESULTS} 条）</span>
          )}
        </div>

        {/* Results */}
        {visibleResults.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">没有匹配记录</p>
        ) : (
          <div className="space-y-2">
            {visibleResults.map((r, idx) => (
              <SearchResultRow key={idx} result={r} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── result row ───────────────────────────────────────────────────

function SearchResultRow({ result }: { result: SearchResult }) {
  const typeConfig = {
    training: { label: 'Training', icon: Dumbbell, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    diet: { label: 'Diet', icon: Utensils, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    plan: { label: 'Plan', icon: ClipboardList, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  }[result.type];

  const Icon = typeConfig.icon;

  return (
    <div className="flex items-center justify-between rounded-md border border-gray-800 bg-gray-800/50 px-3 py-2">
      <div className="flex items-center gap-3">
        <Badge variant="outline" className={`${typeConfig.color} border-current text-xs`}>
          <Icon className="mr-1 h-3 w-3" />
          {typeConfig.label}
        </Badge>
        <span className="text-xs text-gray-500">{result.date || '未知日期'}</span>
        {result.type === 'training' && (
          <>
            <span className="text-sm text-gray-200">{result.part || '未知部位'}</span>
            <span className="text-xs text-gray-400">RPE {result.rpe ?? '-'}</span>
            {result.rating && (
              <span className="text-xs text-gray-400">{result.rating}</span>
            )}
          </>
        )}
        {result.type === 'diet' && (
          <>
            <span className="text-sm text-gray-200">{result.meal || '未知餐次'}</span>
            <span className="text-xs text-gray-400">{result.totalCalories ?? 0} kcal</span>
          </>
        )}
        {result.type === 'plan' && (
          <>
            <span className="text-sm text-gray-200">{result.title || '未命名'}</span>
            <span className="text-xs text-gray-400">{result.status || '未知状态'}</span>
            <span className="text-xs text-gray-400">{result.mainCount ?? 0} 个主训练</span>
          </>
        )}
      </div>
    </div>
  );
}
