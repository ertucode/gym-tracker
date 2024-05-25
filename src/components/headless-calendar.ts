import {
	NavigationState,
	CalendarResponsiveOptions,
	CalendarTypeView,
	LocaleSettings,
	Month,
} from "./calendar-interface";

type Nullable<T> = T | null | undefined;

const ObjectUtils = {
	isDate: (v: unknown) => Object.prototype.toString.call(v) === "[object Date]",
};

export type CreateMonthOpts = {
	month: number;
	year: number;
	numOfMonths: number;
};

const weekdayNames = Object.fromEntries(
	Array.from({ length: 7 }, (_, i) => {
		const d = new Date(i * (24 * 60 * 60 * 1000));
		return [d.getDay(), d.toLocaleString("en-US", { weekday: "short" })];
	}),
);

export class HeadlessCalendar {
	getFirstDateOfWeek() {
		return 1;
	}

	iconDisplay: "input" | "button" = "button";
	/**
	 * Inline style of the component.
	 * @group Props
	 */
	style: { [klass: string]: any } | null | undefined;
	/**
	 * Style class of the component.
	 * @group Props
	 */
	styleClass: string | undefined;
	/**
	 * Inline style of the input field.
	 * @group Props
	 */
	inputStyle: { [klass: string]: any } | null | undefined;
	/**
	 * Identifier of the focus input to match a label defined for the component.
	 * @group Props
	 */
	inputId: string | undefined;
	/**
	 * Name of the input element.
	 * @group Props
	 */
	name: string | undefined;
	/**
	 * Style class of the input field.
	 * @group Props
	 */
	inputStyleClass: string | undefined;
	/**
	 * Placeholder text for the input.
	 * @group Props
	 */
	placeholder: string | undefined;
	/**
	 * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
	 * @group Props
	 */
	ariaLabelledBy: string | undefined;
	/**
	 * Defines a string that labels the input for accessibility.
	 * @group Props
	 */
	ariaLabel: string | undefined;

