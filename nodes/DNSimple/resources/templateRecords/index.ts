import type { INodeProperties } from "n8n-workflow";
import type { ResourceDefinition } from "../../helpers/types";
import {
	templateRecordCreateFields,
	templateRecordCreateExecute,
	templateRecordDeleteFields,
	templateRecordDeleteExecute,
	templateRecordGetFields,
	templateRecordGetExecute,
	templateRecordListFields,
	templateRecordListExecute,
} from "./operations";

const templateRecordOperations: INodeProperties[] = [
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

const templateRecordFields: INodeProperties[] = [
	...templateRecordCreateFields,
	...templateRecordDeleteFields,
	...templateRecordGetFields,
	...templateRecordListFields,
];

export const templateRecordResource: ResourceDefinition = {
	name: "templateRecord",
	operations: templateRecordOperations,
	fields: templateRecordFields,
	handlers: {
		list: templateRecordListExecute,
		create: templateRecordCreateExecute,
		get: templateRecordGetExecute,
		delete: templateRecordDeleteExecute,
	},
};
