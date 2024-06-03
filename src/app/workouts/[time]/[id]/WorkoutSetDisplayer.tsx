import { createRepAction, updateSetAction } from "@/actions/actions";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Textarea } from "@/components/ui/textarea";
import { useAutoUpdate } from "@/hooks/useAutoUpdate";
import { useExercises } from "@/hooks/useExercises";
import { useState } from "react";
import { WorkoutSet } from "./types";
import { newIndex } from "./helpers";
import { RepRow } from "./RepRow";
import { AddRep } from "./AddRep";

export function WorkoutSetDisplayer({ s: _s }: { s: WorkoutSet }) {
	const [s, setS] = useState(_s);

	const [note, setNote] = useState(s.note ?? "");

	async function addRep(setId: number, weight: number, count: number) {
		const index = newIndex(s.reps);
		return createRepAction({
			setId,
			count,
			index,
			weight,
		}).then((result) => {
			const newOne = {
				index,
				count,
				setId,
				id: result[0].id,
				note: null,
				weight,
			};
			setS((s) => ({ ...s, reps: [...s.reps, newOne] }));
			return result;
		});
	}

	const [updatingNote] = useAutoUpdate(note, 500, async (debouncedNote) => {
		const note = debouncedNote;
		if (note === s.note) return;
		return updateSetAction({
			...s,
			note,
		}).then((_) => {
			setS((s) => ({ ...s, note }));
		});
	});

	const { exerciseName } = useExercises();
	return (
		<div className="flex flex-col gap-3 rounded-xl border border bg-card p-4 text-card-foreground shadow">
			<div className="self-center text-xl font-bold text-zinc-600">
				{exerciseName(s.exerciseId)}
			</div>
			<div className="relative">
				<Textarea defaultValue={note} onChange={(e) => setNote(e.currentTarget.value)}></Textarea>

				{updatingNote && <LoadingSpinner className="absolute bottom-0 right-0" />}
			</div>
			<div className="grid grid-cols-3 text-center">
				<div className="col-span-3 grid grid-cols-subgrid font-semibold">
					<div>Weight</div>
					<div>Count</div>
					<div>Note</div>
					<div></div>
				</div>
				{s.reps.map((r) => (
					<RepRow key={r.id} r={r} setS={setS} />
				))}
				<AddRep addRep={addRep} workoutSet={s} />
			</div>
		</div>
	);
}