	/**
	 * Defines a string that labels the icon button for accessibility.
	 * @group Props
	 */
	iconAriaLabel: string | undefined;
	/**
	 * When specified, disables the component.
	 * @group Props
	 */
	disabled: boolean | undefined;
	/**
	 * Format of the date which can also be defined at locale settings.
	 * @group Props
	 */
	dateFormat: string | undefined;
	/**
	 * Separator for multiple selection mode.
	 * @group Props
	 */
	multipleSeparator: string = ",";
	/**
	 * Separator for joining start and end dates on range selection mode.
	 * @group Props
	 */
	rangeSeparator: string = "-";
	/**
	 * When enabled, displays the calendar as inline. Default is false for popup mode.
	 * @group Props
	 */
	inline: boolean = false;
	/**
	 * Whether to display dates in other months (non-selectable) at the start or end of the current month. To make these days selectable use the selectOtherMonths option.
	 * @group Props
	 */
	showOtherMonths: boolean = true;
	/**
	 * Whether days in other months shown before or after the current month are selectable. This only applies if the showOtherMonths option is set to true.
	 * @group Props
	 */
	selectOtherMonths: boolean | undefined;
	/**
	 * When enabled, displays a button with icon next to input.
	 * @group Props
	 */
	showIcon: boolean | undefined;
	/**
	 * Icon of the calendar button.
	 * @group Props
	 */
	icon: string | undefined;
	/**
	 * When specified, prevents entering the date manually with keyboard.
	 * @group Props
	 */
	readonlyInput: boolean | undefined;
	/**
	 * The cutoff year for determining the century for a date.
	 * @group Props
	 */
	shortYearCutoff: any = "+10";
	/**
	 * Whether the month should be rendered as a dropdown instead of text.
	 * @group Props
	 * @deprecated Navigator is always on.
	 */
	monthNavigator: boolean | undefined;
	/**
	 * Whether the year should be rendered as a dropdown instead of text.
	 * @group Props
	 * @deprecated  Navigator is always on.
	 */
	yearNavigator: boolean | undefined;
	/**
	 * Specifies 12 or 24 hour format.
	 * @group Props
	 */
	hourFormat: string = "24";
	/**
	 * Whether to display timepicker only.
	 * @group Props
	 */
	timeOnly: boolean | undefined;
	/**
	 * Hours to change per step.
	 * @group Props
	 */
	stepHour: number = 1;
	/**
	 * Minutes to change per step.
	 * @group Props
	 */
	stepMinute: number = 1;
	/**
	 * Seconds to change per step.
	 * @group Props
	 */
	stepSecond: number = 1;
	/**
	 * Whether to show the seconds in time picker.
	 * @group Props
	 */
	showSeconds: boolean = false;
	/**
	 * When present, it specifies that an input field must be filled out before submitting the form.
	 * @group Props
	 */
	required: boolean | undefined;
	/**
	 * When disabled, datepicker will not be visible with input focus.
	 * @group Props
	 */
	showOnFocus: boolean = true;
	/**
	 * When enabled, calendar will show week numbers.
	 * @group Props
	 */
	showWeek: boolean = true;
	/**
	 * When enabled, calendar will start week numbers from first day of the year.
	 * @group Props
	 */
	startWeekFromFirstDayOfYear: boolean = false;
	/**
	 * When enabled, a clear icon is displayed to clear the value.
	 * @group Props
	 */
	showClear: boolean = false;
	/**
	 * Type of the value to write back to ngModel, default is date and alternative is string.
	 * @group Props
	 */
	dataType: string = "date";
	/**
	 * Defines the quantity of the selection, valid values are "single", "multiple" and "range".
	 * @group Props
	 */
	selectionMode: "single" | "multiple" | "range" | undefined = "single";
	/**
	 * Maximum number of selectable dates in multiple mode.
	 * @group Props
	 */
	maxDateCount: number | undefined;
	/**
	 * Whether to display today and clear buttons at the footer
	 * @group Props
	 */
	showButtonBar: boolean | undefined;
	/**
	 * Style class of the today button.
	 * @group Props
	 */
	todayButtonStyleClass: string = "p-button-text";
	/**
	 * Style class of the clear button.
	 * @group Props
	 */
	clearButtonStyleClass: string = "p-button-text";
	/**
	 * When present, it specifies that the component should automatically get focus on load.
	 * @group Props
	 */
	autofocus: boolean | undefined;
	/**
	 * Whether to automatically manage layering.
	 * @group Props
	 */
	autoZIndex: boolean = true;
	/**
	 * Base zIndex value to use in layering.
	 * @group Props
	 */
	baseZIndex: number = 0;
	/**
	 * Style class of the datetimepicker container element.
	 * @group Props
	 */
	panelStyleClass: string | undefined;
	/**
	 * Inline style of the datetimepicker container element.
	 * @group Props
	 */
	panelStyle: any;
	/**
	 * Keep invalid value when input blur.
	 * @group Props
	 */
	keepInvalid: boolean = false;
	/**
	 * Whether to hide the overlay on date selection.
	 * @group Props
	 */
	hideOnDateTimeSelect: boolean = true;
	/**
	 * When enabled, calendar overlay is displayed as optimized for touch devices.
	 * @group Props
	 */
	touchUI: boolean | undefined;
	/**
	 * Separator of time selector.
	 * @group Props
	 */
	timeSeparator: string = ":";
	/**
	 * When enabled, can only focus on elements inside the calendar.
	 * @group Props
	 */
	focusTrap: boolean = true;
	/**
	 * Transition options of the show animation.
	 * @group Props
	 */
	showTransitionOptions: string = ".12s cubic-bezier(0, 0, 0.2, 1)";
	/**
	 * Transition options of the hide animation.
	 * @group Props
	 */
	hideTransitionOptions: string = ".1s linear";
	/**
	 * Index of the element in tabbing order.
	 * @group Props
	 */
	tabindex: number | undefined;
	/**
	 * Specifies the input variant of the component.
	 * @group Props
	 */
	variant: "filled" | "outlined" = "outlined";
	/**
	 * Defines the first of the week for various date calculations.
	 * @group Props
	 */
	get firstDayOfWeek(): number {
		return this._firstDayOfWeek;
	}
	set firstDayOfWeek(firstDayOfWeek: number) {
		this._firstDayOfWeek = firstDayOfWeek;

		this.createWeekDays();
	}
	/**
	 * Option to set calendar locale.
	 * @group Props
	 * @deprecated Locale property has no effect, use new i18n API instead.
	 */
	set locale(newLocale: LocaleSettings) {
		console.warn("Locale property has no effect, use new i18n API instead.");
	}
	/**
	 * Type of view to display, valid values are "date" for datepicker and "month" for month picker.
	 * @group Props
	 */
	get view(): CalendarTypeView {
		return this._view;
	}
	set view(view: CalendarTypeView) {
		this._view = view;
		this.currentView = this._view;
	}

