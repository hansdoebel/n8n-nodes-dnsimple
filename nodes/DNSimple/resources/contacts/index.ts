import type { INodeProperties } from "n8n-workflow";
import type { ResourceDefinition } from "../../helpers/types";
import { createListSearchMethod } from "../../helpers/listSearchFactory";
import { getContacts } from "../../methods/loadOptions";
import {
	contactListExecute, contactListFields,
	contactCreateExecute, contactCreateFields,
	contactGetExecute, contactGetFields,
	contactUpdateExecute, contactUpdateFields,
	contactDeleteExecute, contactDeleteFields,
} from "./operations";

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

export const contactFields: INodeProperties[] = [
	...contactListFields,
	...contactCreateFields,
	...contactGetFields,
	...contactUpdateFields,
	...contactDeleteFields,
];

export const contactResource: ResourceDefinition = {
	name: "contact",
	operations: contactOperations,
	fields: contactFields,
	handlers: {
		list: contactListExecute,
		create: contactCreateExecute,
		get: contactGetExecute,
		update: contactUpdateExecute,
		delete: contactDeleteExecute,
	},
	methods: {
		listSearch: {
			getContacts: createListSearchMethod(getContacts),
		},
	},
};
