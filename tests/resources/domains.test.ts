import { describe, expect, test } from "bun:test";
import {
	domainListExecute,
	domainCreateExecute,
	domainGetExecute,
	domainDeleteExecute,
} from "../../nodes/DNSimple/resources/domains/operations";
import { createMockExecuteFunctions } from "../mocks/n8nContext";

describe("domains resource", () => {
	describe("list operation", () => {
		test("returns all domains", async () => {
			const mockDomains = [
				{ id: 1, name: "example.com", state: "registered" },
				{ id: 2, name: "test.org", state: "hosted" },
			];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					returnAll: false,
					limit: 50,
					options: {},
				},
				httpResponse: { data: mockDomains },
			});

			const result = await domainListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
			expect(result[0].json).toEqual(mockDomains[0]);
		});

		test("returns all domains with pagination", async () => {
			const page1 = [{ id: 1, name: "example.com" }];
			const page2 = [{ id: 2, name: "test.org" }];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					returnAll: true,
					filters: {},
				},
				httpResponse: [
					{ data: page1, pagination: { current_page: 1, total_pages: 2 } },
					{ data: page2, pagination: { current_page: 2, total_pages: 2 } },
				],
			});

			const result = await domainListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
		});

		test("applies name filter", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					returnAll: false,
					limit: 50,
					options: { nameFilter: "example" },
				},
				httpResponse: { data: [] },
			});

			const result = await domainListExecute.call(mockContext, 0);

			expect(result).toEqual([]);
		});
	});

	describe("create operation", () => {
		test("creates a new domain", async () => {
			const mockResponse = {
				id: 1,
				name: "newdomain.com",
				state: "hosted",
				created_at: "2024-01-01T00:00:00Z",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainName: "newdomain.com",
				},
				httpResponse: { data: mockResponse },
			});

			const result = await domainCreateExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.name).toBe("newdomain.com");
		});
	});

	describe("get operation", () => {
		test("returns domain by ID", async () => {
			const mockDomain = {
				id: 1,
				name: "example.com",
				state: "registered",
				expires_on: "2025-01-01",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: { mode: "list", value: "example.com" },
				},
				httpResponse: { data: mockDomain },
			});

			const result = await domainGetExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockDomain);
		});

		test("handles string domainId", async () => {
			const mockDomain = { id: 1, name: "example.com" };

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
				},
				httpResponse: { data: mockDomain },
			});

			const result = await domainGetExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
		});
	});

	describe("delete operation", () => {
		test("deletes domain by ID", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: { mode: "list", value: "example.com" },
				},
				httpResponse: {},
			});

			const result = await domainDeleteExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});
});
