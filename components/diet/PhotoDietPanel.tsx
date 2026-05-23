'use client';

import { useState, useRef } from 'react';
import {
  Camera,
  Send,
  Loader2,
  AlertTriangle,
  Save,
  CheckCircle2,
  Utensils,
  Info,
  ChevronDown,
  ChevronUp,
  X,
  Upload,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface FoodItem {
  name: string;
  amount: string;
  calories: number;
}

interface AnalyzeResult {
  foods: FoodItem[];
  totalCalories: number;
  macros: { protein: number; carbs: number; fat: number };
  confidence: 'high' | 'medium' | 'low';
  aiComment: string;
  rawText: string;
}

const MEAL_OPTIONS = [
  { key: 'breakfast', label: '早餐' },
  { key: 'lunch', label: '午餐' },
  { key: 'dinner', label: '晚餐' },
  { key: 'snack', label: '加餐' },
] as const;

const CONFIDENCE_MAP = {
  high: { label: '高置信', color: 'text-green-400 border-green-400' },
  medium: { label: '中置信', color: 'text-yellow-400 border-yellow-400' },
  low: { label: '低置信', color: 'text-red-400 border-red-400' },
};

export function PhotoDietPanel() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [mealType, setMealType] = useState<string>('lunch');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }

    setError(null);
    setResult(null);
    setSaveError(null);
    setSaveSuccess(null);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      // Extract pure base64 (strip data:image/...;base64, prefix)
      const base64 = dataUrl.split(',')[1] ?? '';
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    setMimeType(null);
    setResult(null);
    setError(null);
    setSaveError(null);
    setSaveSuccess(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!imageBase64 || !mimeType) {
      setError('请先选择食物照片');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const res = await fetch('/api/diet/photo/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mimeType, mealType, note: note || undefined }),
      });

      const data = await res.json();

      if (!data.ok) {
        setError(data.error || '识别失败');
        return;
      }

      setResult({
        foods: data.record.foods,
        totalCalories: data.record.totalCalories,
        macros: data.record.macros,
        confidence: data.record.confidence,
        aiComment: data.record.aiComment,
        rawText: data.rawText,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '请求失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || !imageBase64 || !mimeType) return;

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    const today = new Date().toISOString().split('T')[0];
    const record = {
      id: `photo-${today}-${Date.now()}`,
      date: today,
      meal: mealType,
      foods: result.foods,
      totalCalories: result.totalCalories,
      macros: result.macros,
      source: 'photo',
    };

    try {
      const res = await fetch('/api/diet/photo/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record, imageBase64, mimeType }),
      });

      const data = await res.json();

      if (!data.ok) {
        setSaveError(data.error || '保存失败');
        return;
      }

      setSaveSuccess('已保存到 diet_log.json');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : '保存请求失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload & config */}
      <Card className="border-gray-800 bg-gray-900">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-orange-400" />
            <CardTitle className="text-base text-gray-100">拍照识别饮食</CardTitle>
          </div>
          <p className="text-xs text-gray-500">
            上传食物照片，AI 识别食物并估算营养成分
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image upload area */}
          <div>
            <label className="mb-1.5 block text-xs text-gray-400">食物照片</label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="食物预览"
                  className="max-h-64 w-full rounded-lg border border-gray-700 object-contain"
                />
                <button
                  onClick={handleClearImage}
                  className="absolute right-2 top-2 rounded-full bg-gray-900/80 p-1.5 text-gray-300 hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-gray-700 p-8 text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-300"
              >
                <Upload className="h-8 w-8" />
                <span className="text-sm">点击选择图片</span>
                <span className="text-xs text-gray-500">支持 JPG / PNG / WebP</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Meal type */}
          <div>
            <label className="mb-1.5 block text-xs text-gray-400">餐次</label>
            <div className="flex flex-wrap gap-2">
              {MEAL_OPTIONS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMealType(m.key)}
                  className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                    mealType === m.key
                      ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                      : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="mb-1.5 block text-xs text-gray-400">备注（可选）</label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="如：少油、加辣、半份"
              className="border-gray-700 bg-gray-800 text-sm text-gray-100 placeholder:text-gray-500"
            />
          </div>

          {/* Analyze button */}
          <Button
            onClick={handleAnalyze}
            disabled={loading || !imageBase64}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI 正在识别...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                AI 识别食物
              </>
            )}
          </Button>

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
            <p className="text-sm text-red-300">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Result preview */}
      {result && (
        <Card className="border-orange-800 bg-gray-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-orange-400" />
                <CardTitle className="text-base text-gray-100">识别结果</CardTitle>
              </div>
              <Badge
                variant="outline"
                className={CONFIDENCE_MAP[result.confidence].color}
              >
                {CONFIDENCE_MAP[result.confidence].label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Food list */}
            <div className="space-y-1.5">
              {result.foods.map((food, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-md border border-gray-800 bg-gray-800/50 px-3 py-2"
                >
                  <span className="text-sm text-gray-200">{food.name}</span>
                  <span className="text-xs text-gray-400">
                    {food.amount && `${food.amount} · `}{food.calories} kcal
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-md bg-orange-500/10 p-2 text-center">
                <p className="text-xs text-gray-400">总热量</p>
                <p className="text-lg font-semibold text-orange-400">{result.totalCalories}</p>
              </div>
              <div className="rounded-md bg-blue-500/10 p-2 text-center">
                <p className="text-xs text-gray-400">蛋白质</p>
                <p className="text-lg font-semibold text-blue-400">{result.macros.protein}g</p>
              </div>
              <div className="rounded-md bg-green-500/10 p-2 text-center">
                <p className="text-xs text-gray-400">碳水</p>
                <p className="text-lg font-semibold text-green-400">{result.macros.carbs}g</p>
              </div>
              <div className="rounded-md bg-yellow-500/10 p-2 text-center">
                <p className="text-xs text-gray-400">脂肪</p>
                <p className="text-lg font-semibold text-yellow-400">{result.macros.fat}g</p>
              </div>
            </div>

            {/* AI comment */}
            {result.aiComment && (
              <div className="rounded-md bg-gray-800/50 p-3">
                <p className="text-xs text-gray-400">{result.aiComment}</p>
              </div>
            )}

            {/* Save section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-md border border-dashed border-gray-700 p-3">
                <Info className="h-4 w-4 flex-shrink-0 text-gray-500" />
                <p className="text-xs text-gray-400">
                  以上为 AI 识别的估算结果。保存后图片存入 diet_photos，记录追加到 diet_log.json。
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
                    保存到饮食记录
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
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
