import type { ResourceDefinition } from "@dnsimple-types/registry";
import { zoneFields, zoneOperations } from "./ZonesDescription";
import { zoneHandlers, zoneMethods } from "./methods";

export const zoneResource: ResourceDefinition = {
	name: "zone",
	operations: zoneOperations,
	fields: zoneFields,
	handlers: zoneHandlers,
	methods: zoneMethods,
};

export * from "./ZonesDescription";
export * from "./methods";
