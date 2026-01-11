import type { ResourceOperationHandler } from "@dnsimple-types/registry";
import { dnsAnalyticsQueryExecute } from "./operations";

export const dnsAnalyticsMethods: Record<string, ResourceOperationHandler> = {
	query: dnsAnalyticsQueryExecute,
};
