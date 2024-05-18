"use client";

import {
  createExerciseAction,
  createRepAction,
  createSetAction,
  createWorkoutAction,
} from "@/actions/actions";
import { FormEvent, useState } from "react";

export default function Home() {
  const [actions, setActions] = useState<{ action: string; metadata: any }[]>(
    [],
  );

  const createWorkout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = Object.fromEntries(new FormData(e.currentTarget));
    const startDate = new Date(value.startDate.toString());
    const endDate = new Date(value.endDate.toString());
    const result = await createWorkoutAction({ startDate, endDate });

    setActions((s) => [
      ...s,
      { action: "workout", metadata: { startDate, endDate, result } },
    ]);
  };

  const createExercise = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = Object.fromEntries(new FormData(e.currentTarget));
    const name = value.name.toString();

    const result = await createExerciseAction({ name });

    setActions((s) => [
      ...s,
      { action: "exercise", metadata: { name, result } },
    ]);
  };

  const createSet = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = Object.fromEntries(new FormData(e.currentTarget));
    const workoutId = parseInt(value.workoutId.toString());
    const exerciseId = parseInt(value.exerciseId.toString());
    const index = parseInt(value.index.toString());

    const body = { workoutId, exerciseId, index };
    const result = await createSetAction(body);

    setActions((s) => [...s, { action: "set", metadata: { body, result } }]);
  };

  const createRep = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = Object.fromEntries(new FormData(e.currentTarget));
    const setId = parseInt(value.setId.toString());
    const count = parseInt(value.count.toString());
    const index = parseInt(value.index.toString());

    const body = { setId, count, index };
    const result = await createRepAction(body);

    setActions((s) => [...s, { action: "rep", metadata: { body, result } }]);
  };
  return (
    <div className="h-screen">
      <form
        className="flex flex-col gap-3 items-start"
        onSubmit={createWorkout}
      >
        <label>
          Start Date
          <input type="datetime-local" name="startDate"></input>
        </label>
        <label>
          End Date
          <input type="datetime-local" name="endDate"></input>
        </label>
        <button type="submit">CREATE WORKOUT</button>
      </form>
      <br />
      <form
        className="flex flex-col gap-3 items-start"
        onSubmit={createExercise}
      >
        <label>
          Name
          <input type="text" name="name"></input>
        </label>
        <button type="submit">CREATE EXERCISE</button>
      </form>
      <br />
      <form className="flex flex-col gap-3 items-start" onSubmit={createSet}>
        <label>
          Exercise Id
          <input type="text" name="exerciseId"></input>
        </label>
        <label>
          Workout Id
          <input type="text" name="workoutId"></input>
        </label>
        <label>
          Index
          <input type="text" name="index"></input>
        </label>
        <button type="submit">CREATE SET</button>
      </form>
      <form className="flex flex-col gap-3 items-start" onSubmit={createRep}>
        <label>
          Set Id
          <input type="text" name="setId"></input>
        </label>
        <label>
          Count
          <input type="text" name="count"></input>
        </label>
        <label>
          Index
          <input type="text" name="index"></input>
        </label>
        <button type="submit">CREATE REP</button>
      </form>
      {actions.map((a, i) => (
        <div key={i}>{JSON.stringify(a, null, 4)}</div>
      ))}
    </div>
  );
}
