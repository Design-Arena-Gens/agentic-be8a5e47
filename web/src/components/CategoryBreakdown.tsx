type CategoryBreakdownProps = {
  categories: Record<string, number>;
};

const colors = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-sky-500",
];

export const CategoryBreakdown = ({
  categories,
}: CategoryBreakdownProps) => {
  const entries = Object.entries(categories);
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-10 text-center text-sm text-zinc-500">
        Log workouts to map out how you balance your training categories.
      </div>
    );
  }

  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-200/40">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-zinc-900">
          Training mix snapshot
        </h3>
        <p className="text-sm text-zinc-500">
          Distribution of logged sessions across categories.
        </p>
      </div>

      <div className="relative mb-6 flex h-12 overflow-hidden rounded-full bg-zinc-100">
        {entries.map(([category, count], index) => (
          <div
            key={category}
            className={`flex items-center justify-center text-xs font-semibold uppercase tracking-wide text-white ${colors[index % colors.length]}`}
            style={{ width: `${(count / total) * 100}%` }}
          >
            {Math.round((count / total) * 100)}%
          </div>
        ))}
      </div>

      <ul className="grid gap-3 md:grid-cols-2">
        {entries.map(([category, count], index) => (
          <li
            key={category}
            className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm"
          >
            <div className="flex items-center gap-3">
              <span
                className={`h-3 w-3 rounded-full ${colors[index % colors.length]}`}
              />
              <span className="capitalize text-zinc-600">{category}</span>
            </div>
            <span className="font-semibold text-zinc-900">
              {count} {count === 1 ? "session" : "sessions"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
