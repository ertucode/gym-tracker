import { useRef } from "react";
import { WorkoutSet } from "./types";
import { useInputNumber } from "@/hooks/useInputNumber";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";

export function AddRep({
	addRep,
	workoutSet,
}: {
	addRep: (setId: number, weight: number, count: number) => Promise<unknown>;
	workoutSet: WorkoutSet;
}) {
	const [weightInputValue, weight, setWeight, weightValueChange] = useInputNumber({
		value: 0,
		isFloat: true,
	});
	const [countInputValue, count, setCount, countValueChange] = useInputNumber({
		value: 0,
		isFloat: false,
	});

	const firstInput = useRef<HTMLInputElement>(null);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				if (weight == null) return;
				if (count == null) return;

				addRep(workoutSet.id, weight, count).then((_) => {
					setWeight(0);
					setCount(0);
					firstInput.current?.focus();
				});
			}}
			className="col-span-4 grid grid-cols-subgrid"
		>
			<div className="px-3 py-1">
				<Input
					type="number"
					min="0"
					step="0.01"
					value={weightInputValue}
					ref={firstInput}
					onChange={weightValueChange}
				/>
			</div>
			<div className="px-2 py-1">
				<Input type="number" min="1" value={countInputValue} onChange={countValueChange} />
			</div>
			<div></div>
			<div>
				<Button variant="outline" size="icon">
					<PlusIcon className="size-4" />
				</Button>
			</div>
		</form>
	);
}
