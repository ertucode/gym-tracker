import { DateTimePicker } from "@/components/ui/date-time-picker";
import { useState } from "react";
import { SelectRangeEventHandler, SelectSingleEventHandler } from "react-day-picker";

export function PrimedCalendar({
	name,
	defaultValue,
}: {
	name: string;
	defaultValue: Date | undefined;
}) {
	const [value, setValue] = useState<Date | undefined>(defaultValue ?? new Date());
	const handler: SelectSingleEventHandler = (_, selectedDay) => setValue(selectedDay);
	return (
		<div>
			<input name={name} hidden value={value?.toLocaleString() ?? ""} onChange={() => {}}></input>
			<DateTimePicker date={value} setDate={setValue} />
		</div>
	);
}
