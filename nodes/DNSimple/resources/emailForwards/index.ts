import type { ResourceDefinition } from "@dnsimple-types/registry";
import {
	emailForwardFields,
	emailForwardOperations,
} from "./EmailForwardsDescription";
import { emailForwardMethods } from "./methods";

export const emailForwardResource: ResourceDefinition = {
	name: "emailForward",
	operations: emailForwardOperations,
	fields: emailForwardFields,
	handlers: emailForwardMethods,
};

export * from "./EmailForwardsDescription";
export * from "./methods";
