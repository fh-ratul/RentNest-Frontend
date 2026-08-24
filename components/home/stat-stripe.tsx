type Stat = { label: string; value: string };

export default function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid rounded-2xl border bg-card shadow-sm sm:grid-cols-3 sm:divide-x">
      {stats.map((s) => (
        <div key={s.label} className="border-b p-5 text-center last:border-b-0 sm:border-b-0 sm:p-6">
          <p className="text-2xl font-bold tracking-tight sm:text-3xl">{s.value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
