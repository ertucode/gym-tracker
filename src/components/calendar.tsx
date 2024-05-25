import { useState } from "react";
import { HeadlessCalendar } from "./headless-calendar";
import { monthName } from "./date-utils";
import { cn } from "@/utils/cn";

export type CalendarProps = {
	//
};

const headless = new HeadlessCalendar();

type Month = { year: number; month: number };

const weeks = headless.createWeekDays();

export function Calendar(props: CalendarProps) {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	const [month, setMonth] = useState<Month>({
		month: new Date().getMonth(),
		year: new Date().getFullYear(),
	});

	const onSelectDay = (month: Month, day: number) => {
		const date = new Date(month.year, month.month, day);

		setSelectedDate(date);
	};
	return (
		<div className="rounded-lg bg-white p-4 shadow-blue-500/50">
			<Month
				month={month}
				onMonth={setMonth}
				onSelectDay={onSelectDay}
				selectedDate={selectedDate}
			/>
			<div className="mt-3 flex justify-center gap-3">
				<NumberPicker val={(selectedDate ?? new Date()).getHours()} min={0} max={23} />
				<NumberPicker val={(selectedDate ?? new Date()).getMinutes()} min={0} max={59} />
			</div>
		</div>
	);
}

function prevMonth(month: Month): Month {
	if (month.month === 0) return { month: 11, year: month.year - 1 };

	return { month: month.month - 1, year: month.year };
}
function nextMonth(month: Month): Month {
	if (month.month === 11) return { month: 0, year: month.year + 1 };

	return { month: month.month + 1, year: month.year };
}

function monthMatches(m: Month, d: Date): boolean {
	return d.getMonth() === m.month && d.getFullYear() === m.year;
}

type MonthProps = {
	month: Month;
	onMonth?: (month: Month) => void;
	onSelectDay?: (month: Month, day: number) => void;
	selectedDate?: Date | null;
};
function Month({ month, onMonth, onSelectDay, selectedDate }: MonthProps) {
	const months = headless.createMonths({ ...month, numOfMonths: 1 });

	const isSelectedDate = selectedDate != null;
	const isThisMonth = isSelectedDate && monthMatches(month, selectedDate);

	return (
		<div className="max-w-72">
			<div className="flex px-3">
				<button onClick={() => onMonth?.(prevMonth(month))}>{"<"}</button>
				<div className="flex-1 text-center">
					{monthName(month.month)} - {month.year}
				</div>
				<button onClick={() => onMonth?.(nextMonth(month))}>{">"}</button>
			</div>
			<div className="grid grid-cols-7 place-items-center">
				{weeks.map((w) => (
					<div key={w} className="p-2 text-sm font-semibold">
						{w}
					</div>
				))}
				{months[0].dates?.map((week) => {
					return week.map((d) => (
						<button
							className={cn(
								"flex aspect-square h-full w-full cursor-pointer items-center justify-center rounded-[50%] text-sm leading-[1] hover:bg-indigo-100",
								d.today && "bg-indigo-200",
								d.otherMonth && "opacity-20",
								(d.otherMonth
									? isSelectedDate &&
										monthMatches(d, selectedDate) &&
										selectedDate!.getDate() === d.day
									: isThisMonth && selectedDate!.getDate() === d.day) && "bg-indigo-300",
							)}
							onClick={() => onSelectDay?.(d, d.day)}
							key={`${d.year}-${d.month}-${d.day}`}
						>
							{d.day}
						</button>
					));
				})}
			</div>
		</div>
	);
}

type NumberPickerProps = {
	min: number;
	max: number;
	val: number;
	onValChange?: (val: number) => void;
	onGoUnderMin?: () => void;
	onGoOverMax?: () => void;
};
function NumberPicker({ val, min, max, onValChange }: NumberPickerProps) {
	return (
		<div className="flex flex-col items-center">
			<button className="flex items-center text-2xl leading-3" onClick={() => onValChange}>
				⌃
			</button>
			<div>{val}</div>
			<button className="flex items-center text-2xl leading-3">⌄</button>
		</div>
	);
}
