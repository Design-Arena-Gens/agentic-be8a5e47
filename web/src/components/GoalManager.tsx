import { FitnessGoal } from "@/lib/types";
import { FormEvent, useState } from "react";

type GoalManagerProps = {
  goals: FitnessGoal[];
  onCreateGoal: (goal: {
    title: string;
    targetValue: number;
    unit: FitnessGoal["unit"];
    targetDate: string;
  }) => void;
  onUpdateGoal: (id: string, value: number) => void;
  onRemoveGoal: (id: string) => void;
};

const units: { label: string; value: FitnessGoal["unit"]; suffix: string }[] = [
  { label: "Workouts", value: "workouts", suffix: "sessions" },
  { label: "Minutes", value: "minutes", suffix: "minutes" },
  { label: "Calories", value: "calories", suffix: "kcal" },
];

const defaultGoal = () => ({
  title: "",
  unit: "workouts" as FitnessGoal["unit"],
  targetValue: 8,
  targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21)
    .toISOString()
    .split("T")[0],
});

export const GoalManager = ({
  goals,
  onCreateGoal,
  onUpdateGoal,
  onRemoveGoal,
}: GoalManagerProps) => {
  const [form, setForm] = useState(defaultGoal);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim()) {
      return;
    }
    onCreateGoal({
      title: form.title.trim(),
      unit: form.unit,
      targetValue: form.targetValue,
      targetDate: form.targetDate,
    });
    setForm(defaultGoal);
  };

  return (
    <div className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-200/40">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900">Goals & focus</h3>
        <p className="text-sm text-zinc-500">
          Define clear targets and update progress as you move through your
          training block.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-xl bg-zinc-50 p-4 md:grid-cols-[2fr_1fr_1fr_auto]"
      >
        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Goal title
          <input
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner shadow-zinc-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, title: event.target.value }))
            }
            placeholder="Run 5 times this week"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Target
          <input
            type="number"
            min={1}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner shadow-zinc-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            value={form.targetValue}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                targetValue: Number(event.target.value),
              }))
            }
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Unit
          <select
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner shadow-zinc-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            value={form.unit}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                unit: event.target.value as FitnessGoal["unit"],
              }))
            }
          >
            {units.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Target date
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner shadow-zinc-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            value={form.targetDate}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, targetDate: event.target.value }))
            }
          />
        </label>
        <button
          type="submit"
          className="h-fit self-end rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow shadow-violet-600/30 transition hover:bg-violet-500"
        >
          Add goal
        </button>
      </form>

      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
            No goals yet — set a target to stay focused.
          </div>
        ) : (
          goals.map((goal) => {
            const percentage = Math.min(
              100,
              Math.round((goal.currentValue / goal.targetValue) * 100),
            );
            const remaining = goal.targetValue - goal.currentValue;
            const unitMeta = units.find((unit) => unit.value === goal.unit);

            return (
              <div
                key={goal.id}
                className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-inner shadow-zinc-200/60 md:grid-cols-[2fr_1fr]"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-base font-semibold text-zinc-900">
                      {goal.title}
                    </h4>
                    <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                      Target {new Date(goal.targetDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <span>
                      {goal.currentValue} / {goal.targetValue}{" "}
                      {unitMeta?.suffix ?? ""}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-zinc-300" />
                    <span className="text-emerald-600">
                      {percentage}% complete
                    </span>
                    {remaining > 0 ? (
                      <>
                        <span className="h-1 w-1 rounded-full bg-zinc-300" />
                        <span>{remaining} remaining</span>
                      </>
                    ) : null}
                  </div>
                  <div className="h-2 rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-3 md:items-end">
                  <label className="w-full space-y-1 text-sm font-medium text-zinc-700 md:w-48">
                    Update progress
                    <input
                      type="number"
                      min={0}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner shadow-zinc-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
                      value={goal.currentValue}
                      onChange={(event) =>
                        onUpdateGoal(goal.id, Number(event.target.value))
                      }
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onRemoveGoal(goal.id)}
                      className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium uppercase tracking-wide text-rose-600 transition hover:bg-rose-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
