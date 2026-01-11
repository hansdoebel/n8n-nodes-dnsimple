import type { ResourceDefinition } from "@dnsimple-types/registry";
import { templateFields, templateOperations } from "./TemplatesDescription";
import { templateHandlers, templateMethods } from "./methods";

export const templateResource: ResourceDefinition = {
	name: "template",
	operations: templateOperations,
	fields: templateFields,
	handlers: templateHandlers,
	methods: templateMethods,
};

export * from "./TemplatesDescription";
export * from "./methods";
