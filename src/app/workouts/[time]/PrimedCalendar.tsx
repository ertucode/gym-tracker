import { Calendar as PrimeCalendar } from "primereact/calendar";
import { useState } from "react";

export function PrimedCalendar({
	name,
	defaultValue,
}: {
	name: string;
	defaultValue?: Date | null;
}) {
	const [value, setValue] = useState(defaultValue);
	return (
		<PrimeCalendar name={name} value={value} onChange={(e) => setValue(e.value)} showTime touchUI />
	);
}
