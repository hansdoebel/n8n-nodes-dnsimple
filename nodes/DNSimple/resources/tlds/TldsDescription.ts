import type { INodeProperties } from "n8n-workflow";
import * as operations from "./operations";

export const tldOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["tld"],
			},
		},
		options: [
			{
				name: "Get",
				value: "get",
				action: "Get a TLD",
				description: "Retrieve details about a TLD",
			},
			{
				name: "Get Extended Attributes",
				value: "getExtendedAttributes",
				action: "Get TLD extended attributes",
				description: "Get extended attributes required for registration",
			},
			{
				name: "List",
				value: "list",
				action: 'List tl ds',
				description: "List all supported TLDs",
			},
		],
		default: "list",
	},
];

const tldFieldArrays = Object.values(operations).filter(
	(v): v is INodeProperties[] => Array.isArray(v),
);

export const tldFields: INodeProperties[] = [...tldFieldArrays.flat()];
