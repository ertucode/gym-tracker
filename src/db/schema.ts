import { relations } from "drizzle-orm";
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";

// TODO: exercise tags

export const Exercises = sqliteTable("exercises", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	name: text("text", { length: 50 }).notNull().unique(),
	assisted: integer("assisted", { mode: "boolean" }).default(false),
});

export const Workouts = sqliteTable("workouts", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	startDate: integer("startDate", { mode: "timestamp_ms" }).notNull(),
	endDate: integer("endDate", { mode: "timestamp_ms" }),
	note: text("note"),
	isDeleted: integer("isDeleted", { mode: "boolean" }).default(false),
});

export const Sets = sqliteTable(
	"sets",
	{
		id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
		index: integer("index", { mode: "number" }).notNull(),
		workoutId: integer("workoutId")
			.references(() => Workouts.id)
			.notNull(),
		exerciseId: integer("exerciseId")
			.references(() => Exercises.id)
			.notNull(),
		note: text("note"),
	},
	// (table) => {
	//   return {
	//     workoutAndIndex: unique().on(table.workoutId, table.index),
	//   };
	// },
);

export const Reps = sqliteTable("reps", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	setId: integer("setId")
		.references(() => Sets.id)
		.notNull(),
	count: integer("count").notNull(),
	weight: real("weight").notNull(),
	index: integer("index").notNull(),
	note: text("note"),
});

export const BodyParts = sqliteTable("bodyParts", {
	name: text("name").primaryKey(),
});

export const ExerciseBodyParts = sqliteTable("exerciseBodyParts", {
	exerciseId: integer("id")
		.references(() => Exercises.id)
		.notNull(),
	bodyPart: text("bodyPart")
		.references(() => BodyParts.name)
		.notNull(),
});

// RELATIONS

export const SetRelations = relations(Sets, ({ one, many }) => {
	return {
		workouts: one(Workouts, {
			fields: [Sets.workoutId],
			references: [Workouts.id],
		}),
		exercises: one(Exercises),
		reps: many(Reps),
	};
});

export const RepRelations = relations(Reps, ({ one, many }) => {
	return {
		sets: one(Sets, {
			fields: [Reps.setId],
			references: [Sets.id],
		}),
	};
});

export const WorkoutRelations = relations(Workouts, ({ one, many }) => {
	return {
		sets: many(Sets),
	};
});

export const ExerciseRelations = relations(Exercises, ({ one, many }) => {
	return {
		exerciseBodyParts: many(ExerciseBodyParts),
	};
});

export const BodyPartRelations = relations(BodyParts, ({ one, many }) => {
	return {
		exerciseBodyParts: many(ExerciseBodyParts),
	};
});

export const ExerciseBodyPartRelations = relations(ExerciseBodyParts, ({ one, many }) => {
	return {
		bodyPart: one(BodyParts, {
			fields: [ExerciseBodyParts.bodyPart],
			references: [BodyParts.name],
		}),
		exercise: one(Exercises, {
			fields: [ExerciseBodyParts.exerciseId],
			references: [Exercises.id],
		}),
	};
});
