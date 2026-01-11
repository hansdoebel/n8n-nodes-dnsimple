export function extractResourceLocatorValue(
	value: string | { mode: string; value: string },
): string {
	if (typeof value === "object" && value !== null) {
		return value.value;
	}
	return value;
}

export function extractResourceLocatorValueAsNumber(
	value: string | number | { mode: string; value: string },
): number {
	if (typeof value === "number") {
		return value;
	}
	if (typeof value === "object" && value !== null) {
		return parseInt(value.value, 10);
	}
	return parseInt(value, 10);
}
