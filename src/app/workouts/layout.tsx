"use server";

import { allExercises } from "@/actions/actions";
import { WorkoutContextProvider } from "./workouts";
import { ExercisesContextProvider } from "@/hooks/useExercises";
import { WorkoutLayoutClientSide } from "./layout-clientside";

export default async function WorkoutsLayout({ children }: { children: React.ReactNode }) {
	const exercises = await allExercises();

	return (
		<div className="flex flex-col items-start">
			<WorkoutContextProvider>
				<ExercisesContextProvider exercises={exercises}>
					<WorkoutLayoutClientSide>{children}</WorkoutLayoutClientSide>
				</ExercisesContextProvider>
			</WorkoutContextProvider>
		</div>
	);
}
