export function newIndex(items: { index: number }[]) {
	if (items.length === 0) return 1;
	return Math.max(...items.map((i) => i.index)) + 1;
}
