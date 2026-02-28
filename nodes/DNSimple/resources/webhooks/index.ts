import type { INodeProperties } from "n8n-workflow";
import type { ResourceDefinition } from "../../helpers/types";
import {
	webhookListFields,
	webhookListExecute,
	webhookCreateFields,
	webhookCreateExecute,
	webhookGetFields,
	webhookGetExecute,
	webhookDeleteFields,
	webhookDeleteExecute,
} from "./operations";

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

export const webhookFields: INodeProperties[] = [
	...webhookListFields,
	...webhookCreateFields,
	...webhookGetFields,
	...webhookDeleteFields,
];

export const webhookResource: ResourceDefinition = {
	name: "webhook",
	operations: webhookOperations,
	fields: webhookFields,
	handlers: {
		list: webhookListExecute,
		create: webhookCreateExecute,
		get: webhookGetExecute,
		delete: webhookDeleteExecute,
	},
};
