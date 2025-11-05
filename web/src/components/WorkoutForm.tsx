import { FormEvent, useMemo, useState } from "react";
import { WorkoutIntensity } from "@/lib/types";

const workoutCategories = [
  { value: "strength", label: "Strength" },
  { value: "cardio", label: "Cardio" },
  { value: "mobility", label: "Mobility" },
  { value: "sports", label: "Sports" },
  { value: "other", label: "Other" },
] as const;

type WorkoutFormProps = {
  onSubmit: (payload: {
    name: string;
    date: string;
    category: (typeof workoutCategories)[number]["value"];
    intensity: WorkoutIntensity;
    durationMinutes: number;
    calories: number;
    notes?: string;
  }) => void;
};

type WorkoutFormState = {
  name: string;
  date: string;
  category: (typeof workoutCategories)[number]["value"];
  intensity: WorkoutIntensity;
  durationMinutes: number;
  calories: number;
  notes: string;
};

const defaultState = (): WorkoutFormState => ({
  name: "",
  date: new Date().toISOString().split("T")[0],
  category: workoutCategories[0].value,
  intensity: "moderate",
  durationMinutes: 45,
  calories: 350,
  notes: "",
});

export const WorkoutForm = ({ onSubmit }: WorkoutFormProps) => {
  const [form, setForm] = useState<WorkoutFormState>(defaultState);
  const [isSaving, setIsSaving] = useState(false);

  const isValid = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.durationMinutes > 0 &&
      form.calories >= 0 &&
      Boolean(form.date)
    );
  }, [form]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) {
      return;
    }
    setIsSaving(true);
    window.setTimeout(() => {
      onSubmit({
        name: form.name.trim(),
        date: form.date,
        category: form.category,
        intensity: form.intensity,
        durationMinutes: form.durationMinutes,
        calories: form.calories,
        notes: form.notes?.trim() || undefined,
      });
      setForm(defaultState());
      setIsSaving(false);
    }, 180);
  };

  return (
    <form
      className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-200/50"
      onSubmit={handleSubmit}
    >
      <div>
        <h3 className="text-lg font-semibold text-zinc-900">Log a workout</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Capture key details about your training session to keep your progress
          up to date.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Activity name
          <input
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner shadow-zinc-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="Morning run, push session..."
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Date
          <input
            type="date"
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner shadow-zinc-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            value={form.date}
            max={new Date().toISOString().split("T")[0]}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, date: event.target.value }))
            }
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Category
          <select
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner shadow-zinc-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            value={form.category}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                category: event.target.value as (typeof workoutCategories)[number]["value"],
              }))
            }
          >
            {workoutCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Intensity
          <div className="flex gap-2">
            {(["light", "moderate", "intense"] satisfies WorkoutIntensity[]).map(
              (option) => {
                const isActive = form.intensity === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, intensity: option }))
                    }
                    className={`flex-1 rounded-xl border px-3 py-2 text-sm capitalize transition ${
                      isActive
                        ? "border-violet-500 bg-violet-500 text-white shadow"
                        : "border-zinc-200 bg-white text-zinc-600 hover:border-violet-300 hover:text-zinc-800"
                    }`}
                  >
                    {option}
                  </button>
                );
              },
            )}
          </div>
        </label>

        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Duration (minutes)
          <input
            type="number"
            min={1}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner shadow-zinc-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            value={form.durationMinutes}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                durationMinutes: Number(event.target.value),
              }))
            }
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Calories burned
          <input
            type="number"
            min={0}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner shadow-zinc-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            value={form.calories}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                calories: Number(event.target.value),
              }))
            }
          />
        </label>
        <div className="flex flex-col justify-end">
          <button
            type="submit"
            disabled={!isValid || isSaving}
            className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow shadow-violet-600/30 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-violet-300"
          >
            {isSaving ? "Saving..." : "Save workout"}
          </button>
        </div>
      </div>

      <label className="space-y-1 text-sm font-medium text-zinc-700">
        Notes
        <textarea
          rows={3}
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner shadow-zinc-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
          value={form.notes}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, notes: event.target.value }))
          }
          placeholder="Key lifts, intervals, how you felt..."
        />
      </label>
    </form>
  );
};
