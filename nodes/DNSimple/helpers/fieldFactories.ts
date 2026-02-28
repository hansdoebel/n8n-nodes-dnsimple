import type { INodeProperties } from "n8n-workflow";

export function makeReturnAllFields(
	resource: string,
	operation: string,
): INodeProperties[] {
	return [
		{
			displayName: "Return All",
			name: "returnAll",
			type: "boolean",
			default: false,
			description:
				"Whether to return all results or only up to a given limit",
			displayOptions: {
				show: {
					resource: [resource],
					operation: [operation],
				},
			},
		},
		{
			displayName: "Limit",
			name: "limit",
			type: "number",
			default: 50,
			typeOptions: {
				minValue: 1,
			},
			description: "Max number of results to return",
			displayOptions: {
				show: {
					resource: [resource],
					operation: [operation],
					returnAll: [false],
				},
			},
		},
	];
}
