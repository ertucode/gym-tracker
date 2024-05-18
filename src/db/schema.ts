import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const exercises = sqliteTable("exercises", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("text").notNull().unique(),
});

export const workouts = sqliteTable("workouts", {
  start_date: text("timestamp").notNull(),
  end_date: text("timestamp"),
});

export const sets = sqliteTable("workout_sets", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
});

export const reps = sqliteTable("set_reps", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  exercise: integer("id").references(() => exercises.id),
  count: integer("count").notNull(),
});

export const sets_and_reps = sqliteTable("set_and_reps", {
  set_id: integer("set_id").references(() => sets.id),
  rep_id: integer("rep_id").references(() => reps.id),
});
