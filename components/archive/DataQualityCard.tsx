import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buildDataQualityReport } from '@/lib/data/data-quality';

export async function DataQualityCard() {
  let report;
  try {
    report = await buildDataQualityReport();
  } catch {
    return (
      <Card className="border-gray-800 bg-gray-900">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-gray-400" />
            <CardTitle className="text-base text-gray-100">数据质量</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">暂无可检测数据</p>
        </CardContent>
      </Card>
    );
  }

  const { training, diet } = report;
  const totalIssues = training.issueRecords + diet.issueRecords;
  const hasIssues = totalIssues > 0;

  return (
    <Card className="border-gray-800 bg-gray-900">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className={`h-5 w-5 ${hasIssues ? 'text-yellow-400' : 'text-green-400'}`} />
            <CardTitle className="text-base text-gray-100">数据质量</CardTitle>
          </div>
          <Badge
            variant="outline"
            className={
              hasIssues
                ? 'border-yellow-400 text-yellow-400'
                : 'border-green-400 text-green-400'
            }
          >
            {hasIssues ? `${totalIssues} 条异常` : '正常'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Training records */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">训练记录</span>
          <span className="text-gray-200">
            {training.totalRecords} 条
            {training.issueRecords > 0 && (
              <span className="ml-2 text-yellow-400">
                ({training.issueRecords} 异常)
              </span>
            )}
          </span>
        </div>

        {/* Diet records */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">饮食记录</span>
          <span className="text-gray-200">
            {diet.totalRecords} 条
            {diet.issueRecords > 0 && (
              <span className="ml-2 text-yellow-400">
                ({diet.issueRecords} 异常)
              </span>
            )}
          </span>
        </div>

        {/* Issue breakdown */}
        {hasIssues && (
          <div className="border-t border-gray-800 pt-3 space-y-2">
            {training.summary.mojibake + diet.summary.mojibake > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <AlertTriangle className="h-3.5 w-3.5 text-orange-400" />
                <span className="text-gray-300">
                  疑似乱码: {training.summary.mojibake + diet.summary.mojibake} 处
                </span>
              </div>
            )}
            {training.summary.legacyFormat + diet.summary.legacyFormat > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <AlertTriangle className="h-3.5 w-3.5 text-yellow-400" />
                <span className="text-gray-300">
                  旧格式: {training.summary.legacyFormat + diet.summary.legacyFormat} 处
                </span>
              </div>
            )}
            {training.summary.missingField + diet.summary.missingField > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <AlertTriangle className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-gray-300">
                  缺字段: {training.summary.missingField + diet.summary.missingField} 处
                </span>
              </div>
            )}
            {training.summary.invalidValue + diet.summary.invalidValue > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                <span className="text-gray-300">
                  异常数值: {training.summary.invalidValue + diet.summary.invalidValue} 处
                </span>
              </div>
            )}
            {training.summary.invalidRecord + diet.summary.invalidRecord > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                <span className="text-gray-300">
                  无效记录: {training.summary.invalidRecord + diet.summary.invalidRecord} 条
                </span>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-gray-500 border-t border-gray-800 pt-3">
          只读检测，不会修改源 JSON
        </p>
      </CardContent>
    </Card>
  );
}
