import type { INodeProperties } from "n8n-workflow";
import type { ResourceDefinition, ResourceOperationHandler } from "../../helpers/types";
import { createListSearchMethod } from "../../helpers/listSearchFactory";
import { getTemplates } from "../../methods/loadOptions";
import {
	templateApplyToDomainFields,
	templateApplyToDomainExecute,
	templateCreateFields,
	templateCreateExecute,
	templateDeleteFields,
	templateDeleteExecute,
	templateGetFields,
	templateGetExecute,
	templateListFields,
	templateListExecute,
	templateUpdateFields,
	templateUpdateExecute,
} from "./operations";

const templateOperations: INodeProperties[] = [
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

const templateFields: INodeProperties[] = [
	...templateApplyToDomainFields,
	...templateCreateFields,
	...templateDeleteFields,
	...templateGetFields,
	...templateListFields,
	...templateUpdateFields,
];

const templateHandlers: Record<string, ResourceOperationHandler> = {
	list: templateListExecute,
	create: templateCreateExecute,
	get: templateGetExecute,
	update: templateUpdateExecute,
	delete: templateDeleteExecute,
	applyToDomain: templateApplyToDomainExecute,
};

export const templateResource: ResourceDefinition = {
	name: "template",
	operations: templateOperations,
	fields: templateFields,
	handlers: templateHandlers,
	methods: {
		listSearch: {
			getTemplates: createListSearchMethod(getTemplates),
		},
	},
};
