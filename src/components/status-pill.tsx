const colors: Record<string, string> = {
  待处理: "bg-amber-50 text-amber-700 border-amber-200",
  修改中: "bg-blue-50 text-blue-700 border-blue-200",
  待确认: "bg-violet-50 text-violet-700 border-violet-200",
  已完成: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function StatusPill({ value }: { value: string }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${colors[value] || colors["修改中"]}`}>{value}</span>;
}
