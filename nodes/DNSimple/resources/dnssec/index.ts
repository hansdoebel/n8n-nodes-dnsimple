import type { ResourceDefinition } from "@dnsimple-types/registry";
import { dnssecFields, dnssecOperations } from "./DnssecDescription";
import { dnssecMethods } from "./methods";

export const dnssecResource: ResourceDefinition = {
	name: "dnssec",
	operations: dnssecOperations,
	fields: dnssecFields,
	handlers: dnssecMethods,
};

export * from "./DnssecDescription";
export * from "./methods";
