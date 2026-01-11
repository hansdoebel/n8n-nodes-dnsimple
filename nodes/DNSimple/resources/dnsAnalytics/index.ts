import type { ResourceDefinition } from "@dnsimple-types/registry";
import {
	dnsAnalyticsFields,
	dnsAnalyticsOperations,
} from "./DnsAnalyticsDescription";
import { dnsAnalyticsMethods } from "./methods";

export const dnsAnalyticsResource: ResourceDefinition = {
	name: "dnsAnalytics",
	operations: dnsAnalyticsOperations,
	fields: dnsAnalyticsFields,
	handlers: dnsAnalyticsMethods,
};

export * from "./DnsAnalyticsDescription";
export * from "./methods";
