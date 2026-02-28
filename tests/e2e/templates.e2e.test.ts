import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import {
	createE2EExecuteFunctions,
	e2eConfig,
	ensureAccountId,
	skipIfNotConfigured,
} from "./config";
import { CleanupManager, generateUniqueName, withDelay } from "./helpers";
import {
	templateCreateExecute,
	templateGetExecute,
	templateListExecute,
	templateUpdateExecute,
	templateDeleteExecute,
} from "../../nodes/DNSimple/resources/templates/operations";

describe("Templates E2E", () => {
	const cleanup = new CleanupManager();
	let createdTemplateId: number | null = null;
	let testTemplateName: string;

	beforeAll(async () => {
		if (skipIfNotConfigured()) {
			return;
		}
		await ensureAccountId();
		testTemplateName = generateUniqueName("e2e-template");
	});

	afterAll(async () => {
		await cleanup.runAll();
	});

	test("create template", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			name: testTemplateName,
			sid: testTemplateName.replace(/-/g, "").substring(0, 20),
			additionalFields: {
				description: "E2E test template",
			},
		});

		const result = await withDelay(() =>
			templateCreateExecute.call(context, 0)
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toHaveProperty("id");
		expect(result[0].json.name).toBe(testTemplateName);
		expect(result[0].json.description).toBe("E2E test template");

		createdTemplateId = result[0].json.id as number;

		cleanup.register(async () => {
			if (createdTemplateId) {
				const deleteContext = createE2EExecuteFunctions({
					templateId: createdTemplateId,
				});
				try {
					await templateDeleteExecute.call(deleteContext, 0);
				} catch {
					// Ignore
				}
			}
		});
	});

	test("get template", async () => {
		if (!e2eConfig.isConfigured || !createdTemplateId) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			templateId: createdTemplateId,
		});

		const result = await withDelay(() => templateGetExecute.call(context, 0));

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBe(createdTemplateId);
		expect(result[0].json.name).toBe(testTemplateName);
	});

	test("list templates", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			returnAll: false,
			limit: 50,
		});

		const result = await withDelay(() => templateListExecute.call(context, 0));

		expect(result.length).toBeGreaterThanOrEqual(0);

		if (createdTemplateId) {
			const templateIds = result.map((r) => r.json.id);
			expect(templateIds).toContain(createdTemplateId);
		}
	});

	test("update template", async () => {
		if (!e2eConfig.isConfigured || !createdTemplateId) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			templateId: createdTemplateId,
			updateFields: {
				description: "Updated E2E test template",
			},
		});

		const result = await withDelay(() =>
			templateUpdateExecute.call(context, 0)
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBe(createdTemplateId);
		expect(result[0].json.description).toBe("Updated E2E test template");
	});

	test("delete template", async () => {
		if (!e2eConfig.isConfigured || !createdTemplateId) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			templateId: createdTemplateId,
		});

		const result = await withDelay(() =>
			templateDeleteExecute.call(context, 0)
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);

		createdTemplateId = null;
	});
});
