import type { INodeProperties } from "n8n-workflow";
import * as operations from "./operations";

export const dnssecOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["dnssec"],
			},
		},
		options: [
			{
				name: "Create DS Record",
				value: "createDsRecord",
				action: "Create a DS record",
				description: "Create a delegation signer record",
			},
			{
				name: "Delete DS Record",
				value: "deleteDsRecord",
				action: "Delete a DS record",
				description: "Delete a delegation signer record",
			},
			{
				name: "Disable",
				value: "disable",
				action: "Disable DNSSEC",
				description: "Disable DNSSEC for a domain",
			},
			{
				name: "Enable",
				value: "enable",
				action: "Enable DNSSEC",
				description: "Enable DNSSEC for a domain",
			},
			{
				name: "Get DS Record",
				value: "getDsRecord",
				action: "Get a DS record",
				description: "Retrieve a delegation signer record",
			},
			{
				name: "Get Status",
				value: "getStatus",
				action: "Get DNSSEC status",
				description: "Get DNSSEC status for a domain",
			},
			{
				name: "List DS Records",
				value: "listDsRecords",
				action: "List DS records",
				description: "List all delegation signer records",
			},
		],
		default: "getStatus",
	},
];

const dnssecFieldArrays = Object.values(operations).filter(
	(v): v is INodeProperties[] => Array.isArray(v),
);

export const dnssecFields: INodeProperties[] = [...dnssecFieldArrays.flat()];
