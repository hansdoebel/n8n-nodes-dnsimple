import type { ResourceDefinition } from "@dnsimple-types/registry";
import { registrarFields, registrarOperations } from "./RegistrarDescription";
import * as operations from "./operations";
import { registrarMethods } from "./methods";

export const registrarResource: ResourceDefinition = {
	name: "registrar",
	operations: registrarOperations,
	fields: registrarFields,
	handlers: {
		checkAvailability: operations.checkAvailabilityExecute,
		getPrices: operations.getPricesExecute,
		register: operations.registerExecute,
		renew: operations.renewExecute,
		transfer: operations.transferExecute,
	},
	methods: registrarMethods,
};

export * from "./RegistrarDescription";
export * from "./operations";
