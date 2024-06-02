import { ChangeEvent, useState } from "react";

export function useInputNumber({ value, isFloat }: { value: number; isFloat: boolean }) {
	const [inputValue, setInputValue] = useState<string>(value === 0 ? "" : value.toString());
	const [numberValue, setNumberValue] = useState<number>(value);

	function onValueChange(e: ChangeEvent<HTMLInputElement>) {
		const v = e.currentTarget.value;

		if (v === "") {
			if (inputValue === "") return;
			setInputValue("");
			return setNumberValue(0);
		}

		const parsed = isFloat ? parseFloat(v) : parseInt(v);

		if (isNaN(parsed)) return setInputValue(numberValue.toString());

		setNumberValue(parsed);
		setInputValue(v);
	}

	function ___setNumberValue(v: number) {
		const stringValue = v === 0 ? "" : v.toString();
		setInputValue(stringValue);
		setNumberValue(v);
	}

	return [inputValue, numberValue, ___setNumberValue, onValueChange] as const;
}
