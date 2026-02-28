import type { INodeProperties } from "n8n-workflow";
import type { ResourceDefinition, ResourceMethods, ResourceOperationHandler } from "../../helpers/types";
import { createListSearchMethod } from "../../helpers/listSearchFactory";
import { getServices } from "../../methods/loadOptions";
import {
	serviceApplyFields,
	serviceApplyExecute,
	serviceGetFields,
	serviceGetExecute,
	serviceListFields,
	serviceListExecute,
	serviceListAppliedFields,
	serviceListAppliedExecute,
	serviceUnapplyFields,
	serviceUnapplyExecute,
} from "./operations";

const serviceOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["service"],
			},
		},
		options: [
			{
				name: "Apply to Domain",
				value: "apply",
				action: "Apply service to domain",
				description: "Apply a one-click service to a domain",
			},
			{
				name: "Get",
				value: "get",
				action: "Get a service",
				description: "Retrieve a one-click service",
			},
			{
				name: "List",
				value: "list",
				action: "List services",
				description: "List all available one-click services",
			},
			{
				name: "List Applied",
				value: "listApplied",
				action: "List applied services",
				description: "List services applied to a domain",
			},
			{
				name: 'Unapply From Domain',
				value: "unapply",
				action: "Unapply service from domain",
				description: "Remove a one-click service from a domain",
			},
		],
		default: "list",
	},
];

const serviceFields: INodeProperties[] = [
	...serviceApplyFields,
	...serviceGetFields,
	...serviceListFields,
	...serviceListAppliedFields,
	...serviceUnapplyFields,
];

const serviceHandlers: Record<string, ResourceOperationHandler> = {
	list: serviceListExecute,
	get: serviceGetExecute,
	listApplied: serviceListAppliedExecute,
	apply: serviceApplyExecute,
	unapply: serviceUnapplyExecute,
};

const serviceMethods: ResourceMethods = {
	listSearch: {
		getServices: createListSearchMethod(getServices),
	},
};

export const serviceResource: ResourceDefinition = {
	name: "service",
	operations: serviceOperations,
	fields: serviceFields,
	handlers: serviceHandlers,
	methods: serviceMethods,
};
