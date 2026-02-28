import type { INodeProperties } from "n8n-workflow";
import type { ResourceDefinition } from "../../helpers/types";
import {
	certificateDownloadExecute,
	certificateDownloadFields,
	certificateGetExecute,
	certificateGetFields,
	certificateGetPrivateKeyExecute,
	certificateGetPrivateKeyFields,
	certificateIssueExecute,
	certificateIssueFields,
	certificateListExecute,
	certificateListFields,
	certificateOrderExecute,
	certificateOrderFields,
	certificateRenewExecute,
	certificateRenewFields,
} from "./operations";

export const certificateOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["certificate"],
			},
		},
		options: [
			{
				name: "Download",
				value: "download",
				action: "Download a certificate",
				description: "Download a certificate with chain",
			},
			{
				name: "Get",
				value: "get",
				action: "Get a certificate",
				description: "Retrieve a certificate",
			},
			{
				name: "Get Private Key",
				value: "getPrivateKey",
				action: "Get certificate private key",
				description: "Retrieve the private key for a certificate",
			},
			{
				name: "Issue Let's Encrypt",
				value: "issue",
				action: 'Issue let s encrypt certificate',
				description: "Issue a pending Let's Encrypt certificate",
			},
			{
				name: "List",
				value: "list",
				action: "List certificates",
				description: "List all certificates for a domain",
			},
			{
				name: "Order Let's Encrypt",
				value: "order",
				action: 'Order let s encrypt certificate',
				description: "Order a new Let's Encrypt certificate",
			},
			{
				name: "Renew Let's Encrypt",
				value: "renew",
				action: 'Renew let s encrypt certificate',
				description: "Renew a Let's Encrypt certificate",
			},
		],
		default: "list",
	},
];

export const certificateFields: INodeProperties[] = [
	...certificateListFields,
	...certificateGetFields,
	...certificateDownloadFields,
	...certificateGetPrivateKeyFields,
	...certificateOrderFields,
	...certificateIssueFields,
	...certificateRenewFields,
];

export const certificateResource: ResourceDefinition = {
	name: "certificate",
	operations: certificateOperations,
	fields: certificateFields,
	handlers: {
		list: certificateListExecute,
		get: certificateGetExecute,
		download: certificateDownloadExecute,
		getPrivateKey: certificateGetPrivateKeyExecute,
		order: certificateOrderExecute,
		issue: certificateIssueExecute,
		renew: certificateRenewExecute,
	},
};
