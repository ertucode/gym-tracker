"use client";

import { getWorkoutsForDay } from "@/actions/actions";
import { useEffect, useState } from "react";

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
	return (
		<table>
			<thead>
				<tr>
					<th>Id</th>
					<th>Start</th>
					<th>End</th>
					<th>Note</th>
				</tr>
			</thead>
			<tbody>
				{workouts.map((w) => {
					return (
						<tr className="[&>*]:text-center" key={w.id}>
							<td>{w.id}</td>
							<td>{new Date(w.startDate).toLocaleString()}</td>
							<td>{w.endDate ? new Date(w.endDate).toLocaleString() : null}</td>
							<td>{w.note}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
