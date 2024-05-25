"use server";

import { db } from "@/db/db";
import { Exercises, Reps, Sets, Workouts } from "@/db/schema";

export type CreateWorkout = {
	startDate: Date;
	endDate?: Date;
};
export async function createWorkoutAction(request: CreateWorkout) {
	return await db
		.insert(Workouts)
		.values({
			startDate: request.startDate.getTime().toString(),
			endDate: request.endDate?.getTime().toString(),
		})
		.returning({ id: Workouts.id });
}

export type CreateSet = {
	workoutId: number;
	exerciseId: number;
	index: number;
};
export async function createSetAction(create: CreateSet) {
	return db
		.insert(Sets)
		.values({
			workoutId: create.workoutId,
			exerciseId: create.exerciseId,
			index: create.index,
		})
		.returning({ id: Sets.id });
}

export type CreateExercise = {
	name: string;
};
export async function createExerciseAction(request: CreateExercise) {
	return db
		.insert(Exercises)
		.values({
			name: request.name,
		})
		.returning({ id: Exercises.id });
}

export type CreateRep = {
	count: number;
	index: number;
	setId: number;
};
export async function createRepAction(request: CreateRep) {
	return db
		.insert(Reps)
		.values({
			count: request.count,
			setId: request.setId,
			index: request.index,
		})
		.returning({ id: Reps.id });
}
