import type { ResourceDefinition } from "@dnsimple-types/registry";
import { domainFields, domainOperations } from "./DomainsDescription";
import * as operations from "./operations";
import { domainMethods } from "./methods";

export const domainResource: ResourceDefinition = {
	name: "domain",
	operations: domainOperations,
	fields: domainFields,
	handlers: {
		list: operations.domainListExecute,
		create: operations.domainCreateExecute,
		get: operations.domainGetExecute,
		delete: operations.domainDeleteExecute,
	},
	methods: domainMethods,
};

export * from "./DomainsDescription";
export * from "./operations";