	value: any;

	dates: Nullable<Date[]>;

	months!: Month[];

	currentMonth!: number;

	currentYear!: number;

	currentHour: Nullable<number>;

	currentMinute: Nullable<number>;

	currentSecond: Nullable<number>;

	pm: Nullable<boolean>;

	mask: Nullable<HTMLDivElement>;

	overlay: Nullable<HTMLDivElement>;

	responsiveStyleElement: HTMLStyleElement | undefined | null;

	overlayVisible: Nullable<boolean>;

	onModelChange: Function = () => {};

	onModelTouched: Function = () => {};

	timePickerTimer: any;

	ticksTo1970: Nullable<number>;

	yearOptions: Nullable<number[]>;

	focus: Nullable<boolean>;

	isKeydown: Nullable<boolean>;

	filled: Nullable<boolean>;

	inputFieldValue: Nullable<string> = null;

	_minDate?: Date | null;

	_maxDate?: Date | null;

	_showTime!: boolean;

	_yearRange!: string;

	preventDocumentListener: Nullable<boolean>;

	_disabledDates!: Array<Date>;

	_disabledDays!: Array<number>;
	navigationState: Nullable<NavigationState> = null;

	isMonthNavigate: Nullable<boolean>;

	initialized: Nullable<boolean>;

	_locale!: LocaleSettings;

	_responsiveOptions!: CalendarResponsiveOptions[];

	currentView: Nullable<string>;

	attributeSelector: Nullable<string>;

	panelId: Nullable<string>;

	_firstDayOfWeek!: number;

	_view: CalendarTypeView = "date";

	preventFocus: Nullable<boolean>;

	_defaultDate!: Date;

	_focusKey: Nullable<string> = null;

	get locale() {
		return this._locale;
	}

	get iconButtonAriaLabel() {
		return this.iconAriaLabel ? this.iconAriaLabel : this.getTranslation("chooseDate");
	}

	get prevIconAriaLabel() {
		return this.currentView === "year"
			? this.getTranslation("prevDecade")
			: this.currentView === "month"
				? this.getTranslation("prevYear")
				: this.getTranslation("prevMonth");
	}

	get nextIconAriaLabel() {
		return this.currentView === "year"
			? this.getTranslation("nextDecade")
			: this.currentView === "month"
				? this.getTranslation("nextYear")
				: this.getTranslation("nextMonth");
	}

	getTranslation(...params: any[]) {
		return 2 as any;
	}

	populateYearOptions(start: number, end: number) {
		this.yearOptions = [];

		for (let i = start; i <= end; i++) {
			this.yearOptions.push(i);
		}
	}

	createWeekDays() {
		const weekDays: Nullable<string>[] = [];
		let dayIndex = this.getFirstDateOfWeek();
		for (let i = 0; i < 7; i++) {
			weekDays.push(weekdayNames[dayIndex]);
			dayIndex = dayIndex == 6 ? 0 : ++dayIndex;
		}
		return weekDays;
	}

