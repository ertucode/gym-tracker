import { db } from "./db";
import { BodyParts, ExerciseBodyParts, Exercises, Reps, Sets, Workouts } from "./schema";
import { seedExercises } from "./seed/exercises";

export async function seed() {
	await db.delete(Exercises);
	await db.delete(BodyParts);
	await db.delete(ExerciseBodyParts);
	await db.delete(Sets);
	await db.delete(Reps);
	await db.delete(Workouts);

	await seedExercises();
}

seed();
