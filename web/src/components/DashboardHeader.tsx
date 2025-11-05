type DashboardHeaderProps = {
  lastUpdated: string;
  totalWorkouts: number;
  onReset: () => void;
};

export const DashboardHeader = ({
  lastUpdated,
  totalWorkouts,
  onReset,
}: DashboardHeaderProps) => {
  const formatted = lastUpdated
    ? new Date(lastUpdated).toLocaleString()
    : "Never";

  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-rose-500 p-8 text-white shadow-lg shadow-violet-600/30 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
          Fitness tracker
        </p>
        <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
          Stay on top of your training game
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/80">
          Log workouts, track wellness habits, and keep goals front and center.
          Your progress is saved locally to keep your routine focused.
        </p>
      </div>
      <div className="rounded-2xl bg-white/15 p-5 text-sm backdrop-blur">
        <p className="text-white/80">Last updated</p>
        <p className="mt-1 text-lg font-semibold">{formatted}</p>
        <p className="mt-3 text-white/80">
          Total workouts logged:{" "}
          <span className="font-semibold text-white">{totalWorkouts}</span>
        </p>
        <button
          onClick={onReset}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/30"
        >
          Reset data
        </button>
      </div>
    </div>
  );
};