	monthPickerValues() {
		let monthPickerValues = [];
		for (let i = 0; i <= 11; i++) {
			monthPickerValues.push(this.getTranslation("monthNamesShort")[i]);
		}

		return monthPickerValues;
	}

	yearPickerValues() {
		let yearPickerValues = [];
		let base = <number>this.currentYear - (<number>this.currentYear % 10);
		for (let i = 0; i < 10; i++) {
			yearPickerValues.push(base + i);
		}

		return yearPickerValues;
	}

	createMonths(opts: CreateMonthOpts) {
		const months: Month[] = [];
		for (let i = 0; i < opts.numOfMonths; i++) {
			let m = opts.month + i;
			let y = opts.year;
			if (m > 11) {
				m = (m % 11) - 1;
				y = opts.year + 1;
			}

			months.push(this.createMonth(m, y));
		}
		return months;
	}

	getWeekNumber(date: Date) {
		let checkDate = new Date(date.getTime());
		if (this.startWeekFromFirstDayOfYear) {
			let firstDayOfWeek: number = +this.getFirstDateOfWeek();
			checkDate.setDate(checkDate.getDate() + 6 + firstDayOfWeek - checkDate.getDay());
		} else {
			checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
		}
		let time = checkDate.getTime();
		checkDate.setMonth(0);
		checkDate.setDate(1);
		return Math.floor(Math.round((time - checkDate.getTime()) / 86400000) / 7) + 1;
	}

	createMonth(month: number, year: number): Month {
		let dates = [];
		let firstDay = this.getFirstDayOfMonthIndex(month, year);
		let daysLength = this.getDaysCountInMonth(month, year);
		let prevMonthDaysLength = this.getDaysCountInPrevMonth(month, year);
		let dayNo = 1;
		let today = new Date();
		let weekNumbers = [];
		let monthRows = Math.ceil((daysLength + firstDay) / 7);

		for (let i = 0; i < monthRows; i++) {
			let week = [];

			if (i == 0) {
				for (let j = prevMonthDaysLength - firstDay + 1; j <= prevMonthDaysLength; j++) {
					let prev = this.getPreviousMonthAndYear(month, year);
					week.push({
						day: j,
						month: prev.month,
						year: prev.year,
						otherMonth: true,
						today: this.isToday(today, j, prev.month, prev.year),
						selectable: this.isSelectable(j, prev.month, prev.year, true),
					});
				}

				let remainingDaysLength = 7 - week.length;
				for (let j = 0; j < remainingDaysLength; j++) {
					week.push({
						day: dayNo,
						month: month,
						year: year,
						today: this.isToday(today, dayNo, month, year),
						selectable: this.isSelectable(dayNo, month, year, false),
					});
					dayNo++;
				}
			} else {
				for (let j = 0; j < 7; j++) {
					if (dayNo > daysLength) {
						let next = this.getNextMonthAndYear(month, year);
						week.push({
							day: dayNo - daysLength,
							month: next.month,
							year: next.year,
							otherMonth: true,
							today: this.isToday(today, dayNo - daysLength, next.month, next.year),
							selectable: this.isSelectable(dayNo - daysLength, next.month, next.year, true),
						});
					} else {
						week.push({
							day: dayNo,
							month: month,
							year: year,
							today: this.isToday(today, dayNo, month, year),
							selectable: this.isSelectable(dayNo, month, year, false),
						});
					}

					dayNo++;
				}
			}

			if (this.showWeek) {
				weekNumbers.push(this.getWeekNumber(new Date(week[0].year, week[0].month, week[0].day)));
			}

			dates.push(week);
		}

		return {
			month: month,
			year: year,
			dates: <any>dates,
			weekNumbers: weekNumbers,
		};
	}

