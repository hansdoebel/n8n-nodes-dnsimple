import { describe, expect, test } from "bun:test";
import { dnsAnalyticsQueryExecute } from "../../nodes/DNSimple/resources/dnsAnalytics/operations/DnsAnalyticsQuery";
import { createMockExecuteFunctions } from "../mocks/n8nContext";

describe("dnsAnalytics resource", () => {
	describe("query operation", () => {
		test("returns analytics data with default parameters", async () => {
			const mockRows = [
				{ date: "2024-01-01", zone_name: "example.com", queries_count: 1000 },
				{ date: "2024-01-02", zone_name: "example.com", queries_count: 1200 },
			];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					returnAll: false,
					limit: 50,
					options: {},
				},
				httpResponse: { data: { rows: mockRows } },
			});

			const result = await dnsAnalyticsQueryExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
			expect(result[0].json).toEqual(mockRows[0]);
		});

		test("returns all analytics with pagination", async () => {
			const page1Rows = [{ date: "2024-01-01", queries_count: 1000 }];
			const page2Rows = [{ date: "2024-01-02", queries_count: 1200 }];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					returnAll: true,
					options: {},
				},
				httpResponse: [
					{ data: { rows: page1Rows }, pagination: { total_pages: 2 } },
					{ data: { rows: page2Rows }, pagination: { total_pages: 2 } },
				],
			});

			const result = await dnsAnalyticsQueryExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
		});

		test("applies date range filter", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					returnAll: false,
					limit: 50,
					options: {
						startDate: "2024-01-01",
						endDate: "2024-01-31",
					},
				},
				httpResponse: { data: { rows: [] } },
			});

			const result = await dnsAnalyticsQueryExecute.call(mockContext, 0);

			expect(result).toEqual([]);
		});

		test("applies groupings filter", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					returnAll: false,
					limit: 50,
					options: {
						groupings: ["zone_name", "date"],
					},
				},
				httpResponse: { data: { rows: [] } },
			});

			const result = await dnsAnalyticsQueryExecute.call(mockContext, 0);

			expect(result).toEqual([]);
		});

		test("applies sort option", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					returnAll: false,
					limit: 50,
					options: {
						sort: "date:desc",
					},
				},
				httpResponse: { data: { rows: [] } },
			});

			const result = await dnsAnalyticsQueryExecute.call(mockContext, 0);

			expect(result).toEqual([]);
		});
	});
});
