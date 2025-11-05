import { Workout } from "@/lib/types";
type WorkoutListProps = {
  workouts: Workout[];
  onToggleCompletion: (id: string) => void;
  onDelete: (id: string) => void;
};

const categoryLabels: Record<Workout["category"], string> = {
  strength: "Strength",
  cardio: "Cardio",
  mobility: "Mobility",
  sports: "Sports",
  other: "Other",
};

const intensityColor: Record<Workout["intensity"], string> = {
  light: "bg-emerald-100 text-emerald-700",
  moderate: "bg-sky-100 text-sky-700",
  intense: "bg-rose-100 text-rose-700",
};

export const WorkoutList = ({
  workouts,
  onDelete,
  onToggleCompletion,
}: WorkoutListProps) => {
  if (workouts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-10 text-center text-sm text-zinc-500">
        You have not logged any workouts yet. Track your first session to kick
        things off!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => {
        const date = new Date(workout.date);
        const formattedDate = date.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        return (
          <div
            key={workout.id}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-200/40 transition hover:border-violet-200 hover:shadow-md"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg font-semibold text-zinc-900">
                    {workout.name}
                  </p>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    {categoryLabels[workout.category]}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${intensityColor[workout.intensity]}`}
                  >
                    {workout.intensity} intensity
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                  <span>{formattedDate}</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-300" />
                  <span>{workout.durationMinutes} min</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-300" />
                  <span>{workout.calories} kcal</span>
                  {workout.completed ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                      Planned
                    </span>
                  )}
                </div>
                {workout.notes ? (
                  <p className="max-w-2xl text-sm text-zinc-600">
                    {workout.notes}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center gap-2 self-end md:self-start">
                <button
                  onClick={() => onToggleCompletion(workout.id)}
                  className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                >
                  Mark {workout.completed ? "planned" : "complete"}
                </button>
                <button
                  onClick={() => onDelete(workout.id)}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-100"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
