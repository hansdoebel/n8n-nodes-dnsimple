import { describe, expect, test } from "bun:test";
import { webhookListExecute } from "../../nodes/DNSimple/resources/webhooks/operations/WebhookList";
import { webhookCreateExecute } from "../../nodes/DNSimple/resources/webhooks/operations/WebhookCreate";
import { webhookGetExecute } from "../../nodes/DNSimple/resources/webhooks/operations/WebhookGet";
import { webhookDeleteExecute } from "../../nodes/DNSimple/resources/webhooks/operations/WebhookDelete";
import { createMockExecuteFunctions } from "../mocks/n8nContext";

describe("webhooks resource", () => {
	describe("list operation", () => {
		test("returns all webhooks", async () => {
			const mockWebhooks = [
				{ id: 1, url: "https://example.com/webhook1" },
				{ id: 2, url: "https://example.com/webhook2" },
			];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					returnAll: false,
					limit: 50,
				},
				httpResponse: { data: mockWebhooks },
			});

			const result = await webhookListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
			expect(result[0].json.url).toBe("https://example.com/webhook1");
		});

		test("returns all webhooks with pagination", async () => {
			const page1 = [{ id: 1, url: "https://example.com/webhook1" }];
			const page2 = [{ id: 2, url: "https://example.com/webhook2" }];

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

			const result = await webhookListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
		});
	});

	describe("create operation", () => {
		test("creates a new webhook", async () => {
			const mockResponse = {
				id: 1,
				url: "https://example.com/webhook",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					url: "https://example.com/webhook",
				},
				httpResponse: { data: mockResponse },
			});

			const result = await webhookCreateExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.url).toBe("https://example.com/webhook");
		});
	});

	describe("get operation", () => {
		test("returns webhook by ID", async () => {
			const mockWebhook = {
				id: 1,
				url: "https://example.com/webhook",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					webhookId: 1,
				},
				httpResponse: { data: mockWebhook },
			});

			const result = await webhookGetExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockWebhook);
		});
	});

	describe("delete operation", () => {
		test("deletes webhook by ID", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					webhookId: 1,
				},
				httpResponse: {},
			});

			const result = await webhookDeleteExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});
});
