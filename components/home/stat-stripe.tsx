import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";

type Stat = { label: string; value: number; prefix?: string; suffix?: string; hint?: string };

export default function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid sm:grid-cols-3 sm:divide-x">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 90} className="px-6 py-8 text-center sm:py-4">
          <p className="font-heading text-5xl font-normal tracking-tight text-primary sm:text-6xl">
            <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
          </p>
          <p className="mt-3 text-sm font-semibold">{s.label}</p>
          {s.hint && <p className="mt-0.5 text-sm text-muted-foreground">{s.hint}</p>}
        </Reveal>
      ))}
    </div>
  );
}
