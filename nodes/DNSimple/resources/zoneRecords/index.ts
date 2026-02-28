import type { INodeProperties } from "n8n-workflow";
import type { ResourceDefinition } from "../../helpers/types";
import {
	zoneRecordCheckDistributionFields,
	zoneRecordCheckDistributionExecute,
	zoneRecordCreateFields,
	zoneRecordCreateExecute,
	zoneRecordDeleteFields,
	zoneRecordDeleteExecute,
	zoneRecordGetFields,
	zoneRecordGetExecute,
	zoneRecordListFields,
	zoneRecordListExecute,
	zoneRecordUpdateFields,
	zoneRecordUpdateExecute,
} from "./operations";

export const zoneRecordOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["zoneRecord"],
			},
		},
		options: [
			{
				name: "Check Distribution",
				value: "checkDistribution",
				action: "Check record distribution",
				description:
					"Check if a record is fully distributed across DNS servers",
			},
			{
				name: "Create",
				value: "create",
				action: "Create a record",
				description: "Create a DNS record in a zone",
			},
			{
				name: "Delete",
				value: "delete",
				action: "Delete a record",
				description: "Delete a DNS record from a zone",
			},
			{
				name: "Get",
				value: "get",
				action: "Get a record",
				description: "Retrieve a DNS record",
			},
			{
				name: "List",
				value: "list",
				action: "List records",
				description: "List all DNS records in a zone",
			},
			{
				name: "Update",
				value: "update",
				action: "Update a record",
				description: "Update a DNS record",
			},
		],
		default: "list",
	},
];

export const zoneRecordFields: INodeProperties[] = [
	...zoneRecordCheckDistributionFields,
	...zoneRecordCreateFields,
	...zoneRecordDeleteFields,
	...zoneRecordGetFields,
	...zoneRecordListFields,
	...zoneRecordUpdateFields,
];

export const zoneRecordResource: ResourceDefinition = {
	name: "zoneRecord",
	operations: zoneRecordOperations,
	fields: zoneRecordFields,
	handlers: {
		list: zoneRecordListExecute,
		create: zoneRecordCreateExecute,
		get: zoneRecordGetExecute,
		update: zoneRecordUpdateExecute,
		delete: zoneRecordDeleteExecute,
		checkDistribution: zoneRecordCheckDistributionExecute,
	},
};
