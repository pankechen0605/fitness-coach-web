import { Database, Folder, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DataDirectoryCard() {
  return (
    <div className="space-y-4">
      {/* Data directory info */}
      <Card className="border-gray-800 bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-gray-100">
            <Database className="h-5 w-5 text-blue-400" />
            数据目录
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-gray-800 p-4 font-mono text-sm text-gray-300">
            D:/AI_Project/fitnessCOACH/
          </div>
          <p className="mt-2 text-xs text-gray-500">
            所有训练数据存储在本地 JSON 文件中，无需数据库
          </p>
        </CardContent>
      </Card>

      {/* File structure */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-400" />
              <CardTitle className="text-sm text-gray-200">
                training_log.json
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-400">训练日志</p>
            <p className="mt-1 text-xs text-gray-500">
              每次训练的计划、实际完成、RPE、评分、调整建议
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-400" />
              <CardTitle className="text-sm text-gray-200">
                diet_log.json
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-400">饮食日志</p>
            <p className="mt-1 text-xs text-gray-500">
              每日饮食记录，包含热量和宏量营养素
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-sm text-gray-200">
                training_plans/
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-400">训练计划</p>
            <p className="mt-1 text-xs text-gray-500">
              按日期_部位命名的计划文件
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
