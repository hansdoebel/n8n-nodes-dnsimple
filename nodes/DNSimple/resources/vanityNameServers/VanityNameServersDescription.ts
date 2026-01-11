import type { INodeProperties } from "n8n-workflow";
import * as operations from "./operations";

export const vanityNameServerOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["vanityNameServer"],
			},
		},
		options: [
			{
				name: "Disable",
				value: "disable",
				action: "Disable vanity name servers",
				description: "Disable vanity name servers for a domain",
			},
			{
				name: "Enable",
				value: "enable",
				action: "Enable vanity name servers",
				description: "Enable vanity name servers for a domain",
			},
		],
		default: "enable",
	},
];

const vanityNameServerFieldArrays = Object.values(operations).filter(
	(v): v is INodeProperties[] => Array.isArray(v),
);

export const vanityNameServerFields: INodeProperties[] = [
	...vanityNameServerFieldArrays.flat(),
];
