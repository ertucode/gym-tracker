import { Dispatch, SetStateAction } from "react";
import { NumberPicker } from "./NumberPicker";

type HourPickerProps = {
	selectedDate: Date | null | undefined;
	setSelectedDate: Dispatch<SetStateAction<Date | null | undefined>>;
};
export function HourPicker({ selectedDate, setSelectedDate }: HourPickerProps) {
	return (
		<div className="mt-3 flex justify-center gap-3">
			<NumberPicker
				val={(selectedDate ?? new Date()).getHours()}
				min={0}
				max={23}
				onValChange={(v) =>
					setSelectedDate((d) => {
						if (!d) return new Date(new Date().setHours(v));
						return new Date(d.setHours(v));
					})
				}
				onGoUnderMin={() => {
					setSelectedDate((d) => {
						const date = d ?? new Date();
						return new Date(date.getTime() - 1000 * 60 * 60);
					});
				}}
				onGoOverMax={() => {
					setSelectedDate((d) => {
						const date = d ?? new Date();
						return new Date(date.getTime() + 1000 * 60 * 60);
					});
				}}
			/>
			<NumberPicker
				val={(selectedDate ?? new Date()).getMinutes()}
				min={0}
				max={59}
				onValChange={(v) =>
					setSelectedDate((d) => {
						const date = d ?? new Date();
						return new Date(date.setMinutes(v));
					})
				}
				onGoUnderMin={() => {
					setSelectedDate((d) => {
						const date = d ?? new Date();
						return new Date(date.getTime() - 1000 * 60);
					});
				}}
				onGoOverMax={() => {
					setSelectedDate((d) => {
						const date = d ?? new Date();
						return new Date(date.getTime() + 1000 * 60);
					});
				}}
			/>
		</div>
	);
}
