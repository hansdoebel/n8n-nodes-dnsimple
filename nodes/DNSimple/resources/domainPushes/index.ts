import type { INodeProperties } from "n8n-workflow";
import type { ResourceDefinition, ResourceOperationHandler } from "../../helpers/types";
import {
	domainPushAcceptExecute,
	domainPushAcceptFields,
	domainPushInitiateExecute,
	domainPushInitiateFields,
	domainPushListExecute,
	domainPushListFields,
	domainPushRejectExecute,
	domainPushRejectFields,
} from "./operations";

const domainPushOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["domainPush"],
			},
		},
		options: [
			{
				name: "Accept",
				value: "accept",
				action: "Accept a push",
				description: "Accept a domain push",
			},
			{
				name: "Initiate",
				value: "initiate",
				action: "Initiate a push",
				description: "Initiate a domain push to another account",
			},
			{
				name: "List",
				value: "list",
				action: "List pushes",
				description: "List pending domain pushes",
			},
			{
				name: "Reject",
				value: "reject",
				action: "Reject a push",
				description: "Reject a domain push",
			},
		],
		default: "list",
	},
];

const domainPushFields: INodeProperties[] = [
	...domainPushAcceptFields,
	...domainPushInitiateFields,
	...domainPushListFields,
	...domainPushRejectFields,
];

const domainPushMethods: Record<string, ResourceOperationHandler> = {
	list: domainPushListExecute,
	initiate: domainPushInitiateExecute,
	accept: domainPushAcceptExecute,
	reject: domainPushRejectExecute,
};

export const domainPushResource: ResourceDefinition = {
	name: "domainPush",
	operations: domainPushOperations,
	fields: domainPushFields,
	handlers: domainPushMethods,
};
