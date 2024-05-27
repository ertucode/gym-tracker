"use client";

import { createWorkoutAction, getWorkoutsForMonth } from "@/actions/actions";
import { Calendar, CalendarRef } from "@/components/calendar";
import { Month } from "@/components/date-utils";
import { Button } from "@/components/ui/button";
import { useClient } from "@/hooks/useClient";
import { DateUtil } from "@/utils/date-utils";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

type Workout = Awaited<ReturnType<typeof getWorkoutsForMonth>>[number];

export default function WorkoutsLayout({ children }: { children: React.ReactNode }) {
	const calendarRef = useRef<CalendarRef>(null);

	const [workouts, setWorkouts] = useState<Workout[] | null>(null);

	const client = useClient();

	const classCb = useCallback(
		(month: Month, day: number) => {
			if (!workouts) return;

			if (
				workouts.find((w) => {
					const date = new Date(w.startDate);
					return (
						day === date.getDate() &&
						month.month === date.getMonth() &&
						month.year === date.getFullYear()
					);
				})
			) {
				return "bg-red-300";
			}
			return null;
		},
		[workouts],
	);

	const router = useRouter();

	if (!client) return null;

	const date = resolveSelectedDateFromParam();

	return (
		<div className="flex flex-col items-start">
			<Calendar
				ref={calendarRef}
				selectedDate={date}
				onSelected={(d) => {
					if (!d) router.push("/workouts");
					else {
						const date = resolveSelectedDateFromParam();
						if (date) {
							if (date.dayStart().getTime() === new DateUtil(d).dayStart().getTime()) return;
						}
						router.push(`/workouts/${d.getTime()}`);
					}
				}}
				onMonthChange={(m) => {
					getWorkoutsForMonth({ month: m }).then((v) => {
						setWorkouts(v);
					});
				}}
				classCb={classCb}
			/>
			<Button
				onClick={() => {
					createWorkoutAction({
						startDate: calendarRef.current?.selectedDate() ?? new Date(),
					}).then(() => {
						window.location.reload();
					});
				}}
				className="my-3"
			>
				Create Workout
			</Button>
			{children}
		</div>
	);
}

function resolveSelectedDateFromParam() {
	const prevTime = window.location.pathname.split("/")[2];
	if (prevTime) {
		const time = parseInt(prevTime);
		if (!isNaN(time)) {
			const date = new DateUtil(time);
			return date;
		}
	}
	return null;
}
