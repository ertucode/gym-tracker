import { getWorkoutsForMonth } from "@/actions/actions";

export type MonthWorkout = Awaited<ReturnType<typeof getWorkoutsForMonth>>[number];
