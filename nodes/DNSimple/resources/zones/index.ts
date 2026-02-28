import type { INodeProperties } from "n8n-workflow";
import type { ResourceDefinition } from "../../helpers/types";
import { createListSearchMethod } from "../../helpers/listSearchFactory";
import { getZones } from "../../methods/loadOptions";
import {
	zoneActivateExecute,
	zoneActivateFields,
	zoneCheckDistributionExecute,
	zoneCheckDistributionFields,
	zoneDeactivateExecute,
	zoneDeactivateFields,
	zoneDownloadFileExecute,
	zoneDownloadFileFields,
	zoneGetExecute,
	zoneGetFields,
	zoneListExecute,
	zoneListFields,
} from "./operations";

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

export const zoneFields: INodeProperties[] = [
	...zoneListFields,
	...zoneGetFields,
	...zoneDownloadFileFields,
	...zoneCheckDistributionFields,
	...zoneActivateFields,
	...zoneDeactivateFields,
];

export const zoneResource: ResourceDefinition = {
	name: "zone",
	operations: zoneOperations,
	fields: zoneFields,
	handlers: {
		list: zoneListExecute,
		get: zoneGetExecute,
		downloadFile: zoneDownloadFileExecute,
		checkDistribution: zoneCheckDistributionExecute,
		activate: zoneActivateExecute,
		deactivate: zoneDeactivateExecute,
	},
	methods: {
		listSearch: {
			getZones: createListSearchMethod(getZones),
		},
	},
};
