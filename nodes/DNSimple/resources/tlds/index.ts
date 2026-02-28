import type { INodeProperties } from "n8n-workflow";
import type { ResourceDefinition } from "../../helpers/types";
import {
	tldGetExecute,
	tldGetExtendedAttributesExecute,
	tldGetFields,
	tldGetExtendedAttributesFields,
	tldListExecute,
	tldListFields,
} from "./operations";

const tldOperations: INodeProperties[] = [
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

const tldFields: INodeProperties[] = [
	...tldGetFields,
	...tldGetExtendedAttributesFields,
	...tldListFields,
];

export const tldResource: ResourceDefinition = {
	name: "tld",
	operations: tldOperations,
	fields: tldFields,
	handlers: {
		list: tldListExecute,
		get: tldGetExecute,
		getExtendedAttributes: tldGetExtendedAttributesExecute,
	},
};
