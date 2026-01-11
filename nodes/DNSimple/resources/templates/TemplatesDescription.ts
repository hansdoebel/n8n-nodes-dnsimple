import type { INodeProperties } from "n8n-workflow";
import * as operations from "./operations";

export const templateOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["template"],
			},
		},
		options: [
			{
				name: "Apply to Domain",
				value: "applyToDomain",
				action: "Apply template to domain",
				description: "Apply a template to a domain",
			},
			{
				name: "Create",
				value: "create",
				action: "Create a template",
				description: "Create a new template",
			},
			{
				name: "Delete",
				value: "delete",
				action: "Delete a template",
				description: "Delete a template",
			},
			{
				name: "Get",
				value: "get",
				action: "Get a template",
				description: "Retrieve a template",
			},
			{
				name: "List",
				value: "list",
				action: "List templates",
				description: "List all templates in the account",
			},
			{
				name: "Update",
				value: "update",
				action: "Update a template",
				description: "Update a template",
			},
		],
		default: "list",
	},
];

const templateFieldArrays = Object.values(operations).filter(
	(v): v is INodeProperties[] => Array.isArray(v),
);

export const templateFields: INodeProperties[] = [
	...templateFieldArrays.flat(),
];
