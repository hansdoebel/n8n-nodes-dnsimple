import type { ResourceOperationHandler } from "@dnsimple-types/registry";
import {
	zoneRecordCheckDistributionExecute,
	zoneRecordCreateExecute,
	zoneRecordDeleteExecute,
	zoneRecordGetExecute,
	zoneRecordListExecute,
	zoneRecordUpdateExecute,
} from "./operations";

export const zoneRecordMethods: Record<string, ResourceOperationHandler> = {
	list: zoneRecordListExecute,
	create: zoneRecordCreateExecute,
	get: zoneRecordGetExecute,
	update: zoneRecordUpdateExecute,
	delete: zoneRecordDeleteExecute,
	checkDistribution: zoneRecordCheckDistributionExecute,
};
