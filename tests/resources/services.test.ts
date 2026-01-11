import { describe, expect, test } from "bun:test";
import { serviceListExecute } from "../../nodes/DNSimple/resources/services/operations/ServiceList";
import { serviceApplyExecute } from "../../nodes/DNSimple/resources/services/operations/ServiceApply";
import { serviceListAppliedExecute } from "../../nodes/DNSimple/resources/services/operations/ServiceListApplied";
import { serviceUnapplyExecute } from "../../nodes/DNSimple/resources/services/operations/ServiceUnapply";
import { createMockExecuteFunctions } from "../mocks/n8nContext";

describe("services resource", () => {
	describe("list operation", () => {
		test("returns all available services", async () => {
			const mockServices = [
				{ id: 1, name: "Heroku", sid: "heroku" },
				{ id: 2, name: "GitHub Pages", sid: "github-pages" },
			];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					returnAll: false,
					limit: 50,
				},
				httpResponse: { data: mockServices },
			});

			const result = await serviceListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
			expect(result[0].json.name).toBe("Heroku");
		});

		test("returns all services with pagination", async () => {
			const page1 = [{ id: 1, name: "Heroku" }];
			const page2 = [{ id: 2, name: "GitHub Pages" }];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					returnAll: true,
				},
				httpResponse: [
					{ data: page1, pagination: { total_pages: 2 } },
					{ data: page2, pagination: { total_pages: 2 } },
				],
			});

			const result = await serviceListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
		});
	});

	describe("apply operation", () => {
		test("applies service to domain", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					serviceId: { mode: "list", value: "heroku" },
					additionalFields: {},
				},
				httpResponse: {},
			});

			const result = await serviceApplyExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});

		test("applies service with settings", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					serviceId: { mode: "list", value: "heroku" },
					additionalFields: {
						settings: '{"app": "myapp"}',
					},
				},
				httpResponse: {},
			});

			const result = await serviceApplyExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});

	describe("listApplied operation", () => {
		test("returns services applied to domain", async () => {
			const mockServices = [
				{ id: 1, name: "Heroku", sid: "heroku" },
			];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					returnAll: false,
					limit: 50,
				},
				httpResponse: { data: mockServices },
			});

			const result = await serviceListAppliedExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.name).toBe("Heroku");
		});
	});

	describe("unapply operation", () => {
		test("removes service from domain", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					serviceId: { mode: "list", value: "heroku" },
				},
				httpResponse: {},
			});

			const result = await serviceUnapplyExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});
});
