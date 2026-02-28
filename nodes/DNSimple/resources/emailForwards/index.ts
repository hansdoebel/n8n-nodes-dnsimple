import type { INodeProperties } from "n8n-workflow";
import type { ResourceDefinition } from "../../helpers/types";
import {
	emailForwardCreateFields,
	emailForwardCreateExecute,
	emailForwardDeleteFields,
	emailForwardDeleteExecute,
	emailForwardGetFields,
	emailForwardGetExecute,
	emailForwardListFields,
	emailForwardListExecute,
} from "./operations";

const emailForwardOperations: INodeProperties[] = [
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

const emailForwardFields: INodeProperties[] = [
	...emailForwardCreateFields,
	...emailForwardDeleteFields,
	...emailForwardGetFields,
	...emailForwardListFields,
];

export const emailForwardResource: ResourceDefinition = {
	name: "emailForward",
	operations: emailForwardOperations,
	fields: emailForwardFields,
	handlers: {
		list: emailForwardListExecute,
		create: emailForwardCreateExecute,
		get: emailForwardGetExecute,
		delete: emailForwardDeleteExecute,
	},
};
