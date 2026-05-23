'use client';

import { useState } from 'react';
import {
  Bot,
  Send,
  Loader2,
  AlertTriangle,
  Clock,
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Info,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface CoachPlanResult {
  plan_id?: string;
  title?: string;
  date?: string;
  status?: string;
  duration?: number | string;
  warmup?: Array<{ name: string; sets?: number; reps?: string }>;
  main?: Array<{ name: string; sets?: number; reps?: string; weight?: string; rest?: string }>;
  finisher?: Array<{ name: string; sets?: number; reps?: string; posture?: boolean }>;
  posture?: string;
  output?: string;
  warnings?: string[];
}

const STATUS_OPTIONS = ['状态好', '状态一般', '有点疲劳', '喝了肌酸', '睡眠不足'];
const TIME_OPTIONS = ['30分钟', '45分钟', '60分钟', '90分钟', '不限'];
const EQUIPMENT_OPTIONS = ['全器械', '哑铃为主', '徒手', '弹力带', '游泳'];

export function AICoachPanel() {
  const [status, setStatus] = useState('');
  const [focus, setFocus] = useState('');
  const [avoid, setAvoid] = useState('');
  const [duration, setDuration] = useState('');
  const [discomfort, setDiscomfort] = useState('');
  const [equipment, setEquipment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<CoachPlanResult | null>(null);
  const [rawText, setRawText] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleSave = async () => {
    if (!plan) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const res = await fetch('/api/plans/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!data.ok) {
        setSaveError(data.error || '保存失败');
        return;
      }

      setSaveSuccess(`已保存到 ${data.filename}${data.backupPath ? '（已备份旧文件）' : ''}`);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : '保存请求失败');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setPlan(null);
    setRawText(null);
    setSaveError(null);
    setSaveSuccess(null);

    // Build message from inputs
    const parts: string[] = [];
    if (status) parts.push(`当前状态：${status}`);
    if (focus) parts.push(`想练：${focus}`);
    if (avoid) parts.push(`不想练/避免：${avoid}`);
    if (duration) parts.push(`可用时间：${duration}`);
    if (discomfort) parts.push(`身体不适：${discomfort}`);
    if (equipment) parts.push(`器械环境：${equipment}`);

    const message = parts.length > 0 ? parts.join('；') : '今天练什么';

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!data.ok) {
        setError(data.error || '生成失败');
        if (data.rawText) setRawText(data.rawText);
        return;
      }

      setPlan(data.plan);
      if (data.rawText) setRawText(data.rawText);
    } catch (err) {
      setError(err instanceof Error ? err.message : '请求失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Input form */}
      <Card className="border-gray-800 bg-gray-900">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-cyan-400" />
            <CardTitle className="text-base text-gray-100">AI 生成训练计划</CardTitle>
          </div>
          <p className="text-xs text-gray-500">
            填写状态后点击生成，AI 会根据历史数据给出计划预览
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status quick select */}
          <div>
            <label className="mb-1.5 block text-xs text-gray-400">今日状态</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(status === s ? '' : s)}
                  className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                    status === s
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                      : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Focus / avoid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs text-gray-400">想练什么</label>
              <Input
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                placeholder="如：背、胸肩、腿"
                className="border-gray-700 bg-gray-800 text-sm text-gray-100 placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-gray-400">不想练 / 避免</label>
              <Input
                value={avoid}
                onChange={(e) => setAvoid(e.target.value)}
                placeholder="如：深蹲、肩膀"
                className="border-gray-700 bg-gray-800 text-sm text-gray-100 placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Duration / equipment */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs text-gray-400">可用时间</label>
              <div className="flex flex-wrap gap-1.5">
                {TIME_OPTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setDuration(duration === t ? '' : t)}
                    className={`rounded border px-2 py-1 text-xs transition-colors ${
                      duration === t
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                        : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-gray-400">器械环境</label>
              <div className="flex flex-wrap gap-1.5">
                {EQUIPMENT_OPTIONS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEquipment(equipment === e ? '' : e)}
                    className={`rounded border px-2 py-1 text-xs transition-colors ${
                      equipment === e
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                        : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Discomfort */}
          <div>
            <label className="mb-1.5 block text-xs text-gray-400">身体不适（可选）</label>
            <Input
              value={discomfort}
              onChange={(e) => setDiscomfort(e.target.value)}
              placeholder="如：左肩有点疼、膝盖不适"
              className="border-gray-700 bg-gray-800 text-sm text-gray-100 placeholder:text-gray-500"
            />
          </div>

          {/* Generate button */}
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI 正在生成...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                生成训练计划
              </>
            )}
          </Button>

          {/* API key warning */}
          <p className="text-xs text-gray-500">
            需要配置环境变量 AI_API_KEY（或 OPENAI_API_KEY）才能使用 AI 功能
          </p>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-red-800 bg-red-900/20">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
            <div>
              <p className="text-sm text-red-300">{error}</p>
              {rawText && (
                <pre className="mt-2 max-h-40 overflow-auto rounded bg-red-950/50 p-2 text-xs text-red-400">
                  {rawText}
                </pre>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan preview */}
      {plan && (
        <Card className="border-cyan-800 bg-gray-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-cyan-400" />
                <CardTitle className="text-base text-gray-100">
                  {plan.title || '训练计划'}
                </CardTitle>
              </div>
              <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                {plan.status || '待执行'}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              {plan.date && <span>{plan.date}</span>}
              {plan.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{typeof plan.duration === 'number' ? `${plan.duration}分钟` : plan.duration}</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* AI output text */}
            {plan.output && (
              <div className="rounded-md bg-cyan-500/10 p-3">
                <p className="whitespace-pre-wrap text-sm text-cyan-200">{plan.output}</p>
              </div>
            )}

            {/* Warnings */}
            {Array.isArray(plan.warnings) && plan.warnings.length > 0 && (
              <div className="space-y-1">
                {plan.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-yellow-400">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Warmup */}
            {Array.isArray(plan.warmup) && plan.warmup.length > 0 && (
              <ExerciseSection title="热身" exercises={plan.warmup} color="text-green-400" />
            )}

            {/* Main */}
            {Array.isArray(plan.main) && plan.main.length > 0 && (
              <ExerciseSection title="主训练" exercises={plan.main} color="text-blue-400" />
            )}

            {/* Finisher */}
            {Array.isArray(plan.finisher) && plan.finisher.length > 0 && (
              <ExerciseSection title="收尾" exercises={plan.finisher} color="text-purple-400" />
            )}

            {/* Posture */}
            {plan.posture && (
              <div className="rounded-md bg-yellow-500/10 p-3">
                <p className="text-xs text-yellow-400">体态提醒：{plan.posture}</p>
              </div>
            )}

            {/* Save section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-md border border-dashed border-gray-700 p-3">
                <Info className="h-4 w-4 flex-shrink-0 text-gray-500" />
                <p className="text-xs text-gray-400">
                  以上为 AI 生成的计划预览。保存后将写入 training_plans，写入前会自动备份同名旧文件。
                </p>
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    保存计划到 training_plans
                  </>
                )}
              </Button>

              {saveSuccess && (
                <div className="flex items-center gap-2 rounded-md bg-green-500/10 p-3">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-400" />
                  <p className="text-sm text-green-300">{saveSuccess}</p>
                </div>
              )}

              {saveError && (
                <div className="flex items-center gap-2 rounded-md bg-red-500/10 p-3">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-400" />
                  <p className="text-sm text-red-300">{saveError}</p>
                </div>
              )}
            </div>

            {/* JSON toggle */}
            <div>
              <button
                onClick={() => setShowJson(!showJson)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300"
              >
                {showJson ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {showJson ? '隐藏 JSON' : '查看 JSON'}
              </button>
              {showJson && (
                <pre className="mt-2 max-h-60 overflow-auto rounded-md bg-gray-950 p-3 text-xs text-gray-400">
                  {JSON.stringify(plan, null, 2)}
                </pre>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Exercise section helper ──────────────────────────────────

function ExerciseSection({
  title,
  exercises,
  color,
}: {
  title: string;
  exercises: Array<{ name: string; sets?: number; reps?: string; weight?: string; rest?: string }>;
  color: string;
}) {
  return (
    <div>
      <h4 className={`mb-2 text-sm font-medium ${color}`}>{title}</h4>
      <div className="space-y-1.5">
        {exercises.map((ex, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-md border border-gray-800 bg-gray-800/50 px-3 py-2"
          >
            <span className="text-sm text-gray-200">{ex.name}</span>
            <span className="text-xs text-gray-400">
              {ex.sets ? `${ex.sets}组` : ''}
              {ex.reps ? `x${ex.reps}` : ''}
              {ex.weight ? ` x${ex.weight}` : ''}
              {ex.rest ? ` (${ex.rest})` : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
