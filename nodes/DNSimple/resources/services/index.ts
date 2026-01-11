import type { ResourceDefinition } from "@dnsimple-types/registry";
import { serviceFields, serviceOperations } from "./ServicesDescription";
import { serviceHandlers, serviceMethods } from "./methods";

export const serviceResource: ResourceDefinition = {
	name: "service",
	operations: serviceOperations,
	fields: serviceFields,
	handlers: serviceHandlers,
	methods: serviceMethods,
};

export * from "./ServicesDescription";
export * from "./methods";
