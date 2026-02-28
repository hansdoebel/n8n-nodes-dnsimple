import type { INodeProperties } from "n8n-workflow";
import type { ResourceDefinition } from "../../helpers/types";
import { createListSearchMethod } from "../../helpers/listSearchFactory";
import { getDomains } from "../../methods/loadOptions";
import {
	domainListFields,
	domainListExecute,
	domainCreateFields,
	domainCreateExecute,
	domainGetFields,
	domainGetExecute,
	domainDeleteFields,
	domainDeleteExecute,
} from "./operations";

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

export const domainFields: INodeProperties[] = [
	...domainListFields,
	...domainCreateFields,
	...domainGetFields,
	...domainDeleteFields,
];

export const domainResource: ResourceDefinition = {
	name: "domain",
	operations: domainOperations,
	fields: domainFields,
	handlers: {
		list: domainListExecute,
		create: domainCreateExecute,
		get: domainGetExecute,
		delete: domainDeleteExecute,
	},
	methods: {
		listSearch: {
			getDomains: createListSearchMethod(getDomains),
		},
	},
};
