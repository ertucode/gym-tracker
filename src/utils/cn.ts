export function cn(...params: (string | boolean | undefined | null)[]) {
	return params.filter((p) => p).join(" ");
}
