/**
 * Month interface.
 * @group Interface
 */
export interface Month {
	/**
	 * Mont value.
	 */
	month: number;
	/**
	 * Year value.
	 */
	year?: number;
	/**
	 * Array of dates.
	 */
	dates?: {
		day: number;
		month: number;
		year: number;
		otherMonth: boolean;
		today: boolean;
		selectable: boolean;
	}[][];

	/**
	 * Array of week numbers.
	 */
	weekNumbers?: number[];
}
/**
 * Custom type for the calendar views.
 * @group Types
 */
export type CalendarTypeView = "date" | "month" | "year";
/**
 * Custom type for the calendar navigation state.
 * @group Types
 */
export type NavigationState = { backward?: boolean; button?: boolean };

/**
 * Custom Calendar year change event.
 * @see {@link Calendar.onYearChange}
 * @group Events
 */
export interface CalendarYearChangeEvent {
	/**
	 * New month.
	 */
	month?: number;
	/**
	 * New year.
	 */
	year?: number;
}
/**
 * Custom Calendar month change event.
 * @see {@link Calendar.onMonthChange}
 * @group Events
 */
export interface CalendarMonthChangeEvent {
	/**
	 * New month.
	 */
	month?: number;
	/**
	 * New year.
	 */
	year?: number;
}
