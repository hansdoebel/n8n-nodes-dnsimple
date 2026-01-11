import type { ResourceOperationHandler } from "@dnsimple-types/registry";
import {
	domainPushAcceptExecute,
	domainPushInitiateExecute,
	domainPushListExecute,
	domainPushRejectExecute,
} from "./operations";

export const domainPushMethods: Record<string, ResourceOperationHandler> = {
	list: domainPushListExecute,
	initiate: domainPushInitiateExecute,
	accept: domainPushAcceptExecute,
	reject: domainPushRejectExecute,
};
