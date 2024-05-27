"use client";

import { createExerciseAction } from "@/actions/actions";
import { FormEvent, useState } from "react";

// TODO: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API

export default function Home() {
	const [actions, setActions] = useState<{ action: string; metadata: any }[]>([]);

	const createExercise = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const value = Object.fromEntries(new FormData(e.currentTarget));
		const name = value.name.toString();

		const result = await createExerciseAction({ name });

		setActions((s) => [...s, { action: "exercise", metadata: { name, result } }]);
	};

	return (
		<div className="h-screen">
			<form className="flex flex-col items-start gap-3" onSubmit={createExercise}>
				<label>
					Name
					<input type="text" name="name"></input>
				</label>
				<button type="submit">CREATE EXERCISE</button>
			</form>
			<br />
			{actions.map((a, i) => (
				<div key={i}>{JSON.stringify(a, null, 4)}</div>
			))}
		</div>
	);
}
