import type { ResourceOperationHandler } from "@dnsimple-types/registry";
import {
	templateRecordCreateExecute,
	templateRecordDeleteExecute,
	templateRecordGetExecute,
	templateRecordListExecute,
} from "./operations";

export const templateRecordMethods: Record<string, ResourceOperationHandler> = {
	list: templateRecordListExecute,
	create: templateRecordCreateExecute,
	get: templateRecordGetExecute,
	delete: templateRecordDeleteExecute,
};
