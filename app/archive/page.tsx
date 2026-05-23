import { Archive } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DataDirectoryCard } from '@/components/archive/DataDirectoryCard';
import { DataSourceBadge } from '@/components/archive/DataSourceBadge';
import { DataQualityCard } from '@/components/archive/DataQualityCard';
import { ArchiveRecentRecords } from '@/components/archive/ArchiveRecentRecords';
import { ArchivePlanPreview } from '@/components/archive/ArchivePlanPreview';
import { TrainingRepository, DietRepository, PlanRepository } from '@/lib/data';

export default async function ArchivePage() {
  const [trainingRecords, dietRecords, trainingPlans] = await Promise.all([
    TrainingRepository.getAll(),
    DietRepository.getAll(),
    PlanRepository.getAll(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-100">历史档案</h2>
        <p className="mt-1 text-sm text-gray-400">
          访问本地存储的训练数据和计划文件
        </p>
      </div>

      {/* Data source status */}
      <DataSourceBadge />

      {/* Data quality */}
      <DataQualityCard />

      {/* Training plan preview */}
      <ArchivePlanPreview plans={trainingPlans} />

      {/* Recent records preview */}
      <ArchiveRecentRecords
        trainingRecords={trainingRecords}
        dietRecords={dietRecords}
      />

      {/* Data directory info */}
      <DataDirectoryCard />

      {/* Placeholder for future implementation */}
      <Card className="border-dashed border-gray-700 bg-gray-900/50">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Archive className="mb-3 h-12 w-12 text-gray-600" />
          <p className="text-sm text-gray-400">只读文件预览</p>
          <p className="mt-1 text-xs text-gray-500">
            此功能将在后续版本中实现，用于只读查看本地 JSON 文件
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
