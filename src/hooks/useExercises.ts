import { allExercises } from "@/actions/actions";
import { useEffect, useState } from "react";

type Exercise = Awaited<ReturnType<typeof allExercises>>[number];

export function useExercises() {
	const [state, setState] = useState<Exercise[] | null>(null);

	useEffect(() => {
		allExercises().then(setState);
	}, []);

	function exerciseName(id: number) {
		if (state == null) return;

		return state.find((e) => e.id === id)?.name;
	}

	return { exercises: state, exerciseName };
}
