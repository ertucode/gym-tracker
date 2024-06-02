import { InferInsertModel } from "drizzle-orm";
import { BodyParts, ExerciseBodyParts, Exercises } from "../schema";
import { db } from "../db";

export async function seedExercises() {
	const insertedExercises = await db
		.insert(Exercises)
		.values(data)
		.returning({ id: Exercises.id, name: Exercises.name });

	const bodyParts = [
		...new Set(data.flatMap((v) => v.bodyParts).filter((v): v is string => !!v)),
	].map((name) => ({ name }));

	await db.insert(BodyParts).values(bodyParts);

	const mappings: ExerciseBodyPart[] = [];

	for (const d of data) {
		if (d.bodyParts && d.bodyParts.length > 0) {
			const id = insertedExercises.find((e) => e.name === d.name)!.id;
			mappings.push(...d.bodyParts.map((p) => ({ exerciseId: id, bodyPart: p })));
		}
	}

	await db.insert(ExerciseBodyParts).values(mappings);
}

type Exercise = InferInsertModel<typeof Exercises> & { bodyParts?: string[] };
type ExerciseBodyPart = InferInsertModel<typeof ExerciseBodyParts>;

const data: Exercise[] = [
	{
		name: "Lateral Raise",
		bodyParts: ["shoulder", "side-delt"],
	},
	{
		name: "45 Lateral Raise",
		bodyParts: ["shoulder", "side-delt"],
	},
	{
		name: "Face pull",
		bodyParts: ["shoulder", "rear-delt"],
	},
	{
		name: "Bench Press",
		bodyParts: ["chest", "front-delt", "tricep"],
	},
	{
		name: "Incline Dumbell Press",
		bodyParts: ["chest", "upper-chest", "front-delt", "tricep"],
	},
	{
		name: "Assisted Pullup",
		assisted: true,
		bodyParts: ["back", "lower-trap", "trap", "bicep", "forearm"],
	},
	{
		name: "Dumbell Press",
		bodyParts: ["chest", "front-delt", "tricep"],
	},
	{
		name: "Seated Row",
		bodyParts: ["back", "lats", "bicep", "forearm"],
	},
	{
		name: "Cable Y Raise",
		bodyParts: ["shoulder", "rear-delt"],
	},
	{
		name: "Lying Leg Curl",
		bodyParts: ["leg", "hamstring"],
	},
	{
		name: "Seated Hamstring Curl",
		bodyParts: ["leg", "hamstring"],
	},
	{
		name: "Leg Extension",
		bodyParts: ["leg", "quad"],
	},
	{
		name: "Bulgarian Split Squat",
		bodyParts: ["leg", "quad", "glute"],
	},
	{
		name: "Dumbell Reverse Lunge",
		bodyParts: ["leg", "quad", "glute"],
	},
	{
		name: "Leg Press",
		bodyParts: ["leg", "quad"],
	},
	{
		name: "Glute Kick Back",
		bodyParts: ["leg", "glute"],
	},
	{
		name: "Incline Bicep Curl",
		bodyParts: ["bicep", "forearm"],
	},
	{
		name: "Z Bar Curl",
		bodyParts: ["bicep", "forearm"],
	},
	{
		name: "Bicep Cable Curl",
		bodyParts: ["bicep", "forearm"],
	},
	{
		name: "Dumbell Skull Crusher",
		bodyParts: ["tricep"],
	},
	{
		name: "Tricep Pushdown",
		bodyParts: ["tricep"],
	},
	{
		name: "Underhand Wide Seated Row",
		bodyParts: ["back", "forearm"],
	},
	{
		name: "Assisted Dip",
		bodyParts: ["chest", "lower-chest", "tricep"],
		assisted: true,
	},
	{
		name: "Assisted Narrow Pullup",
		bodyParts: ["back", "lats", "bicep"],
		assisted: true,
	},
];
