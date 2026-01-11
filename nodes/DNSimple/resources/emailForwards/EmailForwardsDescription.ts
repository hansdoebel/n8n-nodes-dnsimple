import type { INodeProperties } from "n8n-workflow";
import * as operations from "./operations";

export const emailForwardOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["emailForward"],
			},
		},
		options: [
			{
				name: "Create",
				value: "create",
				action: "Create an email forward",
				description: "Create a new email forward",
			},
			{
				name: "Delete",
				value: "delete",
				action: "Delete an email forward",
				description: "Delete an email forward",
			},
			{
				name: "Get",
				value: "get",
				action: "Get an email forward",
				description: "Retrieve an email forward",
			},
			{
				name: "List",
				value: "list",
				action: "List email forwards",
				description: "List all email forwards for a domain",
			},
		],
		default: "list",
	},
];

const emailForwardFieldArrays = Object.values(operations).filter(
	(v): v is INodeProperties[] => Array.isArray(v),
);

export const emailForwardFields: INodeProperties[] = [
	...emailForwardFieldArrays.flat(),
];
