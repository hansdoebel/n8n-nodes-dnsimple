import type { INodeProperties } from "n8n-workflow";
import * as operations from "./operations";

export const contactOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["contact"],
			},
		},
		options: [
			{
				name: "Create",
				value: "create",
				action: "Create a contact",
				description: "Create a new contact",
			},
			{
				name: "Delete",
				value: "delete",
				action: "Delete a contact",
				description: "Delete a contact",
			},
			{
				name: "Get",
				value: "get",
				action: "Get a contact",
				description: "Retrieve a contact",
			},
			{
				name: "List",
				value: "list",
				action: "List contacts",
				description: "List all contacts in the account",
			},
			{
				name: "Update",
				value: "update",
				action: "Update a contact",
				description: "Update an existing contact",
			},
		],
		default: "list",
	},
];

const contactFieldArrays = Object.values(operations).filter(
	(v): v is INodeProperties[] => Array.isArray(v),
);

export const contactFields: INodeProperties[] = [...contactFieldArrays.flat()];
