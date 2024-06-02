export async function withLogging<T>(p: () => Promise<T>): Promise<T> {
	try {
		return await p();
	} catch (e) {
		console.error(e);
		throw e;
	}
}
