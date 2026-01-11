import type { ResourceDefinition } from "@dnsimple-types/registry";
import { contactFields, contactOperations } from "./ContactsDescription";
import * as operations from "./operations";
import { contactMethods } from "./methods";

export const contactResource: ResourceDefinition = {
	name: "contact",
	operations: contactOperations,
	fields: contactFields,
	handlers: {
		list: operations.contactListExecute,
		create: operations.contactCreateExecute,
		get: operations.contactGetExecute,
		update: operations.contactUpdateExecute,
		delete: operations.contactDeleteExecute,
	},
	methods: contactMethods,
};

export * from "./ContactsDescription";
export * from "./operations";
