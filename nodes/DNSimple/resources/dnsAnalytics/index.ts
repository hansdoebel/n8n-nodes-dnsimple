import type { INodeProperties } from "n8n-workflow";
import type { ResourceDefinition } from "../../helpers/types";
import { dnsAnalyticsQueryFields, dnsAnalyticsQueryExecute } from "./operations";

const dnsAnalyticsOperations: INodeProperties[] = [
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

const dnsAnalyticsFields: INodeProperties[] = [
	...dnsAnalyticsQueryFields,
];

export const dnsAnalyticsResource: ResourceDefinition = {
	name: "dnsAnalytics",
	operations: dnsAnalyticsOperations,
	fields: dnsAnalyticsFields,
	handlers: {
		query: dnsAnalyticsQueryExecute,
	},
};