	decrementYear() {
		this.currentYear--;
		let _yearOptions = <number[]>this.yearOptions;

		if (this.yearNavigator && this.currentYear < _yearOptions[0]) {
			let difference = _yearOptions[_yearOptions.length - 1] - _yearOptions[0];
			this.populateYearOptions(
				_yearOptions[0] - difference,
				_yearOptions[_yearOptions.length - 1] - difference,
			);
		}
	}

	decrementDecade() {
		this.currentYear = this.currentYear - 10;
	}

	incrementDecade() {
		this.currentYear = this.currentYear + 10;
	}

	incrementYear() {
		this.currentYear++;
		let _yearOptions = <number[]>this.yearOptions;

		if (this.yearNavigator && this.currentYear > _yearOptions[_yearOptions.length - 1]) {
			let difference = _yearOptions[_yearOptions.length - 1] - _yearOptions[0];
			this.populateYearOptions(
				_yearOptions[0] + difference,
				_yearOptions[_yearOptions.length - 1] + difference,
			);
		}
	}

	shouldSelectDate(dateMeta: any) {
		if (this.isMultipleSelection())
			return this.maxDateCount != null
				? this.maxDateCount > (this.value ? this.value.length : 0)
				: true;
		else return true;
	}

	setCurrentHourPM(hours: number) {
		if (this.hourFormat == "12") {
			this.pm = hours > 11;
			if (hours >= 12) {
				this.currentHour = hours == 12 ? 12 : hours - 12;
			} else {
				this.currentHour = hours == 0 ? 12 : hours;
			}
		} else {
			this.currentHour = hours;
		}
	}

	getFirstDayOfMonthIndex(month: number, year: number) {
		let day = new Date();
		day.setDate(1);
		day.setMonth(month);
		day.setFullYear(year);

		let dayIndex = day.getDay() + this.getSundayIndex();
		return dayIndex >= 7 ? dayIndex - 7 : dayIndex;
	}

	getDaysCountInMonth(month: number, year: number) {
		return 32 - this.daylightSavingAdjust(new Date(year, month, 32)).getDate();
	}

	getDaysCountInPrevMonth(month: number, year: number) {
		let prev = this.getPreviousMonthAndYear(month, year);
		return this.getDaysCountInMonth(prev.month, prev.year);
	}

	getPreviousMonthAndYear(month: number, year: number) {
		let m, y;

		if (month === 0) {
			m = 11;
			y = year - 1;
		} else {
			m = month - 1;
			y = year;
		}

		return { month: m, year: y };
	}

	getNextMonthAndYear(month: number, year: number) {
		let m, y;

		if (month === 11) {
			m = 0;
			y = year + 1;
		} else {
			m = month + 1;
			y = year;
		}

		return { month: m, year: y };
	}

	getSundayIndex() {
		let firstDayOfWeek = this.getFirstDateOfWeek();

		return firstDayOfWeek > 0 ? 7 - firstDayOfWeek : 0;
	}

	isComparable() {
		return this.value != null && typeof this.value !== "string";
	}

	isMonthSelected(month: number) {
		if (this.isComparable() && !this.isMultipleSelection()) {
			const [start, end] = this.isRangeSelection() ? this.value : [this.value, this.value];
			const selected = new Date(this.currentYear, month, 1);
			return selected >= start && selected <= (end ?? start);
		}
		return false;
	}

	isMonthDisabled(month: number, year?: number) {
		const yearToCheck = year ?? this.currentYear;

		for (let day = 1; day < this.getDaysCountInMonth(month, yearToCheck) + 1; day++) {
			if (this.isSelectable(day, month, yearToCheck, false)) {
				return false;
			}
		}
		return true;
	}

	isYearDisabled(year: number) {
		return Array(12)
			.fill(0)
			.every((v, month) => this.isMonthDisabled(month, year));
	}

	isYearSelected(year: number) {
		if (this.isComparable()) {
			let value = this.isRangeSelection() ? this.value[0] : this.value;

			return !this.isMultipleSelection() ? value.getFullYear() === year : false;
		}

		return false;
	}

