import type { ResourceOperationHandler } from "@dnsimple-types/registry";
import {
	webhookCreateExecute,
	webhookDeleteExecute,
	webhookGetExecute,
	webhookListExecute,
} from "./operations";

export const webhookMethods: Record<string, ResourceOperationHandler> = {
	list: webhookListExecute,
	create: webhookCreateExecute,
	get: webhookGetExecute,
	delete: webhookDeleteExecute,
};
