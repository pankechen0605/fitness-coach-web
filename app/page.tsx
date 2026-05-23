import { WeeklySummaryCards } from '@/components/dashboard/WeeklySummaryCards';
import { RecentTrainingList } from '@/components/dashboard/RecentTrainingList';
import { MVPStatusCard } from '@/components/dashboard/MVPStatusCard';
import { CoachConsole } from '@/components/coach/CoachConsole';
import { DashboardSummary, TrainingRepository, mockCoachResponses } from '@/lib/data';

export default async function HomePage() {
  const [weeklySummary, recentTrainingRecords] = await Promise.all([
    DashboardSummary.getWeeklySummary(),
    TrainingRepository.getRecent(5),
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-100">欢迎回来</h2>
        <p className="mt-1 text-sm text-gray-400">
          数据驱动的训练管理 · 本地优先 · 无需登录
        </p>
      </div>

      {/* Weekly Summary */}
      <WeeklySummaryCards summary={weeklySummary} />

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: AI Command + Output */}
        <CoachConsole responses={mockCoachResponses} />

        {/* Middle column: Recent Training */}
        <RecentTrainingList records={recentTrainingRecords} />

        {/* Right column: MVP Status */}
        <MVPStatusCard />
      </div>
    </div>
  );
}
