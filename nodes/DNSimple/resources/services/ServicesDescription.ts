import type { INodeProperties } from "n8n-workflow";
import * as operations from "./operations";

export const serviceOperations: INodeProperties[] = [
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

const serviceFieldArrays = Object.values(operations).filter(
	(v): v is INodeProperties[] => Array.isArray(v),
);

export const serviceFields: INodeProperties[] = [...serviceFieldArrays.flat()];
