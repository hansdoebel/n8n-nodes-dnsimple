import type { INodeProperties } from "n8n-workflow";
import type { ResourceDefinition } from "../../helpers/types";
import { accountListExecute } from "./operations";

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

export const accountResource: ResourceDefinition = {
	name: "account",
	operations: accountOperations,
	fields: accountFields,
	handlers: {
		list: accountListExecute,
	},
};
