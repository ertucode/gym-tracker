import { calendarUtils } from "./headless-calendar";
import { type Month, monthName } from "./date-utils";
import { cn } from "@/utils/cn";
import { monthMatches, prevMonth, nextMonth } from "./date-utils";
import { weeks } from "./calendar";

type MonthProps = {
	month: Month;
	onMonth?: (month: Month) => void;
	onSelectDay?: (month: Month, day: number) => void;
	selectedDate?: Date | null;
	classCb?: (m: Month, day: number) => string | null | undefined;
};
export function MonthDisplayer({ month, onMonth, onSelectDay, selectedDate, classCb }: MonthProps) {
	const months = calendarUtils.createMonths({ ...month, numOfMonths: 1 });

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
								"flex aspect-square h-full w-full cursor-pointer items-center justify-center rounded-[50%] text-sm leading-[1] hover:bg-indigo-50",
								d.today && "bg-indigo-200",
								d.otherMonth && "opacity-20",
								(d.otherMonth
									? isSelectedDate &&
										monthMatches(d, selectedDate) &&
										selectedDate!.getDate() === d.day
									: isThisMonth && selectedDate!.getDate() === d.day) && "bg-indigo-300",
								classCb?.(d, d.day),
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
