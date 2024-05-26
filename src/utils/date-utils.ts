export class DateUtil extends Date {
	static isValidDate = (date: Date | DateUtil) => date.getTime() === date.getTime();
	static getDaysInMonth = (date: Date | DateUtil) =>
		new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

	hourStart = () => new DateUtil(new Date(this).setMinutes(0, 0, 0));
	hourEnd = () => new DateUtil(new Date(this).setMinutes(59, 59, 999));
	hourDiff = (amount: number) => new DateUtil(new Date(this).setHours(this.getHours() + amount));

	dayStart = () => new DateUtil(new Date(this).setHours(0, 0, 0, 0));
	dayEnd = () => new DateUtil(new Date(this).setHours(23, 59, 59, 999));
	dayDiff = (amount: number) => new DateUtil(new Date(this).setDate(this.getDate() + amount));

	weekStart = (startDay = 1) =>
		new DateUtil(
			new Date(
				new Date(this).setDate(this.getDate() - ((7 + this.getDay() - startDay) % 7)),
			).setHours(0, 0, 0, 0),
		);
	weekEnd = (startDay = 1) =>
		new DateUtil(
			new Date(
				new Date(this).setDate(this.getDate() - ((7 + this.getDay() - startDay) % 7)),
			).setHours(23, 59, 59, 999),
		);
	weekDiff = (amount: number) => this.dayDiff(amount * 7);

	monthStart = () => new DateUtil(this.getFullYear(), this.getMonth(), 1);
	monthEnd = () =>
		new DateUtil(new Date(this.getFullYear(), this.getMonth() + 1, 0).setHours(23, 59, 59, 999));
	monthDiff = (amount: number) => {
		const copy = new DateUtil(this);
		const originalDay = copy.getDate();
		copy.setDate(1);
		copy.setMonth(copy.getMonth() + amount);
		const maxDay = DateUtil.getDaysInMonth(new Date(copy.getFullYear(), copy.getMonth()));
		copy.setDate(Math.min(originalDay, maxDay));
		return copy;
	};

	yearStart = () => new DateUtil(this.getFullYear(), 0, 1);
	yearEnd = () => new DateUtil(new Date(this.getFullYear(), 11, 31).setHours(23, 59, 59, 999));
	yearDiff = (amount: number) => this.monthDiff(amount * 12);

	/**
	 *
	 * @param config Object with date string keys, number values
	 * @returns Date with applied difference
	 *
	 * @example
	 * diff({day: 2, month: -30})
	 */
	diff: (config: DiffConfig) => DateUtil = (config) => {
		let copy = new DateUtil(this);
		Object.entries(config).forEach(([key, amount]) => {
			copy = copy[`${key as DateUtilGroup}Diff`](amount);
		});
		return copy;
	};

	startOf = (dateGroup: DateUtilGroup) => this[`${dateGroup}Start`];
	endOf = (dateGroup: DateUtilGroup) => this[`${dateGroup}End`];

	static randomDate = (start: Date, end: Date) => {
		const startTime = start.getTime();
		const endTime = end.getTime();
		return new DateUtil(startTime + Math.random() * (endTime - startTime));
	};

	/**
	 * Expects strings with length 4
	 * Returns local time
	 *  */
	static createDateFrommmyy = (mmyy: string) => {
		try {
			const month = parseInt(mmyy.substring(0, 2)) - 1;
			if (month === -1) {
				return;
			}
			const year = parseInt("20" + mmyy.substring(2, 4));
			return new DateUtil(year, month);
		} catch (e) {
			return;
		}
	};
}

export type AtLeastOne<T> = {
	[K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type DateUtilGroup = "day" | "hour" | "week" | "month" | "year";
type DiffConfig = AtLeastOne<{ [K in DateUtilGroup]: number }>;
