import type { ResourceDefinition } from "@dnsimple-types/registry";
import { webhookFields, webhookOperations } from "./WebhooksDescription";
import { webhookMethods } from "./methods";

export const webhookResource: ResourceDefinition = {
	name: "webhook",
	operations: webhookOperations,
	fields: webhookFields,
	handlers: webhookMethods,
};

export * from "./WebhooksDescription";
export * from "./methods";
