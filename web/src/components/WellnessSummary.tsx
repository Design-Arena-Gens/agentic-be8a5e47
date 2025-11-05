import { DailyWellness } from "@/lib/types";
import { FormEvent, useMemo, useState } from "react";

type WellnessSummaryProps = {
  entries: DailyWellness[];
  onSubmit: (entry: Omit<DailyWellness, "id">) => void;
};

type WellnessFormState = Omit<DailyWellness, "id">;

const defaultEntry = (): WellnessFormState => {
  const today = new Date().toISOString().split("T")[0];
  return {
    date: today,
    sleepHours: 7.5,
    waterLiters: 2,
    mood: "balanced",
    energyLevel: 6,
  };
};

export const WellnessSummary = ({ entries, onSubmit }: WellnessSummaryProps) => {
  const [form, setForm] = useState<WellnessFormState>(defaultEntry);
  const [saving, setSaving] = useState(false);

  const latest = entries[0];

  const averageSleep = useMemo(() => {
    if (!entries.length) return 0;
    const total = entries.reduce((sum, item) => sum + item.sleepHours, 0);
    return total / entries.length;
  }, [entries]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    window.setTimeout(() => {
      onSubmit(form);
      setForm(defaultEntry());
      setSaving(false);
    }, 180);
  };

  return (
    <div className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-200/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">
            Daily wellness
          </h3>
          <p className="text-sm text-zinc-500">
            Balance recovery, hydration, and energy to support your training.
          </p>
        </div>
        <div className="text-right text-sm text-zinc-500">
          Avg sleep:{" "}
          <span className="font-semibold text-violet-600">
            {averageSleep.toFixed(1)}h
          </span>
        </div>
      </div>

      {latest ? (
        <div className="grid gap-3 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-600 md:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Last entry
            </p>
            <p className="mt-1 text-zinc-800">
              {new Date(latest.date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Sleep
            </p>
            <p className="mt-1 text-zinc-800">{latest.sleepHours} hours</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Hydration
            </p>
            <p className="mt-1 text-zinc-800">
              {latest.waterLiters.toFixed(1)} L
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Mood
            </p>
            <p className="mt-1 text-zinc-800 capitalize">{latest.mood}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
          Log your first wellness entry to see an overview here.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-5 md:items-end"
      >
        <label className="space-y-1 text-sm font-medium text-zinc-700 md:col-span-2">
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
        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Sleep (h)
          <input
            type="number"
            min={0}
            step={0.5}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner shadow-zinc-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            value={form.sleepHours}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                sleepHours: Number(event.target.value),
              }))
            }
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Water (L)
          <input
            type="number"
            min={0}
            step={0.1}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner shadow-zinc-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            value={form.waterLiters}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                waterLiters: Number(event.target.value),
              }))
            }
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Energy (1-10)
          <input
            type="number"
            min={1}
            max={10}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner shadow-zinc-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            value={form.energyLevel}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                energyLevel: Number(event.target.value),
              }))
            }
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Mood
          <select
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner shadow-zinc-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            value={form.mood}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                mood: event.target.value as typeof form.mood,
              }))
            }
          >
            <option value="low">Low</option>
            <option value="balanced">Balanced</option>
            <option value="energized">Energized</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={saving}
          className="md:col-span-5 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow shadow-emerald-600/30 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300 md:col-start-auto"
        >
          {saving ? "Saving..." : "Save wellness entry"}
        </button>
      </form>
    </div>
  );
};
