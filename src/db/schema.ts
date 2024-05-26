import { relations } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

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
		index: integer("index", { mode: "number" }),
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
	index: integer("index").notNull(),
	note: text("note"),
});

// RELATIONS

export const SetRelations = relations(Sets, ({ one, many }) => {
	return {
		workouts: one(Workouts),
		exercises: one(Exercises),
		reps: many(Reps),
	};
});

export const RepRelations = relations(Reps, ({ one, many }) => {
	return {
		sets: one(Sets),
	};
});
