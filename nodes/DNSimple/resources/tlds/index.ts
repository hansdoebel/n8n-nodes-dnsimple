import type { ResourceDefinition } from "@dnsimple-types/registry";
import { tldFields, tldOperations } from "./TldsDescription";
import { tldMethods } from "./methods";

export const tldResource: ResourceDefinition = {
	name: "tld",
	operations: tldOperations,
	fields: tldFields,
	handlers: tldMethods,
};

export * from "./TldsDescription";
export * from "./methods";
