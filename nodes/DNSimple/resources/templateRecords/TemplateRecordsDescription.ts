import type { INodeProperties } from "n8n-workflow";
import * as operations from "./operations";

export const templateRecordOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["templateRecord"],
			},
		},
		options: [
			{
				name: "Create",
				value: "create",
				action: "Create a template record",
				description: "Create a new record in a template",
			},
			{
				name: "Delete",
				value: "delete",
				action: "Delete a template record",
				description: "Delete a record from a template",
			},
			{
				name: "Get",
				value: "get",
				action: "Get a template record",
				description: "Retrieve a template record",
			},
			{
				name: "List",
				value: "list",
				action: "List template records",
				description: "List all records in a template",
			},
		],
		default: "list",
	},
];

const templateRecordFieldArrays = Object.values(operations).filter(
	(v): v is INodeProperties[] => Array.isArray(v),
);

export const templateRecordFields: INodeProperties[] = [
	...templateRecordFieldArrays.flat(),
];
