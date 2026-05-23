export function SystemModeBadge() {
  return (
    <div className="flex items-center gap-2">
      <span className="rounded bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
        本地只读
      </span>
      <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">
        JSON 数据源
      </span>
      <span className="rounded bg-gray-500/10 px-2 py-0.5 text-xs text-gray-400">
        无登录
      </span>
      <span className="rounded bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-400">
        AI 未启用
      </span>
    </div>
  );
}
