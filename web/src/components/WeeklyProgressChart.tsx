import { memo } from "react";

type WeeklyProgress = {
  label: string;
  minutes: number;
  calories: number;
  sessions: number;
};

type WeeklyProgressChartProps = {
  data: WeeklyProgress[];
};

const getMaxValue = (data: WeeklyProgress[]) =>
  Math.max(...data.map((item) => item.minutes), 60);

export const WeeklyProgressChart = memo(({ data }: WeeklyProgressChartProps) => {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-10 text-center text-sm text-zinc-500">
        Start logging workouts to see your weekly trends.
      </div>
    );
  }

  const maxMinutes = getMaxValue(data);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-200/40">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">
            Weekly Training Volume
          </h3>
          <p className="text-sm text-zinc-500">
            Minutes trained per week with calorie and session insights.
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        {data.map((item) => {
          const percentage = Math.round((item.minutes / maxMinutes) * 100);
          return (
            <div key={item.label} className="flex flex-col">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-zinc-500">
                  {item.label}
                </span>
                <span className="text-xs text-zinc-400">
                  {item.sessions}{" "}
                  {item.sessions === 1 ? "session" : "sessions"}
                </span>
              </div>
              <div className="mt-3 h-40 rounded-xl bg-zinc-100">
                <div
                  className="flex h-full flex-col justify-end rounded-xl bg-gradient-to-t from-violet-500 via-violet-400 to-sky-300 transition-all"
                  style={{ height: `${percentage}%` }}
                >
                  <div className="rounded-xl bg-white/90 px-2 py-1 text-center text-xs font-medium text-violet-600">
                    {item.minutes} min
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-zinc-500">
                <span className="font-medium text-emerald-600">
                  {item.calories} kcal
                </span>{" "}
                burned
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

WeeklyProgressChart.displayName = "WeeklyProgressChart";
