"use server";

import { getWorkoutAction } from "@/actions/actions";
import { WorkoutDisplayer } from "./WorkoutDisplayer";

export default async function WorkoutPage({ params: { id } }: { params: { id: string } }) {
	const w = await getWorkoutAction({ id: parseInt(id) });

	if (!w) return "Workout not found";

	w.sets.sort((s1, s2) => (s1.index < s2.index ? -1 : 1));

	w.sets.forEach((s) => {
		s.reps.sort((s1, s2) => (s1.index < s2.index ? -1 : 1));
	});

	return <WorkoutDisplayer workout={w} />;
}
