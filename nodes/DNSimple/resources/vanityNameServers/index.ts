import type { INodeProperties } from "n8n-workflow";
import type { ResourceDefinition } from "../../helpers/types";
import {
	vanityNameServerEnableExecute,
	vanityNameServerEnableFields,
	vanityNameServerDisableExecute,
	vanityNameServerDisableFields,
} from "./operations";

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

export const vanityNameServerFields: INodeProperties[] = [
	...vanityNameServerEnableFields,
	...vanityNameServerDisableFields,
];

export const vanityNameServerResource: ResourceDefinition = {
	name: "vanityNameServer",
	operations: vanityNameServerOperations,
	fields: vanityNameServerFields,
	handlers: {
		enable: vanityNameServerEnableExecute,
		disable: vanityNameServerDisableExecute,
	},
};
