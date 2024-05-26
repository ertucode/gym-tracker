"use server";

import { Month } from "@/components/date-utils";
import { db } from "@/db/db";
import { Exercises, Reps, Sets, Workouts } from "@/db/schema";
import { DateUtil } from "@/utils/date-utils";

export type CreateWorkout = {
	startDate: Date;
	endDate?: Date;
};
export async function createWorkoutAction(request: CreateWorkout) {
	return await db
		.insert(Workouts)
		.values({
			startDate: request.startDate,
			endDate: request.endDate,
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

export type GetWorkoutsForDay = {
	time: number;
};
export async function getWorkoutsForDay(request: GetWorkoutsForDay) {
	const date = new DateUtil(request.time);

	return db.query.Workouts.findMany({
		where: (workouts, { and, gte, lte }) =>
			and(gte(workouts.startDate, date.dayStart()), lte(workouts.endDate, date.dayEnd())),
	});
}

export type GetWorkoutsForMonth = {
	month: Month;
};
export async function getWorkoutsForMonth({ month }: GetWorkoutsForMonth) {
	const date = new DateUtil(month.year, month.month);

	return db.query.Workouts.findMany({
		where: (workouts, { and, gte, lte }) =>
			and(gte(workouts.startDate, date.monthStart()), lte(workouts.endDate, date.monthEnd())),
	});
}
