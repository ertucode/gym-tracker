import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const exercises = sqliteTable("exercises", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("text", { length: 50 }).notNull().unique(),
});

export const workouts = sqliteTable("workouts", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  startDate: text("timestamp").notNull(),
  endDate: text("timestamp"),
});

export const sets = sqliteTable("sets", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  workoutId: integer("workoutId")
    .references(() => workouts.id)
    .notNull(),
  exercise: integer("id").references(() => exercises.id),
});

export const reps = sqliteTable("reps", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  setId: integer("setId")
    .references(() => sets.id)
    .notNull(),
  count: integer("count").notNull(),
});
