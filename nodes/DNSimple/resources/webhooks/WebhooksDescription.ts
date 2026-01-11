import type { INodeProperties } from "n8n-workflow";
import * as operations from "./operations";

export const webhookOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["webhook"],
			},
		},
		options: [
			{
				name: "Create",
				value: "create",
				action: "Create a webhook",
				description: "Create a new webhook",
			},
			{
				name: "Delete",
				value: "delete",
				action: "Delete a webhook",
				description: "Delete a webhook",
			},
			{
				name: "Get",
				value: "get",
				action: "Get a webhook",
				description: "Retrieve a webhook",
			},
			{
				name: "List",
				value: "list",
				action: "List webhooks",
				description: "List all webhooks in the account",
			},
		],
		default: "list",
	},
];

const webhookFieldArrays = Object.values(operations).filter(
	(v): v is INodeProperties[] => Array.isArray(v),
);

export const webhookFields: INodeProperties[] = [...webhookFieldArrays.flat()];