	isDateEquals(value: any, dateMeta: any) {
		if (value && ObjectUtils.isDate(value))
			return (
				value.getDate() === dateMeta.day &&
				value.getMonth() === dateMeta.month &&
				value.getFullYear() === dateMeta.year
			);
		else return false;
	}

	isSingleSelection(): boolean {
		return this.selectionMode === "single";
	}

	isRangeSelection(): boolean {
		return this.selectionMode === "range";
	}

	isMultipleSelection(): boolean {
		return this.selectionMode === "multiple";
	}

	isToday(today: Date, day: number, month: number, year: number): boolean {
		return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
	}

	isSelectable(day: any, month: any, year: any, otherMonth: any): boolean {
		let validMin = true;
		let validMax = true;
		let validDate = true;
		let validDay = true;

		if (otherMonth && !this.selectOtherMonths) {
			return false;
		}

		// if (this.minDate) {
		// 	if (this.minDate.getFullYear() > year) {
		// 		validMin = false;
		// 	} else if (this.minDate.getFullYear() === year && this.currentView != "year") {
		// 		if (this.minDate.getMonth() > month) {
		// 			validMin = false;
		// 		} else if (this.minDate.getMonth() === month) {
		// 			if (this.minDate.getDate() > day) {
		// 				validMin = false;
		// 			}
		// 		}
		// 	}
		// }
		//
		// if (this.maxDate) {
		// 	if (this.maxDate.getFullYear() < year) {
		// 		validMax = false;
		// 	} else if (this.maxDate.getFullYear() === year) {
		// 		if (this.maxDate.getMonth() < month) {
		// 			validMax = false;
		// 		} else if (this.maxDate.getMonth() === month) {
		// 			if (this.maxDate.getDate() < day) {
		// 				validMax = false;
		// 			}
		// 		}
		// 	}
		// }
		//
		// if (this.disabledDates) {
		// 	validDate = !this.isDateDisabled(day, month, year);
		// }
		//
		// if (this.disabledDays) {
		// 	validDay = !this.isDayDisabled(day, month, year);
		// }

		return validMin && validMax && validDate && validDay;
	}

	isDateDisabled(day: number, month: number, year: number): boolean {
		// if (this.disabledDates) {
		// 	for (let disabledDate of this.disabledDates) {
		// 		if (
		// 			disabledDate.getFullYear() === year &&
		// 			disabledDate.getMonth() === month &&
		// 			disabledDate.getDate() === day
		// 		) {
		// 			return true;
		// 		}
		// 	}
		// }

		return false;
	}

	isDayDisabled(day: number, month: number, year: number): boolean {
		// if (this.disabledDays) {
		// 	let weekday = new Date(year, month, day);
		// 	let weekdayNumber = weekday.getDay();
		// 	return this.disabledDays.indexOf(weekdayNumber) !== -1;
		// }
		return false;
	}
	getMonthName(index: number) {
		return this.getTranslation("monthNames")[index];
	}

	getYear(month: any) {
		return this.currentView === "month" ? this.currentYear : month.year;
	}

	convertTo24Hour(hours: number, pm: boolean) {
		//@ts-ignore
		if (this.hourFormat == "12") {
			if (hours === 12) {
				return pm ? 12 : 0;
			} else {
				return pm ? hours + 12 : hours;
			}
		}
		return hours;
	}

	isValidDate(date: any) {
		return ObjectUtils.isDate(date) && date != null;
	}

	daylightSavingAdjust(date: any) {
		if (!date) {
			return null;
		}

		date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);

		return date;
	}

	updateFilledState() {
		this.filled = (this.inputFieldValue && this.inputFieldValue != "") as boolean;
	}

	isValidDateForTimeConstraints(selectedDate: Date) {
		if (this.keepInvalid) {
			return true; // If we are keeping invalid dates, we don't need to check for time constraints
		}
		return (
			(!this._minDate || selectedDate >= this._minDate) &&
			(!this._maxDate || selectedDate <= this._maxDate)
		);
	}
}
