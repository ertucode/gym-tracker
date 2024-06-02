"use client";

import { getWorkoutsForMonth } from "@/actions/actions";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

type Workout = Awaited<ReturnType<typeof getWorkoutsForMonth>>[number];

const WorkoutsContext = createContext<{
	workouts: Workout[];
	setWorkouts: Dispatch<SetStateAction<Workout[]>>;
}>(undefined as unknown as any);

export function useWorkouts() {
	return useContext(WorkoutsContext);
}

export function WorkoutContextProvider({ children }: { children: React.ReactNode }) {
	const [workouts, setWorkouts] = useState<Workout[]>([]);

	return (
		<WorkoutsContext.Provider value={{ workouts, setWorkouts }}>
			{children}
		</WorkoutsContext.Provider>
	);
}
