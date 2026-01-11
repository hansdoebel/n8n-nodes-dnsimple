import type { ResourceDefinition } from "@dnsimple-types/registry";
import {
	zoneRecordFields,
	zoneRecordOperations,
} from "./ZoneRecordsDescription";
import { zoneRecordMethods } from "./methods";

export const zoneRecordResource: ResourceDefinition = {
	name: "zoneRecord",
	operations: zoneRecordOperations,
	fields: zoneRecordFields,
	handlers: zoneRecordMethods,
};

export * from "./ZoneRecordsDescription";
export * from "./methods";
