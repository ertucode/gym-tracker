import { allExercises } from "@/actions/actions";
import { createContext, useContext, useEffect, useState } from "react";

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

export function ExercisesContextProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<Exercise[] | null>(null);

	useEffect(() => {
		allExercises().then((e) => {
			setState(e);
		});
	}, []);

	return <ExercisesContext.Provider value={state}>{children}</ExercisesContext.Provider>;
}
