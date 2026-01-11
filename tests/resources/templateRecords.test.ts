import { describe, expect, test } from "bun:test";
import { templateRecordListExecute } from "../../nodes/DNSimple/resources/templateRecords/operations/TemplateRecordList";
import { templateRecordCreateExecute } from "../../nodes/DNSimple/resources/templateRecords/operations/TemplateRecordCreate";
import { templateRecordGetExecute } from "../../nodes/DNSimple/resources/templateRecords/operations/TemplateRecordGet";
import { templateRecordDeleteExecute } from "../../nodes/DNSimple/resources/templateRecords/operations/TemplateRecordDelete";
import { createMockExecuteFunctions } from "../mocks/n8nContext";

describe("templateRecords resource", () => {
	describe("list operation", () => {
		test("returns records in template", async () => {
			const mockRecords = [
				{ id: 1, template_id: 1, name: "", type: "A", content: "192.168.1.1" },
				{
					id: 2,
					template_id: 1,
					name: "www",
					type: "CNAME",
					content: "example.com",
				},
			];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					templateId: { mode: "list", value: "1" },
					returnAll: false,
					limit: 50,
				},
				httpResponse: { data: mockRecords },
			});

			const result = await templateRecordListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
			expect(result[0].json.type).toBe("A");
		});

		test("returns all records with pagination", async () => {
			const page1 = [{ id: 1, type: "A" }];
			const page2 = [{ id: 2, type: "CNAME" }];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					templateId: { mode: "list", value: "1" },
					returnAll: true,
				},
				httpResponse: [
					{ data: page1, pagination: { total_pages: 2 } },
					{ data: page2, pagination: { total_pages: 2 } },
				],
			});

			const result = await templateRecordListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
		});
	});

	describe("create operation", () => {
		test("creates a new template record", async () => {
			const mockResponse = {
				id: 1,
				template_id: 1,
				name: "www",
				type: "A",
				content: "192.168.1.1",
				ttl: 3600,
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					templateId: { mode: "list", value: "1" },
					recordType: "A",
					name: "www",
					content: "192.168.1.1",
					options: {},
				},
				httpResponse: { data: mockResponse },
			});

			const result = await templateRecordCreateExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.type).toBe("A");
		});

		test("creates record with TTL", async () => {
			const mockResponse = {
				id: 1,
				template_id: 1,
				name: "",
				type: "MX",
				content: "mail.example.com",
				ttl: 7200,
				priority: 10,
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					templateId: { mode: "list", value: "1" },
					recordType: "MX",
					name: "",
					content: "mail.example.com",
					options: { ttl: 7200, priority: 10 },
				},
				httpResponse: { data: mockResponse },
			});

			const result = await templateRecordCreateExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.ttl).toBe(7200);
		});
	});

	describe("get operation", () => {
		test("returns template record by ID", async () => {
			const mockRecord = {
				id: 1,
				template_id: 1,
				name: "www",
				type: "A",
				content: "192.168.1.1",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					templateId: { mode: "list", value: "1" },
					recordId: 1,
				},
				httpResponse: { data: mockRecord },
			});

			const result = await templateRecordGetExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockRecord);
		});
	});

	describe("delete operation", () => {
		test("deletes template record by ID", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					templateId: { mode: "list", value: "1" },
					recordId: 1,
				},
				httpResponse: {},
			});

			const result = await templateRecordDeleteExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});
});
