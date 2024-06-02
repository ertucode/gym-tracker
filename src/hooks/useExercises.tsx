"use client";

import { allExercises } from "@/actions/actions";
import { createContext, useContext } from "react";

type Exercise = Awaited<ReturnType<typeof allExercises>>[number];

export function useExercises() {
	const exercises = useContext(ExercisesContext);

	function exerciseName(id: number) {
		if (exercises == null) return;

		return exercises.find((e) => e.id === id)?.name;
	}
	return { exercises, exerciseName };
}

const ExercisesContext = createContext<Exercise[] | null>(null);

export function ExercisesContextProvider({
	exercises,
	children,
}: {
	children: React.ReactNode;
	exercises: Exercise[];
}) {
	return <ExercisesContext.Provider value={exercises}>{children}</ExercisesContext.Provider>;
}
