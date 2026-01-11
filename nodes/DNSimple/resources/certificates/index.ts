import type { ResourceDefinition } from "@dnsimple-types/registry";
import {
	certificateFields,
	certificateOperations,
} from "./CertificatesDescription";
import { certificateMethods } from "./methods";

export const certificateResource: ResourceDefinition = {
	name: "certificate",
	operations: certificateOperations,
	fields: certificateFields,
	handlers: certificateMethods,
};

export * from "./CertificatesDescription";
export * from "./methods";
