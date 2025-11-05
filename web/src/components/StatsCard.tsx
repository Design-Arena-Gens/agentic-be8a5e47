type StatsCardProps = {
  label: string;
  value: string;
  sublabel?: string;
  accent?: "blue" | "green" | "orange" | "pink";
};

const accentClasses: Record<NonNullable<StatsCardProps["accent"]>, string> = {
  blue: "from-sky-500/15 via-sky-500/5 to-transparent text-sky-600",
  green: "from-emerald-500/15 via-emerald-500/5 to-transparent text-emerald-600",
  orange: "from-orange-500/15 via-orange-500/5 to-transparent text-orange-600",
  pink: "from-pink-500/15 via-pink-500/5 to-transparent text-pink-600",
};

export const StatsCard = ({
  label,
  value,
  sublabel,
  accent = "blue",
}: StatsCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-200/40">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentClasses[accent]}`}
      />
      <div className="relative space-y-2">
        <p className="text-sm font-medium text-zinc-500">{label}</p>
        <p className="text-3xl font-semibold text-zinc-900">{value}</p>
        {sublabel ? (
          <p className="text-sm text-zinc-500">{sublabel}</p>
        ) : null}
      </div>
    </div>
  );
};
