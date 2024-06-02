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
import { useAutoUpdate } from "@/hooks/useAutoUpdate";
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
import { Rep, SetWorkoutFn, WorkoutSet } from "./types";
import { newIndex } from "./helpers";

export function RepRow({
	r: _r,
	s,
	setWorkout,
}: {
	r: Rep;
	s: WorkoutSet;
	setWorkout: SetWorkoutFn;
}) {
	const [r, setR] = useState(_r);
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

	const [updatingNote] = useAutoUpdate(note, 500, async (debouncedNote) => {
		const note = debouncedNote;
		if (note === r.note) return;
		await updateRepAction({
			...r,
			note,
		});
		setR((r) => ({ ...r, note }));
	});

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
				<Button type="submit" variant="outline" size="icon" loading={updatingNote}>
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
