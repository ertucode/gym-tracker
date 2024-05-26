import { ChevronUpIcon } from "@heroicons/react/16/solid";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

type NumberPickerProps = {
	min: number;
	max: number;
	val: number;
	onValChange?: (val: number) => void;
	onGoUnderMin?: () => void;
	onGoOverMax?: () => void;
};
export function NumberPicker({
	val,
	min,
	max,
	onValChange,
	onGoOverMax,
	onGoUnderMin,
}: NumberPickerProps) {
	return (
		<div className="flex flex-col items-center">
			<button
				className="flex items-center rounded-[50%] p-1 text-2xl leading-3 hover:bg-indigo-50"
				onClick={() => (val === max ? onGoOverMax?.() : onValChange?.(val + 1))}
			>
				<ChevronUpIcon className="size-6" />
			</button>
			<input
				type="number"
				value={val}
				className="text-center"
				size={1.3}
				onChange={(e) => {
					const val = parseInt(e.currentTarget.value);
					if (!Number.isInteger(val)) return;

					if (val < min) onGoUnderMin?.();
					else if (val > max) onGoOverMax?.();
					else onValChange?.(val);
				}}
			></input>
			<button
				className="flex items-center rounded-[50%] p-1 text-2xl leading-3 hover:bg-indigo-50"
				onClick={() => (val === min ? onGoUnderMin?.() : onValChange?.(val - 1))}
			>
				<ChevronDownIcon className="size-6" />
			</button>
		</div>
	);
}
