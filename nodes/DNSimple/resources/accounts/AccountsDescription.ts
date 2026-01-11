import type { INodeProperties } from "n8n-workflow";

export const accountOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["account"],
			},
		},
		options: [
			{
				name: "List",
				value: "list",
				action: "List accounts",
				description: "List all accounts the current credentials have access to",
			},
		],
		default: "list",
	},
];

export const accountFields: INodeProperties[] = [];
