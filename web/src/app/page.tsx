'use client';

import { useMemo } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatsCard } from "@/components/StatsCard";
import { WorkoutForm } from "@/components/WorkoutForm";
import { WorkoutList } from "@/components/WorkoutList";
import { WeeklyProgressChart } from "@/components/WeeklyProgressChart";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { WellnessSummary } from "@/components/WellnessSummary";
import { GoalManager } from "@/components/GoalManager";
import { useFitnessStore } from "@/hooks/useFitnessStore";

const formatNumber = (value: number) =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(value);

const transformWeeklySeries = (
  series: ReturnType<typeof useFitnessStore>["weeklySeries"],
) => {
  return series.slice(-4).map((week) => {
    const date = new Date(week.weekStart);
    const label = date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    return {
      label,
      minutes: week.minutes,
      calories: week.calories,
      sessions: week.sessions,
    };
  });
};

export default function HomePage() {
  const fitness = useFitnessStore();

  const weeklyData = useMemo(
    () => transformWeeklySeries(fitness.weeklySeries),
    [fitness.weeklySeries],
  );

  return (
    <main className="min-h-screen bg-zinc-50 pb-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-12 pt-10 md:px-6 lg:px-8">
        <DashboardHeader
          lastUpdated={fitness.snapshot.lastUpdated}
          totalWorkouts={fitness.totalWorkouts}
          onReset={fitness.resetStore}
        />

        <section className="grid gap-4 md:grid-cols-3">
          <StatsCard
            label="Total workouts logged"
            value={String(fitness.totalWorkouts)}
            sublabel="Keep building consistency, one session at a time."
            accent="blue"
          />
          <StatsCard
            label="Minutes trained"
            value={`${formatNumber(fitness.totalMinutes)} min`}
            sublabel="Volume helps build capacity and resilience."
            accent="green"
          />
          <StatsCard
            label="Calories burned"
            value={`${formatNumber(fitness.totalCalories)} kcal`}
            sublabel={`Hydration streak: ${fitness.hydrationStreak} days`}
            accent="orange"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <WorkoutForm onSubmit={fitness.addWorkout} />
          <WellnessSummary
            entries={fitness.snapshot.wellness}
            onSubmit={fitness.addWellnessEntry}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <WeeklyProgressChart data={weeklyData} />
          <CategoryBreakdown categories={fitness.categories} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-zinc-900">
              Recent sessions
            </h2>
            <WorkoutList
              workouts={fitness.snapshot.workouts}
              onToggleCompletion={fitness.toggleWorkoutCompletion}
              onDelete={fitness.removeWorkout}
            />
          </div>
          <GoalManager
            goals={fitness.snapshot.goals}
            onCreateGoal={fitness.addGoal}
            onUpdateGoal={fitness.updateGoalProgress}
            onRemoveGoal={fitness.removeGoal}
          />
        </section>
      </div>
    </main>
  );
}
