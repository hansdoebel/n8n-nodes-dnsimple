import type { INodeProperties } from "n8n-workflow";
import * as operations from "./operations";

export const domainOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["domain"],
			},
		},
		options: [
			{
				name: "Create",
				value: "create",
				action: "Create a domain",
				description: "Add a domain to the account",
			},
			{
				name: "Delete",
				value: "delete",
				action: "Delete a domain",
				description: "Permanently delete a domain from the account",
			},
			{
				name: "Get",
				value: "get",
				action: "Get a domain",
				description: "Retrieve a domain",
			},
			{
				name: "List",
				value: "list",
				action: "List domains",
				description: "List all domains in the account",
			},
		],
		default: "list",
	},
];

const domainFieldArrays = Object.values(operations).filter(
	(v): v is INodeProperties[] => Array.isArray(v),
);

export const domainFields: INodeProperties[] = [...domainFieldArrays.flat()];
