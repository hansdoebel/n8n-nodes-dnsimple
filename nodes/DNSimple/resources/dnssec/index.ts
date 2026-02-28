import type { INodeProperties } from "n8n-workflow";
import type { ResourceDefinition, ResourceOperationHandler } from "../../helpers/types";
import {
	dnssecGetStatusFields,
	dnssecGetStatusExecute,
	dnssecEnableFields,
	dnssecEnableExecute,
	dnssecDisableFields,
	dnssecDisableExecute,
	dnssecListDsRecordsFields,
	dnssecListDsRecordsExecute,
	dnssecCreateDsRecordFields,
	dnssecCreateDsRecordExecute,
	dnssecGetDsRecordFields,
	dnssecGetDsRecordExecute,
	dnssecDeleteDsRecordFields,
	dnssecDeleteDsRecordExecute,
} from "./operations";

const dnssecOperations: INodeProperties[] = [
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

const dnssecFields: INodeProperties[] = [
	...dnssecGetStatusFields,
	...dnssecEnableFields,
	...dnssecDisableFields,
	...dnssecListDsRecordsFields,
	...dnssecCreateDsRecordFields,
	...dnssecGetDsRecordFields,
	...dnssecDeleteDsRecordFields,
];

const dnssecHandlers: Record<string, ResourceOperationHandler> = {
	getStatus: dnssecGetStatusExecute,
	enable: dnssecEnableExecute,
	disable: dnssecDisableExecute,
	listDsRecords: dnssecListDsRecordsExecute,
	createDsRecord: dnssecCreateDsRecordExecute,
	getDsRecord: dnssecGetDsRecordExecute,
	deleteDsRecord: dnssecDeleteDsRecordExecute,
};

export const dnssecResource: ResourceDefinition = {
	name: "dnssec",
	operations: dnssecOperations,
	fields: dnssecFields,
	handlers: dnssecHandlers,
};
