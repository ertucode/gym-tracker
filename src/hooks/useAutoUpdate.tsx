import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export function useAutoUpdate<T>(val: T, ms: number, updater: (val: T) => Promise<any>) {
	const [debouncedState] = useDebounce(val, ms);
	const [updating, setUpdating] = useState<void[]>([]);

	const [debouncedUpdating] = useDebounce(updating.length > 0, 100);

	useEffect(() => {
		setUpdating((s) => [...s, undefined]);
		updater(val).finally(() => setUpdating((u) => u.slice(0, -1)));
	}, [val]);

	return [debouncedUpdating, debouncedState] as const;
}
