export const weekdayNames = Object.fromEntries(
	Array.from({ length: 7 }, (_, i) => {
		const d = new Date(i * (24 * 60 * 60 * 1000));
		return [d.getDay(), d.toLocaleString("en-US", { weekday: "short" })];
	}),
);

export const monthName = (month: number) => {
	return new Date(2020, month, 1).toLocaleString("en-US", { month: "short" });
};

export function prevMonth(month: Month): Month {
	if (month.month === 0) return { month: 11, year: month.year - 1 };

	return { month: month.month - 1, year: month.year };
}
export function nextMonth(month: Month): Month {
	if (month.month === 11) return { month: 0, year: month.year + 1 };

	return { month: month.month + 1, year: month.year };
}
export function monthMatches(m: Month, d: Date): boolean {
	return d.getMonth() === m.month && d.getFullYear() === m.year;
}

export type Month = { year: number; month: number };
