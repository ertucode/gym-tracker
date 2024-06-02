"use client";

import { createSetAction } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useExercises } from "@/hooks/useExercises";
import { FormEvent, useState } from "react";
import { WorkoutSetDisplayer } from "./WorkoutSetDisplayer";
import { Workout } from "./types";
import { newIndex } from "./helpers";

export function WorkoutDisplayer({ workout: _workout }: { workout: Workout }) {
	const [workout, setWorkout] = useState<Workout | null>(_workout);

	const createSet = async (e: FormEvent<HTMLFormElement>) => {
		if (workout == null) return;
		e.preventDefault();
		const value = Object.fromEntries(new FormData(e.currentTarget));
		const workoutId = workout.id;
		const exerciseId = parseInt(value.exerciseId.toString());
		const index = workout === null ? 0 : newIndex(workout.sets);

		const body = { workoutId, exerciseId, index };
		const result = await createSetAction(body);

		setWorkout((w) => {
			if (w === null) return w;

			w.sets = [
				...w.sets,
				{
					id: result[0].id,
					note: null,
					index,
					workoutId,
					exerciseId,
					reps: [],
				},
			];
			return { ...w };
		});
	};

	const { exercises } = useExercises();

	const [exercise, setExercise] = useState<Exclude<typeof exercises, null>[number] | null>(null);

	return (
		<div>
			<div>
				<div className="flex flex-col gap-6">
					{workout?.sets.map((s) => {
						return <WorkoutSetDisplayer key={s.id} s={s} setWorkout={setWorkout} />;
					})}
				</div>
			</div>
			<form className="flex flex-col items-start gap-3" onSubmit={createSet}>
				{exercises && (
					<label>
						Exercise
						<Select
							onValueChange={(e) => {
								const id = parseInt(e);
								setExercise(exercises.find((e) => e.id === id)!);
							}}
							name="exerciseId"
						>
							<SelectTrigger>{exercise?.name ?? "Select"}</SelectTrigger>
							<SelectContent>
								{exercises.map((e) => (
									<SelectItem key={e.id} value={e.id.toString()}>
										{e.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</label>
				)}
				<Button>Create Set</Button>
			</form>
		</div>
	);
}
