"use client";

import {
	createRepAction,
	createSetAction,
	getWorkoutAction,
	removeRepAction,
	updateRepAction,
	updateSetAction,
} from "@/actions/actions";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useExercises } from "@/hooks/useExercises";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/outline";
import {
	FormEvent,
	useEffect,
	useState,
	useRef,
	ChangeEvent,
	SetStateAction,
	Dispatch,
} from "react";
import { useDebounce } from "use-debounce";

type Workout = Exclude<Awaited<ReturnType<typeof getWorkoutAction>>, undefined>;
type WorkoutSet = Workout["sets"][number];

type SetWorkoutFn = Dispatch<SetStateAction<Workout | null>>;

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

	const { exercises } = useExercises();

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
				<div className="flex flex-col gap-6">
					{workout?.sets.map((s) => {
						return <WorkoutSet key={s.id} s={s} setWorkout={setWorkout} />;
					})}
				</div>
			</div>
		</div>
	);
}

function WorkoutSet({ s, setWorkout }: { s: WorkoutSet; setWorkout: SetWorkoutFn }) {
	const [note, setNote] = useState(s.note ?? "");
	const [updatingNote, setUpdatingNote] = useState<void[]>([]);
	async function addRep(setId: number, index: number, weight: number, count: number) {
		return createRepAction({
			setId,
			count,
			index,
			weight,
		}).then((result) => {
			setWorkout((w) => {
				if (w == null) return w;
				const setIdx = w.sets.findIndex((s) => s.id === setId);
				const set = w.sets[setIdx];
				const rep = set.reps.find((r) => r.index === index);

				if (rep) return w && { ...w };

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
			return result;
		});
	}

	const [debouncedNote] = useDebounce(note, 500);

	useEffect(() => {
		const note = debouncedNote;
		if (note === s.note) return;
		setUpdatingNote((u) => [...u, undefined]);
		updateSetAction({
			...s,
			note: debouncedNote,
		})
			.then((_) => {
				setWorkout((w) => {
					if (w == null) return w;
					const setIdx = w.sets.findIndex((st) => st === s);

					w.sets = [...w.sets];

					w.sets[setIdx] = {
						...s,
						note,
					};

					return { ...w };
				});
			})
			.finally(() => {
				setUpdatingNote((u) => u.slice(0, -1));
			});
	}, [debouncedNote]);

	const { exerciseName } = useExercises();
	return (
		<div className="flex flex-col gap-3 rounded-xl border border bg-card p-4 text-card-foreground shadow">
			<div className="self-center text-xl font-bold text-zinc-600">
				{exerciseName(s.exerciseId)}
			</div>
			<div className="relative">
				<Textarea defaultValue={note} onChange={(e) => setNote(e.currentTarget.value)}></Textarea>

				{updatingNote.length !== 0 && <LoadingSpinner className="absolute bottom-0 right-0" />}
			</div>
			<div className="grid grid-cols-3 text-center">
				<div className="col-span-3 grid grid-cols-subgrid font-semibold">
					<div>Weight</div>
					<div>Count</div>
					<div>Note</div>
					<div></div>
				</div>
				{s.reps.map((r) => (
					<RepRow key={r.id} r={r} s={s} setWorkout={setWorkout} />
				))}
				<AddRep addRep={addRep} workoutSet={s} />
			</div>
		</div>
	);
}

type Rep = WorkoutSet["reps"][number];

function RepRow({ r, s, setWorkout }: { r: Rep; s: WorkoutSet; setWorkout: SetWorkoutFn }) {
	async function removeRep(setId: number, id: number) {
		return removeRepAction(id).then((_) => {
			setWorkout((w) => {
				if (w == null) return w;
				const setIdx = w?.sets.findIndex((s) => s.id === setId);
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

	const [note, setNote] = useState(r.note ?? "");

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				updateRepAction({
					id: r.id,
					setId: r.setId,
					count: r.count,
					weight: r.weight,
					index: r.index,
					note,
				}).then(() => {
					setWorkout((w) => {
						if (w == null) return w;
						const setIdx = w.sets.findIndex((st) => st === s);
						const repIdx = s.reps.findIndex((rep) => rep === r);

						s.reps[repIdx] = { ...r, note };

						w.sets = [...w.sets];
						w.sets[setIdx] = {
							...s,
							reps: [...s.reps],
						};

						return { ...w };
					});
				});
			}}
			className="col-span-4 grid grid-cols-subgrid place-items-center"
		>
			<div>{r.weight}</div>
			<div>{r.count}</div>
			<div className="p-2">
				<Input
					type="text"
					defaultValue={note}
					onChange={(e) => setNote(e.currentTarget.value)}
				></Input>
			</div>
			<div className="flex gap-1">
				<Button type="submit" variant="outline" size="icon">
					<PencilIcon className="size-4" />
				</Button>
				<Button
					type="button"
					variant="outline"
					size="icon"
					onClick={() => {
						removeRep(s.id, r.id);
					}}
				>
					<TrashIcon className="size-4" />
				</Button>
			</div>
		</form>
	);
}

function AddRep({
	addRep,
	workoutSet,
}: {
	addRep: (setId: number, index: number, weight: number, count: number) => Promise<unknown>;
	workoutSet: WorkoutSet;
}) {
	const [weightInputValue, weight, setWeight, weightValueChange] = useInputNumber({
		value: 0,
		isFloat: true,
	});
	const [countInputValue, count, setCount, countValueChange] = useInputNumber({
		value: 0,
		isFloat: false,
	});

	const firstInput = useRef<HTMLInputElement>(null);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				if (weight == null) return;
				if (count == null) return;

				addRep(workoutSet.id, workoutSet.reps.length, weight, count).then((r) => {
					setWeight(0);
					setCount(0);
					firstInput.current?.focus();
				});
			}}
			className="col-span-4 grid grid-cols-subgrid"
		>
			<div className="px-3 py-1">
				<Input
					type="number"
					min="0"
					step="0.01"
					value={weightInputValue}
					ref={firstInput}
					onChange={weightValueChange}
				/>
			</div>
			<div className="px-2 py-1">
				<Input type="number" min="1" value={countInputValue} onChange={countValueChange} />
			</div>
			<div></div>
			<div>
				<Button variant="outline" size="icon">
					<PlusIcon className="size-4" />
				</Button>
			</div>
		</form>
	);
}

function useInputNumber({ value, isFloat }: { value: number; isFloat: boolean }) {
	const [inputValue, setInputValue] = useState<string>(value === 0 ? "" : value.toString());
	const [numberValue, setNumberValue] = useState<number>(value);

	function onValueChange(e: ChangeEvent<HTMLInputElement>) {
		const v = e.currentTarget.value;

		if (v === "") {
			if (inputValue === "") return;
			setInputValue("");
			return setNumberValue(0);
		}

		const parsed = isFloat ? parseFloat(v) : parseInt(v);

		if (isNaN(parsed)) return setInputValue(numberValue.toString());

		setNumberValue(parsed);
		setInputValue(v);
	}

	function ___setNumberValue(v: number) {
		const stringValue = v === 0 ? "" : v.toString();
		setInputValue(stringValue);
		setNumberValue(v);
	}

	return [inputValue, numberValue, ___setNumberValue, onValueChange] as const;
}
