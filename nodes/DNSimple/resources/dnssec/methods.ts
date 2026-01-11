import type { ResourceOperationHandler } from "@dnsimple-types/registry";
import {
	dnssecCreateDsRecordExecute,
	dnssecDeleteDsRecordExecute,
	dnssecDisableExecute,
	dnssecEnableExecute,
	dnssecGetDsRecordExecute,
	dnssecGetStatusExecute,
	dnssecListDsRecordsExecute,
} from "./operations";

export const dnssecMethods: Record<string, ResourceOperationHandler> = {
	getStatus: dnssecGetStatusExecute,
	enable: dnssecEnableExecute,
	disable: dnssecDisableExecute,
	listDsRecords: dnssecListDsRecordsExecute,
	createDsRecord: dnssecCreateDsRecordExecute,
	getDsRecord: dnssecGetDsRecordExecute,
	deleteDsRecord: dnssecDeleteDsRecordExecute,
};
