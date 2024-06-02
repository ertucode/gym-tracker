"use client";

import { createWorkoutAction, getWorkoutsForMonth } from "@/actions/actions";
import { Calendar, CalendarRef } from "@/components/calendar";
import { Month } from "@/components/date-utils";
import { Button } from "@/components/ui/button";
import { useClient } from "@/hooks/useClient";
import { DateUtil } from "@/utils/date-utils";
import { useRouter } from "next/navigation";
import React, { useCallback, useRef, useState } from "react";
import { WorkoutContextProvider, useWorkouts } from "./workouts";
import { ExercisesContextProvider } from "@/hooks/useExercises";

type Workout = Awaited<ReturnType<typeof getWorkoutsForMonth>>[number];

export default function WorkoutsLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col items-start">
			<WorkoutContextProvider>
				<ExercisesContextProvider>
					<InContext>{children}</InContext>
				</ExercisesContextProvider>
			</WorkoutContextProvider>
		</div>
	);
}

function InContext({ children }: { children: React.ReactNode }) {
	const calendarRef = useRef<CalendarRef>(null);

	const [monthWorkouts, setMonthWorkouts] = useState<Workout[]>([]);

	const { setWorkouts: setDayWorkouts } = useWorkouts();

	const client = useClient();

	const classCb = useCallback(
		(month: Month, day: number) => {
			if (!monthWorkouts) return;

			if (
				monthWorkouts.find((w) => {
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
		[monthWorkouts],
	);

	const router = useRouter();

	if (!client) return null;

	const date = resolveSelectedDateFromParam();
	return (
		<>
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
						setMonthWorkouts(v);
					});
				}}
				classCb={classCb}
			/>
			<Button
				onClick={() => {
					const startDate = calendarRef.current?.selectedDate() ?? new Date();
					createWorkoutAction({
						startDate,
					}).then((w) => {
						function fn(ws: Workout[]): Workout[] {
							const newOne = { startDate, endDate: null, id: w[0].id, note: null, isDeleted: null };
							if (ws === null) return [newOne];

							return [...ws, newOne];
						}
						setDayWorkouts(fn);
						setMonthWorkouts(fn);
					});
				}}
				className="my-3"
			>
				Create Workout
			</Button>
			{children}
		</>
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
