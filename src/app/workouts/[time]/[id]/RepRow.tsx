import { removeRepAction, updateRepAction } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAutoUpdate } from "@/hooks/useAutoUpdate";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useState } from "react";
import { Rep, WorkoutSet } from "./types";

export function RepRow({ r: _r, setS }: { r: Rep; setS: Dispatch<SetStateAction<WorkoutSet>> }) {
	const [r, setR] = useState(_r);
	async function removeRep() {
		return removeRepAction(r.id).then((_) => {
			setS((s) => {
				return {
					...s,
					reps: s.reps.filter((rep) => rep.id !== r.id),
				};
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
					setR((r) => {
						return {
							...r,
							note,
						};
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
						removeRep();
					}}
				>
					<TrashIcon className="size-4" />
				</Button>
			</div>
		</form>
	);
}
