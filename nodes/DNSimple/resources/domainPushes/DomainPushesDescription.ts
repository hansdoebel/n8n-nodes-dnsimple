import type { INodeProperties } from "n8n-workflow";
import * as operations from "./operations";

export const domainPushOperations: INodeProperties[] = [
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

const domainPushFieldArrays = Object.values(operations).filter(
	(v): v is INodeProperties[] => Array.isArray(v),
);

export const domainPushFields: INodeProperties[] = [
	...domainPushFieldArrays.flat(),
];
