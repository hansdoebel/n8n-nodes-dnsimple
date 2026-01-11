import type { INodeProperties } from "n8n-workflow";
import * as operations from "./operations";

export const zoneOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["zone"],
			},
		},
		options: [
			{
				name: "Activate DNS",
				value: "activate",
				action: "Activate DNS services",
				description: "Activate DNS services for a zone",
			},
			{
				name: "Check Distribution",
				value: "checkDistribution",
				action: "Check zone distribution",
				description: "Check if a zone is fully distributed across DNS servers",
			},
			{
				name: "Deactivate DNS",
				value: "deactivate",
				action: "Deactivate DNS services",
				description: "Deactivate DNS services for a zone",
			},
			{
				name: "Download Zone File",
				value: "downloadFile",
				action: "Download zone file",
				description: "Download a zone file in BIND format",
			},
			{
				name: "Get",
				value: "get",
				action: "Get a zone",
				description: "Retrieve a zone",
			},
			{
				name: "List",
				value: "list",
				action: "List zones",
				description: "List all zones in the account",
			},
		],
		default: "list",
	},
];

const zoneFieldArrays = Object.values(operations).filter(
	(v): v is INodeProperties[] => Array.isArray(v),
);

export const zoneFields: INodeProperties[] = [...zoneFieldArrays.flat()];
