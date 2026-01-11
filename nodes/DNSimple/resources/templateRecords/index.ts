import type { ResourceDefinition } from "@dnsimple-types/registry";
import {
	templateRecordFields,
	templateRecordOperations,
} from "./TemplateRecordsDescription";
import { templateRecordMethods } from "./methods";

export const templateRecordResource: ResourceDefinition = {
	name: "templateRecord",
	operations: templateRecordOperations,
	fields: templateRecordFields,
	handlers: templateRecordMethods,
};

export * from "./TemplateRecordsDescription";
export * from "./methods";
