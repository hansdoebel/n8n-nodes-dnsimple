import type { ResourceOperationHandler } from "@dnsimple-types/registry";
import {
	certificateDownloadExecute,
	certificateGetExecute,
	certificateGetPrivateKeyExecute,
	certificateIssueExecute,
	certificateListExecute,
	certificateOrderExecute,
	certificateRenewExecute,
} from "./operations";

export const certificateMethods: Record<string, ResourceOperationHandler> = {
	list: certificateListExecute,
	get: certificateGetExecute,
	download: certificateDownloadExecute,
	getPrivateKey: certificateGetPrivateKeyExecute,
	order: certificateOrderExecute,
	issue: certificateIssueExecute,
	renew: certificateRenewExecute,
};
