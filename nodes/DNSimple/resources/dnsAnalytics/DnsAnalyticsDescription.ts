import type { INodeProperties } from "n8n-workflow";
import * as operations from "./operations";

export const dnsAnalyticsOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["dnsAnalytics"],
			},
		},
		options: [
			{
				name: "Query",
				value: "query",
				action: "Query DNS analytics",
				description: "Query DNS analytics data",
			},
		],
		default: "query",
	},
];

const dnsAnalyticsFieldArrays = Object.values(operations).filter(
	(v): v is INodeProperties[] => Array.isArray(v),
);

export const dnsAnalyticsFields: INodeProperties[] = [
	...dnsAnalyticsFieldArrays.flat(),
];
