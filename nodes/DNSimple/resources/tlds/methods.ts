import type { ResourceOperationHandler } from "@dnsimple-types/registry";
import {
	tldGetExecute,
	tldGetExtendedAttributesExecute,
	tldListExecute,
} from "./operations";

export const tldMethods: Record<string, ResourceOperationHandler> = {
	list: tldListExecute,
	get: tldGetExecute,
	getExtendedAttributes: tldGetExtendedAttributesExecute,
};
