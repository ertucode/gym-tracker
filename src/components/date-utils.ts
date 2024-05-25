export const weekdayNames = Object.fromEntries(
	Array.from({ length: 7 }, (_, i) => {
		const d = new Date(i * (24 * 60 * 60 * 1000));
		return [d.getDay(), d.toLocaleString("en-US", { weekday: "short" })];
	}),
);

export const monthName = (month: number) => {
	return new Date(2020, month, 1).toLocaleString("en-US", { month: "short" });
};
