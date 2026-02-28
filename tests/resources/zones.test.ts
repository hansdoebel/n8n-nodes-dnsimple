import { describe, expect, test } from "bun:test";
import {
	zoneListExecute,
	zoneGetExecute,
	zoneDownloadFileExecute,
	zoneCheckDistributionExecute,
	zoneActivateExecute,
	zoneDeactivateExecute,
} from "../../nodes/DNSimple/resources/zones/operations";
import { createMockExecuteFunctions } from "../mocks/n8nContext";

describe("zones resource", () => {
	describe("list operation", () => {
		test("returns all zones", async () => {
			const mockZones = [
				{ id: 1, account_id: 123, name: "example.com", reverse: false },
				{ id: 2, account_id: 123, name: "test.org", reverse: false },
			];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					returnAll: false,
					limit: 50,
					options: {},
				},
				httpResponse: { data: mockZones },
			});

			const result = await zoneListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
			expect(result[0].json.name).toBe("example.com");
		});

		test("returns all zones with pagination", async () => {
			const page1 = [{ id: 1, name: "example.com" }];
			const page2 = [{ id: 2, name: "test.org" }];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					returnAll: true,
					options: {},
				},
				httpResponse: [
					{ data: page1, pagination: { total_pages: 2 } },
					{ data: page2, pagination: { total_pages: 2 } },
				],
			});

			const result = await zoneListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
		});

		test("filters by name", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					returnAll: false,
					limit: 50,
					options: { nameFilter: "example" },
				},
				httpResponse: { data: [] },
			});

			const result = await zoneListExecute.call(mockContext, 0);

			expect(result).toEqual([]);
		});
	});

	describe("get operation", () => {
		test("returns zone by name", async () => {
			const mockZone = {
				id: 1,
				account_id: 123,
				name: "example.com",
				reverse: false,
				created_at: "2024-01-01T00:00:00Z",
				updated_at: "2024-01-01T00:00:00Z",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					zoneName: { mode: "list", value: "example.com" },
				},
				httpResponse: { data: mockZone },
			});

			const result = await zoneGetExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.name).toBe("example.com");
		});

		test("handles string zoneName", async () => {
			const mockZone = { id: 1, name: "example.com" };

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					zoneName: "example.com",
				},
				httpResponse: { data: mockZone },
			});

			const result = await zoneGetExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
		});
	});

	describe("downloadFile operation", () => {
		test("returns zone file content", async () => {
			const mockResponse = {
				zone:
					"$ORIGIN example.com.\n$TTL 3600\n@ IN SOA ns1.dnsimple.com. admin.dnsimple.com. ...",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					zoneName: { mode: "list", value: "example.com" },
				},
				httpResponse: { data: mockResponse },
			});

			const result = await zoneDownloadFileExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.zone).toContain("$ORIGIN example.com");
		});
	});

	describe("checkDistribution operation", () => {
		test("returns distributed status", async () => {
			const mockResponse = {
				distributed: true,
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					zoneName: { mode: "list", value: "example.com" },
				},
				httpResponse: { data: mockResponse },
			});

			const result = await zoneCheckDistributionExecute.call(mockContext, 0);

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
				},
				httpResponse: { data: mockResponse },
			});

			const result = await zoneCheckDistributionExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.distributed).toBe(false);
		});
	});

	describe("activate operation", () => {
		test("activates DNS for zone", async () => {
			const mockResponse = {
				id: 1,
				name: "example.com",
				active: true,
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					zoneName: { mode: "list", value: "example.com" },
				},
				httpResponse: { data: mockResponse },
			});

			const result = await zoneActivateExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.active).toBe(true);
		});
	});

	describe("deactivate operation", () => {
		test("deactivates DNS for zone", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					zoneName: { mode: "list", value: "example.com" },
				},
				httpResponse: {},
			});

			const result = await zoneDeactivateExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});
});
