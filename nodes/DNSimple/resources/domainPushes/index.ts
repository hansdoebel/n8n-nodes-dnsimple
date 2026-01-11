import type { ResourceDefinition } from "@dnsimple-types/registry";
import {
	domainPushFields,
	domainPushOperations,
} from "./DomainPushesDescription";
import { domainPushMethods } from "./methods";

export const domainPushResource: ResourceDefinition = {
	name: "domainPush",
	operations: domainPushOperations,
	fields: domainPushFields,
	handlers: domainPushMethods,
};

export * from "./DomainPushesDescription";
export * from "./methods";
