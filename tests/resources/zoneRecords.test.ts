import { describe, expect, test } from "bun:test";
import {
	zoneRecordListExecute,
	zoneRecordCreateExecute,
	zoneRecordGetExecute,
	zoneRecordUpdateExecute,
	zoneRecordDeleteExecute,
	zoneRecordCheckDistributionExecute,
} from "../../nodes/DNSimple/resources/zoneRecords/operations";
import { createMockExecuteFunctions } from "../mocks/n8nContext";

describe("zoneRecords resource", () => {
	describe("list operation", () => {
		test("returns zone records", async () => {
			const mockRecords = [
				{
					id: 1,
					zone_id: "example.com",
					name: "",
					type: "A",
					content: "192.168.1.1",
				},
				{
					id: 2,
					zone_id: "example.com",
					name: "www",
					type: "CNAME",
					content: "example.com",
				},
			];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					zoneName: { mode: "list", value: "example.com" },
					returnAll: false,
					limit: 50,
					options: {},
				},
				httpResponse: { data: mockRecords },
			});

			const result = await zoneRecordListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
			expect(result[0].json.type).toBe("A");
		});

		test("returns all records with pagination", async () => {
			const page1 = [{ id: 1, type: "A" }];
			const page2 = [{ id: 2, type: "CNAME" }];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					zoneName: { mode: "list", value: "example.com" },
					returnAll: true,
					options: {},
				},
				httpResponse: [
					{ data: page1, pagination: { total_pages: 2 } },
					{ data: page2, pagination: { total_pages: 2 } },
				],
			});

			const result = await zoneRecordListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
		});

		test("filters by record type", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					zoneName: { mode: "list", value: "example.com" },
					returnAll: false,
					limit: 50,
					options: { type: "A" },
				},
				httpResponse: { data: [] },
			});

			const result = await zoneRecordListExecute.call(mockContext, 0);

			expect(result).toEqual([]);
		});

		test("filters by name", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					zoneName: { mode: "list", value: "example.com" },
					returnAll: false,
					limit: 50,
					options: { nameFilter: "www" },
				},
				httpResponse: { data: [] },
			});

			const result = await zoneRecordListExecute.call(mockContext, 0);

			expect(result).toEqual([]);
		});
	});

	describe("create operation", () => {
		test("creates a new zone record", async () => {
			const mockResponse = {
				id: 1,
				zone_id: "example.com",
				name: "www",
				type: "A",
				content: "192.168.1.1",
				ttl: 3600,
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					zoneName: { mode: "list", value: "example.com" },
					recordType: "A",
					name: "www",
					content: "192.168.1.1",
					options: {},
				},
				httpResponse: { data: mockResponse },
			});

			const result = await zoneRecordCreateExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.type).toBe("A");
		});

		test("creates MX record with priority", async () => {
			const mockResponse = {
				id: 1,
				zone_id: "example.com",
				name: "",
				type: "MX",
				content: "mail.example.com",
				ttl: 3600,
				priority: 10,
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					zoneName: { mode: "list", value: "example.com" },
					recordType: "MX",
					name: "",
					content: "mail.example.com",
					options: { ttl: 3600, priority: 10 },
				},
				httpResponse: { data: mockResponse },
			});

			const result = await zoneRecordCreateExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.priority).toBe(10);
		});

		test("creates record with custom TTL", async () => {
			const mockResponse = {
				id: 1,
				zone_id: "example.com",
				name: "api",
				type: "A",
				content: "10.0.0.1",
				ttl: 300,
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					zoneName: { mode: "list", value: "example.com" },
					recordType: "A",
					name: "api",
					content: "10.0.0.1",
					options: { ttl: 300 },
				},
				httpResponse: { data: mockResponse },
			});

			const result = await zoneRecordCreateExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.ttl).toBe(300);
		});
	});

	describe("get operation", () => {
		test("returns zone record by ID", async () => {
			const mockRecord = {
				id: 1,
				zone_id: "example.com",
				name: "www",
				type: "A",
				content: "192.168.1.1",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					zoneName: { mode: "list", value: "example.com" },
					recordId: 1,
				},
				httpResponse: { data: mockRecord },
			});

			const result = await zoneRecordGetExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockRecord);
		});
	});

	describe("update operation", () => {
		test("updates zone record", async () => {
			const mockResponse = {
				id: 1,
				zone_id: "example.com",
				name: "www",
				type: "A",
				content: "192.168.1.2",
				ttl: 7200,
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					zoneName: { mode: "list", value: "example.com" },
					recordId: 1,
					updateFields: {
						content: "192.168.1.2",
						ttl: 7200,
					},
				},
				httpResponse: { data: mockResponse },
			});

			const result = await zoneRecordUpdateExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.content).toBe("192.168.1.2");
		});
	});

	describe("delete operation", () => {
		test("deletes zone record by ID", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					zoneName: { mode: "list", value: "example.com" },
					recordId: 1,
				},
				httpResponse: {},
			});

			const result = await zoneRecordDeleteExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});

	describe("checkDistribution operation", () => {
		test("returns distribution status for record", async () => {
			const mockResponse = {
				distributed: true,
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					zoneName: { mode: "list", value: "example.com" },
					recordId: 1,
				},
				httpResponse: { data: mockResponse },
			});

			const result = await zoneRecordCheckDistributionExecute.call(
				mockContext,
				0,
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.distributed).toBe(true);
		});

		test("returns not distributed status", async () => {
			const mockResponse = {
				distributed: false,
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					zoneName: { mode: "list", value: "example.com" },
					recordId: 1,
				},
				httpResponse: { data: mockResponse },
			});

			const result = await zoneRecordCheckDistributionExecute.call(
				mockContext,
				0,
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.distributed).toBe(false);
		});
	});
});
