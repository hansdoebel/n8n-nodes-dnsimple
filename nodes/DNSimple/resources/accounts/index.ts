import type { ResourceDefinition } from "@dnsimple-types/registry";
import { accountFields, accountOperations } from "./AccountsDescription";
import * as operations from "./operations";

export const accountResource: ResourceDefinition = {
	name: "account",
	operations: accountOperations,
	fields: accountFields,
	handlers: {
		list: operations.accountListExecute,
	},
};

export * from "./AccountsDescription";
export * from "./operations";
