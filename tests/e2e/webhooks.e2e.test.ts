import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import {
	createE2EExecuteFunctions,
	e2eConfig,
	ensureAccountId,
	skipIfNotConfigured,
} from "./config";
import { CleanupManager, generateTestUrl, withDelay } from "./helpers";
import { webhookCreateExecute } from "../../nodes/DNSimple/resources/webhooks/operations/WebhookCreate";
import { webhookGetExecute } from "../../nodes/DNSimple/resources/webhooks/operations/WebhookGet";
import { webhookListExecute } from "../../nodes/DNSimple/resources/webhooks/operations/WebhookList";
import { webhookDeleteExecute } from "../../nodes/DNSimple/resources/webhooks/operations/WebhookDelete";

describe("Webhooks E2E", () => {
	const cleanup = new CleanupManager();
	let createdWebhookId: number | null = null;
	let testWebhookUrl: string;

	beforeAll(async () => {
		if (skipIfNotConfigured()) {
			return;
		}
		await ensureAccountId();
		testWebhookUrl = generateTestUrl();
	});

	afterAll(async () => {
		await cleanup.runAll();
	});

	test("create webhook", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			url: testWebhookUrl,
		});

		const result = await withDelay(() => webhookCreateExecute.call(context, 0));

		expect(result).toHaveLength(1);
		expect(result[0].json).toHaveProperty("id");
		expect(result[0].json.url).toBe(testWebhookUrl);

		createdWebhookId = result[0].json.id as number;

		cleanup.register(async () => {
			if (createdWebhookId) {
				const deleteContext = createE2EExecuteFunctions({
					webhookId: createdWebhookId,
				});
				try {
					await webhookDeleteExecute.call(deleteContext, 0);
				} catch {
					// Ignore
				}
			}
		});
	});

	test("get webhook", async () => {
		if (!e2eConfig.isConfigured || !createdWebhookId) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			webhookId: createdWebhookId,
		});

		const result = await withDelay(() => webhookGetExecute.call(context, 0));

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBe(createdWebhookId);
		expect(result[0].json.url).toBe(testWebhookUrl);
	});

	test("list webhooks", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			returnAll: false,
			limit: 50,
		});

		const result = await withDelay(() => webhookListExecute.call(context, 0));

		expect(result.length).toBeGreaterThanOrEqual(0);

		if (createdWebhookId) {
			const webhookIds = result.map((r) => r.json.id);
			expect(webhookIds).toContain(createdWebhookId);
		}
	});

	test("delete webhook", async () => {
		if (!e2eConfig.isConfigured || !createdWebhookId) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			webhookId: createdWebhookId,
		});

		const result = await withDelay(() => webhookDeleteExecute.call(context, 0));

		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);

		createdWebhookId = null;
	});
});
