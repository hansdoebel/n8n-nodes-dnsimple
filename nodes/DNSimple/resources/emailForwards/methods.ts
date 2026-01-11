import type { ResourceOperationHandler } from "@dnsimple-types/registry";
import {
	emailForwardCreateExecute,
	emailForwardDeleteExecute,
	emailForwardGetExecute,
	emailForwardListExecute,
} from "./operations";

export const emailForwardMethods: Record<string, ResourceOperationHandler> = {
	list: emailForwardListExecute,
	create: emailForwardCreateExecute,
	get: emailForwardGetExecute,
	delete: emailForwardDeleteExecute,
};
