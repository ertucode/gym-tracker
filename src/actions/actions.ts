"use server";

import { Month } from "@/components/date-utils";
import { db } from "@/db/db";
import { Exercises, Reps, Sets, Workouts } from "@/db/schema";
import { DateUtil } from "@/utils/date-utils";
import { InferInsertModel, and, eq } from "drizzle-orm";
import { withLogging } from "./with-logging";

export type CreateWorkout = {
	startDate: Date;
	endDate?: Date;
};
export async function createWorkoutAction(request: CreateWorkout) {
	return withLogging(async () => {
		return await db
			.insert(Workouts)
			.values({
				startDate: request.startDate,
				endDate: request.endDate,
			})
			.returning({ id: Workouts.id });
	});
}

export type CreateSet = {
	workoutId: number;
	exerciseId: number;
	index: number;
};
export async function createSetAction(create: CreateSet) {
	return withLogging(async () => {
		return db
			.insert(Sets)
			.values({
				workoutId: create.workoutId,
				exerciseId: create.exerciseId,
				index: create.index,
			})
			.returning({ id: Sets.id });
	});
}

export type CreateExercise = {
	name: string;
};
export async function createExerciseAction(request: CreateExercise) {
	return withLogging(async () => {
		return db
			.insert(Exercises)
			.values({
				name: request.name,
			})
			.returning({ id: Exercises.id });
	});
}

export type CreateRep = {
	count: number;
	index: number;
	setId: number;
	weight: number;
};
export async function createRepAction(request: CreateRep) {
	return withLogging(async () => {
		return db
			.insert(Reps)
			.values({
				count: request.count,
				setId: request.setId,
				index: request.index,
				weight: request.weight,
			})
			.returning({ id: Reps.id });
	});
}

export type GetWorkoutsForDay = {
	time: number;
};
export async function getWorkoutsForDay(request: GetWorkoutsForDay) {
	return withLogging(async () => {
		const date = new DateUtil(request.time);

		return db.query.Workouts.findMany({
			where: (workouts, { and, gte, lte }) =>
				and(
					gte(workouts.startDate, date.dayStart()),
					lte(workouts.startDate, date.dayEnd()),
					eq(Workouts.isDeleted, false),
				),
		});
	});
}

export type GetWorkoutsForMonth = {
	month: Month;
};
export async function getWorkoutsForMonth({ month }: GetWorkoutsForMonth) {
	return withLogging(async () => {
		const date = new DateUtil(month.year, month.month);

		return db.query.Workouts.findMany({
			where: (workouts, { and, gte, lte }) =>
				and(
					gte(workouts.startDate, date.monthStart()),
					lte(workouts.startDate, date.monthEnd()),
					eq(Workouts.isDeleted, false),
				),
		});
	});
}

export type UpdateWorkout = {
	id: number;
	startDate: Date;
	endDate?: Date | null;
	note?: string | null;
};
export async function updateWorkoutAction(request: UpdateWorkout) {
	return withLogging(async () => {
		return db
			.update(Workouts)
			.set({
				startDate: request.startDate,
				endDate: request.endDate,
				note: request.note,
				id: request.id,
			})
			.where(and(eq(Workouts.id, request.id), eq(Workouts.isDeleted, false)))
			.returning({ id: Workouts.id, startDate: Workouts.startDate, endDate: Workouts.endDate });
	});
}

export type DeleteWorkout = {
	id: number;
};
export async function deleteWorkoutAction(request: DeleteWorkout) {
	return withLogging(async () => {
		const item = await db.select().from(Workouts).where(eq(Workouts.id, request.id));
		if (!item) return;

		return db
			.update(Workouts)
			.set({ ...item, isDeleted: true })
			.where(eq(Workouts.id, request.id))
			.returning({ id: Workouts });
	});
}

export type GetWorkout = {
	id: number;
};
export async function getWorkoutAction(request: GetWorkout) {
	return withLogging(async () => {
		return db.query.Workouts.findFirst({
			where: eq(Workouts.id, request.id),
			with: {
				sets: {
					with: {
						reps: true,
					},
				},
			},
		});
	});
}

export async function allExercises() {
	return withLogging(async () => {
		return db.query.Exercises.findMany({
			with: {
				exerciseBodyParts: {
					columns: {
						bodyPart: true,
					},
				},
			},
			orderBy: Exercises.name,
		});
	});
}

export async function removeRepAction(id: number) {
	return withLogging(async () => {
		return db.delete(Reps).where(eq(Reps.id, id)).returning();
	});
}

export async function updateRepAction(request: InferInsertModel<typeof Reps> & { id: number }) {
	return withLogging(async () => {
		return db.update(Reps).set(request).where(eq(Reps.id, request.id!)).returning();
	});
}
export async function updateSetAction(request: InferInsertModel<typeof Sets> & { id: number }) {
	return withLogging(async () => {
		return db.update(Sets).set(request).where(eq(Sets.id, request.id!)).returning();
	});
}
