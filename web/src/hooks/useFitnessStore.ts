import { useCallback, useEffect, useMemo, useState } from "react";
import { readSnapshot, writeSnapshot } from "@/lib/storage";
import {
  DailyWellness,
  FitnessGoal,
  FitnessSnapshot,
  Workout,
} from "@/lib/types";

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const computeSnapshot = (snapshot: FitnessSnapshot): FitnessSnapshot => ({
  ...snapshot,
  workouts: [...snapshot.workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  ),
  wellness: [...snapshot.wellness].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  ),
  goals: [...snapshot.goals].sort(
    (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime(),
  ),
  lastUpdated: new Date().toISOString(),
});

export const useFitnessStore = () => {
  const [snapshot, setSnapshot] = useState<FitnessSnapshot>(() =>
    computeSnapshot(readSnapshot()),
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating snapshot from localStorage on the client requires a post-mount state sync.
    setSnapshot((prev) => {
      const current = computeSnapshot(readSnapshot());
      const same =
        JSON.stringify(prev.workouts) === JSON.stringify(current.workouts) &&
        JSON.stringify(prev.wellness) === JSON.stringify(current.wellness) &&
        JSON.stringify(prev.goals) === JSON.stringify(current.goals);
      if (same) {
        return prev;
      }
      return current;
    });
  }, []);

  const updateSnapshot = useCallback((updater: (draft: FitnessSnapshot) => void) => {
    setSnapshot((prev) => {
      const draft: FitnessSnapshot = JSON.parse(JSON.stringify(prev));
      updater(draft);
      const computed = computeSnapshot(draft);
      writeSnapshot(computed);
      return computed;
    });
  }, []);

  const resetStore = useCallback(() => {
    const blank: FitnessSnapshot = {
      workouts: [],
      wellness: [],
      goals: [],
      lastUpdated: new Date().toISOString(),
    };
    const computed = computeSnapshot(blank);
    writeSnapshot(computed);
    setSnapshot(computed);
  }, []);

  const addWorkout = useCallback(
    (workout: Omit<Workout, "id" | "completed">) => {
      updateSnapshot((draft) => {
        draft.workouts.unshift({
          ...workout,
          id: createId(),
          completed: true,
        });
      });
    },
    [updateSnapshot],
  );

  const toggleWorkoutCompletion = useCallback(
    (id: string) => {
      updateSnapshot((draft) => {
        const target = draft.workouts.find((item) => item.id === id);
        if (target) {
          target.completed = !target.completed;
        }
      });
    },
    [updateSnapshot],
  );

  const removeWorkout = useCallback(
    (id: string) => {
      updateSnapshot((draft) => {
        draft.workouts = draft.workouts.filter((item) => item.id !== id);
      });
    },
    [updateSnapshot],
  );

  const addWellnessEntry = useCallback(
    (entry: Omit<DailyWellness, "id">) => {
      updateSnapshot((draft) => {
        const existingIndex = draft.wellness.findIndex(
          (item) => item.date === entry.date,
        );
        const payload = { ...entry, id: createId() };
        if (existingIndex >= 0) {
          draft.wellness[existingIndex] = payload;
        } else {
          draft.wellness.unshift(payload);
        }
      });
    },
    [updateSnapshot],
  );

  const addGoal = useCallback(
    (goal: Omit<FitnessGoal, "id" | "createdAt" | "currentValue">) => {
      updateSnapshot((draft) => {
        draft.goals.push({
          ...goal,
          id: createId(),
          createdAt: new Date().toISOString(),
          currentValue: 0,
        });
      });
    },
    [updateSnapshot],
  );

  const updateGoalProgress = useCallback(
    (id: string, currentValue: number) => {
      updateSnapshot((draft) => {
        const target = draft.goals.find((item) => item.id === id);
        if (target) {
          target.currentValue = currentValue;
        }
      });
    },
    [updateSnapshot],
  );

  const removeGoal = useCallback(
    (id: string) => {
      updateSnapshot((draft) => {
        draft.goals = draft.goals.filter((goal) => goal.id !== id);
      });
    },
    [updateSnapshot],
  );

  const derived = useMemo(() => {
    const totalWorkouts = snapshot.workouts.length;
    const totalMinutes = snapshot.workouts.reduce(
      (sum, workout) => sum + workout.durationMinutes,
      0,
    );
    const totalCalories = snapshot.workouts.reduce(
      (sum, workout) => sum + workout.calories,
      0,
    );

    const workoutsByWeek = new Map<string, Workout[]>();
    snapshot.workouts.forEach((workout) => {
      const date = new Date(workout.date);
      const firstDayOfWeek = new Date(date);
      firstDayOfWeek.setDate(date.getDate() - date.getDay());
      firstDayOfWeek.setHours(0, 0, 0, 0);
      const key = firstDayOfWeek.toISOString().split("T")[0];
      if (!workoutsByWeek.has(key)) {
        workoutsByWeek.set(key, []);
      }
      workoutsByWeek.get(key)?.push(workout);
    });

    const weeklySeries = Array.from(workoutsByWeek.entries())
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([weekStart, workouts]) => ({
        weekStart,
        minutes: workouts.reduce(
          (sum, workout) => sum + workout.durationMinutes,
          0,
        ),
        calories: workouts.reduce((sum, workout) => sum + workout.calories, 0),
        sessions: workouts.length,
      }));

    const categories = snapshot.workouts.reduce(
      (acc, workout) => {
        acc[workout.category] = (acc[workout.category] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    let hydrationStreak = 0;
    for (const entry of snapshot.wellness) {
      if (entry.waterLiters >= 2) {
        hydrationStreak += 1;
      } else {
        break;
      }
    }

    return {
      totalWorkouts,
      totalMinutes,
      totalCalories,
      weeklySeries,
      categories,
      hydrationStreak,
    };
  }, [snapshot]);

  return {
    snapshot,
    ...derived,
    resetStore,
    addWorkout,
    toggleWorkoutCompletion,
    removeWorkout,
    addWellnessEntry,
    addGoal,
    updateGoalProgress,
    removeGoal,
  };
};
