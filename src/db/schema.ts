import { relations, sql } from "drizzle-orm";
import { text, integer, sqliteTable, unique } from "drizzle-orm/sqlite-core";

// TODO: exercise tags

export const Exercises = sqliteTable("exercises", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("text", { length: 50 }).notNull().unique(),
});

export const Workouts = sqliteTable("workouts", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  startDate: text("timestamp").notNull(),
  endDate: text("timestamp"),
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
