"use client";

import { deleteWorkoutAction, getWorkoutsForDay, updateWorkoutAction } from "@/actions/actions";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { FormEvent, useEffect, useState } from "react";
import { z } from "zod";

import { PrimedCalendar } from "./PrimedCalendar";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

type Workout = Awaited<ReturnType<typeof getWorkoutsForDay>>[number];

export default function WorkoutDay({ params: { time } }: { params: { time: string } }) {
	const [workouts, setWorkouts] = useState<Workout[] | null>(null);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		if (!time) return;
		const parsed = parseInt(time);
		if (isNaN(parsed)) return;
		setLoading(true);
		getWorkoutsForDay({ time: parsed })
			.then(setWorkouts)
			.finally(() => setLoading(false));
	}, [time]);

	return loading ? (
		"Loading..."
	) : workouts == null || workouts.length === 0 ? (
		"No workouts"
	) : (
		<Workouts workouts={workouts} />
	);
}

function Workouts({ workouts }: { workouts: Workout[] }) {
	const router = useRouter();
	function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		// @ts-ignore
		const i = parseInt(e.nativeEvent.submitter?.value);
		if (isNaN(i)) return;

		const value = new FormData(e.currentTarget);

		const idx = i.toString() + "-";
		const _v = Object.entries(Object.fromEntries(value))
			.filter(([key, value]) => {
				return key.startsWith(idx);
			})
			.map(([key, value]) => [key.slice(2), value]);

		const v = Object.fromEntries(_v);

		const body = {
			startDate: new Date(v.startDate),
			endDate: new Date(v.endDate),
			note: v.note,
		};

		const schema = z.object({
			startDate: z.date(),
			endDate: z.date().nullish(),
			note: z.string().nullish(),
		});

		const parseResult = schema.safeParse(body);

		if (!parseResult.success) return;

		console.log(body);

		const id = workouts[i].id;
		updateWorkoutAction({
			...body,
			id,
		}).then(console.log);
	}

	function deleteWorkout(i: number) {
		const w = workouts[i];

		deleteWorkoutAction({ id: w.id }).then((v) => {
			window.location.reload();
		});
	}

	return (
		<form onSubmit={onSubmit}>
			<table>
				<thead>
					<tr>
						<th>Id</th>
						<th>Start</th>
						<th>End</th>
						<th>Note</th>
						<th>Update</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					{workouts.map((w, i) => {
						return (
							<tr className="[&>*]:text-center" key={w.id}>
								<td>{w.id}</td>
								<td>
									<PrimedCalendar name={`${i}-startDate`} defaultValue={w.startDate} />
								</td>
								<td>
									<PrimedCalendar name={`${i}-endDate`} defaultValue={w.endDate ?? undefined} />
								</td>
								<td>
									<input name={`${i}-note`} type="text" defaultValue={w.note || ""}></input>
								</td>
								<td>
									<button type="submit" value={i}>
										<PencilSquareIcon className="size-4" />
									</button>
								</td>
								<td>
									<button type="button" onClick={() => deleteWorkout(i)}>
										<TrashIcon className="size-4" />
									</button>
								</td>
								<td>
									<button
										type="button"
										onClick={() => {
											const workout = workouts[i];
											const path = window.location.pathname;
											const cared = path.split("/").slice(0, 3).join("/");
											router.push(`${cared}/${workout.id}`);
										}}
									>
										<PaperAirplaneIcon className="size-4" />
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</form>
	);
}
