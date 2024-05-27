"use client";

import {
	createRepAction,
	createSetAction,
	getWorkoutAction,
	removeRepAction,
} from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useExercises } from "@/hooks/useExercises";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/outline";
import { FormEvent, useEffect, useState, Fragment, useRef } from "react";

type Workout = Exclude<Awaited<ReturnType<typeof getWorkoutAction>>, undefined>;
type WorkoutSet = Workout["sets"][number];

export default function Workout({ params: { id } }: { params: { id: string } }) {
	const [workout, setWorkout] = useState<Workout | null>(null);

	useEffect(() => {
		if (id) {
			getWorkoutAction({ id: parseInt(id) }).then((w) => {
				if (!w) return;
				w.sets.sort((s1, s2) => (s1.index < s2.index ? -1 : 1));

				w.sets.forEach((s) => {
					s.reps.sort((s1, s2) => (s1.index < s2.index ? -1 : 1));
				});

				setWorkout(w);
			});
		}
	}, [id]);

	const createSet = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const value = Object.fromEntries(new FormData(e.currentTarget));
		const workoutId = parseInt(id);
		const exerciseId = parseInt(value.exerciseId.toString());
		const index = workout!.sets.length;

		const body = { workoutId, exerciseId, index };
		const result = await createSetAction(body);

		setWorkout((w) => {
			if (w === null) return w;

			w.sets = [
				...w.sets,
				{
					id: result[0].id,
					note: null,
					index,
					workoutId,
					exerciseId,
					reps: [],
				},
			];
			return { ...w };
		});
	};

	function addRep(setId: number, index: number, weight: number, count: number) {
		return createRepAction({
			setId,
			count,
			index,
			weight,
		}).then((result) => {
			setWorkout((w) => {
				const rep = w?.sets.find((s) => s.reps.find((r) => r.index === index));
				if (rep) return w && { ...w };
				if (w == null) return w;

				const setIdx = w.sets.findIndex((s) => s.id === setId);
				const set = w.sets[setIdx];

				w.sets = [...w.sets];

				const newOne = {
					index,
					count,
					setId,
					id: result[0].id,
					note: null,
					weight,
				};

				w.sets[setIdx] = {
					...set,
					reps: [...set.reps, newOne],
				};

				return { ...w };
			});
		});
	}

	function removeRep(id: number) {
		return removeRepAction(id).then((result) => {
			setWorkout((w) => {
				if (w == null) return w;
				const setIdx = w?.sets.findIndex((s) => s.reps.find((r) => r.id === id));
				if (setIdx === -1) return { ...w };

				const set = w.sets[setIdx];

				w.sets = [...w.sets];

				w.sets[setIdx] = {
					...set,
					reps: set.reps.filter((r) => r.id !== id),
				};

				return { ...w };
			});
		});
	}

	const { exercises, exerciseName } = useExercises();

	const [exercise, setExercise] = useState<Exclude<typeof exercises, null>[number] | null>(null);

	return (
		<div>
			<form className="flex flex-col items-start gap-3" onSubmit={createSet}>
				{exercises && (
					<label>
						Exercise
						<Select
							onValueChange={(e) => {
								const id = parseInt(e);
								setExercise(exercises.find((e) => e.id === id)!);
							}}
							name="exerciseId"
						>
							<SelectTrigger>{exercise?.name ?? "Select"}</SelectTrigger>
							<SelectContent>
								{exercises.map((e) => (
									<SelectItem key={e.id} value={e.id.toString()}>
										{e.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</label>
				)}
				<Button>Create Set</Button>
			</form>
			<div>
				{workout?.sets.map((s) => {
					return (
						<div key={s.id}>
							<div>Exercise: {exerciseName(s.exerciseId)}</div>
							<div className="grid grid-cols-3 text-center">
								<div className="col-span-3 grid grid-cols-subgrid font-semibold">
									<div>Count</div>
									<div>Weight</div>
									<div></div>
								</div>
								{s.reps.map((r) => (
									<div key={r.id} className="col-span-3 grid grid-cols-subgrid">
										<div>{r.count}</div>
										<div>{r.weight}</div>
										<div>
											<Button
												variant="outline"
												size="icon"
												onClick={() => {
													removeRep(r.id);
												}}
											>
												<TrashIcon className="size-4" />
											</Button>
										</div>
									</div>
								))}
								<AddRep addRep={addRep} workoutSet={s} />
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

function AddRep({
	addRep,
	workoutSet,
}: {
	addRep: (setId: number, index: number, weight: number, count: number) => Promise<unknown>;
	workoutSet: WorkoutSet;
}) {
	const [weight, setWeight] = useState<number>(0);
	const [count, setCount] = useState<number>(0);

	const firstInput = useRef<HTMLInputElement>(null);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				if (weight == null) return;
				if (count == null) return;

				addRep(workoutSet.id, workoutSet.reps.length, weight, count).then(() => {
					setWeight(0);
					setCount(0);
					firstInput.current?.focus();
				});
			}}
			className="col-span-3 grid grid-cols-subgrid"
		>
			<div className="px-2 py-1">
				<Input
					type="number"
					min="1"
					ref={firstInput}
					value={count}
					onChange={(e) => setCount(parseInt(e.currentTarget.value))}
				/>
			</div>
			<div className="px-3 py-1">
				<Input
					type="number"
					min="0"
					step="0.1"
					value={weight}
					onChange={(e) => setWeight(parseFloat(e.currentTarget.value))}
				/>
			</div>
			<div>
				<Button variant="outline" size="icon">
					<PlusIcon className="size-4" />
				</Button>
			</div>
		</form>
	);
}
