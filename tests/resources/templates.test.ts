import { describe, expect, test } from "bun:test";
import { templateListExecute } from "../../nodes/DNSimple/resources/templates/operations/TemplateList";
import { templateCreateExecute } from "../../nodes/DNSimple/resources/templates/operations/TemplateCreate";
import { templateGetExecute } from "../../nodes/DNSimple/resources/templates/operations/TemplateGet";
import { templateUpdateExecute } from "../../nodes/DNSimple/resources/templates/operations/TemplateUpdate";
import { templateDeleteExecute } from "../../nodes/DNSimple/resources/templates/operations/TemplateDelete";
import { templateApplyToDomainExecute } from "../../nodes/DNSimple/resources/templates/operations/TemplateApplyToDomain";
import { createMockExecuteFunctions } from "../mocks/n8nContext";

describe("templates resource", () => {
	describe("list operation", () => {
		test("returns all templates", async () => {
			const mockTemplates = [
				{ id: 1, name: "Default", sid: "default" },
				{ id: 2, name: "Custom", sid: "custom" },
			];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					returnAll: false,
					limit: 50,
				},
				httpResponse: { data: mockTemplates },
			});

			const result = await templateListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
			expect(result[0].json.name).toBe("Default");
		});

		test("returns all templates with pagination", async () => {
			const page1 = [{ id: 1, name: "Default" }];
			const page2 = [{ id: 2, name: "Custom" }];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					returnAll: true,
				},
				httpResponse: [
					{ data: page1, pagination: { total_pages: 2 } },
					{ data: page2, pagination: { total_pages: 2 } },
				],
			});

			const result = await templateListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
		});
	});

	describe("create operation", () => {
		test("creates a new template", async () => {
			const mockResponse = {
				id: 1,
				name: "New Template",
				sid: "new-template",
				description: "A new template",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					name: "New Template",
					sid: "new-template",
					options: {},
				},
				httpResponse: { data: mockResponse },
			});

			const result = await templateCreateExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.name).toBe("New Template");
		});

		test("creates template with description", async () => {
			const mockResponse = {
				id: 1,
				name: "New Template",
				sid: "new-template",
				description: "Template for production sites",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					name: "New Template",
					sid: "new-template",
					options: { description: "Template for production sites" },
				},
				httpResponse: { data: mockResponse },
			});

			const result = await templateCreateExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.description).toBe("Template for production sites");
		});
	});

	describe("get operation", () => {
		test("returns template by ID", async () => {
			const mockTemplate = {
				id: 1,
				name: "Default",
				sid: "default",
				description: "Default template",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					templateId: { mode: "list", value: "1" },
				},
				httpResponse: { data: mockTemplate },
			});

			const result = await templateGetExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockTemplate);
		});
	});

	describe("update operation", () => {
		test("updates template fields", async () => {
			const mockResponse = {
				id: 1,
				name: "Updated Template",
				sid: "default",
				description: "Updated description",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					templateId: { mode: "list", value: "1" },
					updateFields: {
						name: "Updated Template",
						description: "Updated description",
					},
				},
				httpResponse: { data: mockResponse },
			});

			const result = await templateUpdateExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.name).toBe("Updated Template");
		});
	});

	describe("delete operation", () => {
		test("deletes template by ID", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					templateId: { mode: "list", value: "1" },
				},
				httpResponse: {},
			});

			const result = await templateDeleteExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});

	describe("applyToDomain operation", () => {
		test("applies template to domain", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					templateId: { mode: "list", value: "1" },
				},
				httpResponse: {},
			});

			const result = await templateApplyToDomainExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});
});
