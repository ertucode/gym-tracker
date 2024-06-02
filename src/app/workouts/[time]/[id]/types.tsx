import { getWorkoutAction } from "@/actions/actions";
import { Dispatch, SetStateAction } from "react";

export type Workout = Exclude<Awaited<ReturnType<typeof getWorkoutAction>>, undefined>;
export type WorkoutSet = Workout["sets"][number];
export type Rep = Workout["sets"][number]["reps"][number];
export type SetWorkoutFn = Dispatch<SetStateAction<Workout | null>>;
