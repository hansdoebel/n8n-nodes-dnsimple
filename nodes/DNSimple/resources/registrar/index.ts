import type { INodeProperties } from "n8n-workflow";
import type { ResourceDefinition } from "../../helpers/types";
import {
	checkAvailabilityExecute,
	checkAvailabilityFields,
	getPricesExecute,
	getPricesFields,
	registerExecute,
	registerFields,
	renewExecute,
	renewFields,
	transferExecute,
	transferFields,
} from "./operations";

const registrarOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["registrar"],
			},
		},
		options: [
			{
				name: "Check Availability",
				value: "checkAvailability",
				action: "Check domain availability",
				description: "Check if a domain is available for registration",
			},
			{
				name: "Get Prices",
				value: "getPrices",
				action: "Get domain prices",
				description:
					"Get registration, renewal, and transfer prices for a domain",
			},
			{
				name: "Register",
				value: "register",
				action: "Register a domain",
				description: "Register a new domain",
			},
			{
				name: "Renew",
				value: "renew",
				action: "Renew a domain",
				description: "Renew a domain registration",
			},
			{
				name: "Transfer",
				value: "transfer",
				action: "Transfer a domain",
				description: "Transfer a domain from another registrar",
			},
		],
		default: "checkAvailability",
	},
];

const registrarFields: INodeProperties[] = [
	...checkAvailabilityFields,
	...getPricesFields,
	...registerFields,
	...renewFields,
	...transferFields,
];

export const registrarResource: ResourceDefinition = {
	name: "registrar",
	operations: registrarOperations,
	fields: registrarFields,
	handlers: {
		checkAvailability: checkAvailabilityExecute,
		getPrices: getPricesExecute,
		register: registerExecute,
		renew: renewExecute,
		transfer: transferExecute,
	},
};
