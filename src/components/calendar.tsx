import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { calendarUtils } from "./headless-calendar";
import { type Month } from "./date-utils";
import { HourPicker } from "./HourPicker";
import { MonthDisplayer } from "./MonthDisplayer";

export type CalendarProps = {
	onSelected?: (d: Date | null) => void;
	onMonthChange?: (m: Month) => void;
	classCb?: (m: Month, d: number) => string | null | undefined;
};
export type CalendarRef = {
	selectedDate(): Date | null | undefined;
};

export const weeks = calendarUtils.createWeekDays();

export const Calendar = forwardRef<CalendarRef, CalendarProps>(function Calendar(props, ref) {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	useEffect(() => {
		props.onSelected?.(selectedDate);
	}, [selectedDate]);

	const [month, setMonth] = useState<Month>({
		month: new Date().getMonth(),
		year: new Date().getFullYear(),
	});

	useEffect(() => {
		props.onMonthChange?.(month);
	}, [month]);

	const onSelectDay = (month: Month, day: number) => {
		const date = new Date(month.year, month.month, day);

		setSelectedDate(date);
	};

	useImperativeHandle(
		ref,
		() => {
			return {
				selectedDate() {
					return selectedDate;
				},
			};
		},
		[selectedDate],
	);

	return (
		<div className="max-w-72 rounded-lg bg-white p-4 shadow-blue-500/50">
			<MonthDisplayer
				month={month}
				onMonth={setMonth}
				onSelectDay={onSelectDay}
				selectedDate={selectedDate}
				classCb={props.classCb}
			/>
			<HourPicker setSelectedDate={setSelectedDate} selectedDate={selectedDate} />
		</div>
	);
});
