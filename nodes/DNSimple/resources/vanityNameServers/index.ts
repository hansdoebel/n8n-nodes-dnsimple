import type { ResourceDefinition } from "@dnsimple-types/registry";
import {
	vanityNameServerFields,
	vanityNameServerOperations,
} from "./VanityNameServersDescription";
import { vanityNameServerMethods } from "./methods";

export const vanityNameServerResource: ResourceDefinition = {
	name: "vanityNameServer",
	operations: vanityNameServerOperations,
	fields: vanityNameServerFields,
	handlers: vanityNameServerMethods,
};

export * from "./VanityNameServersDescription";
export * from "./methods";
