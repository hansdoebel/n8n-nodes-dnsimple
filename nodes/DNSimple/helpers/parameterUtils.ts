import type { IExecuteFunctions } from "n8n-workflow";

export function resolveResourceLocator(
	context: IExecuteFunctions,
	paramName: string,
	index: number,
): string {
	const raw = context.getNodeParameter(paramName, index) as
		| string
		| { mode: string; value: string };
	if (typeof raw === "object" && raw !== null) {
		return raw.value;
	}
	return raw;
}
