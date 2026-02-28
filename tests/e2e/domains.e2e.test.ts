import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import {
	createE2EExecuteFunctions,
	e2eConfig,
	ensureAccountId,
	skipIfNotConfigured,
} from "./config";
import { CleanupManager, generateTestDomainName, withDelay } from "./helpers";
import {
	domainCreateExecute,
	domainGetExecute,
	domainListExecute,
	domainDeleteExecute,
} from "../../nodes/DNSimple/resources/domains/operations";

describe("Domains E2E", () => {
	const cleanup = new CleanupManager();
	let createdDomainId: string | null = null;
	let testDomainName: string;

	beforeAll(async () => {
		if (skipIfNotConfigured()) {
			return;
		}
		await ensureAccountId();
		testDomainName = generateTestDomainName();
	});

	afterAll(async () => {
		await cleanup.runAll();
	});

	test("create domain", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			domainName: testDomainName,
		});

		const result = await withDelay(() => domainCreateExecute.call(context, 0));

		expect(result).toHaveLength(1);
		expect(result[0].json).toHaveProperty("id");
		expect(result[0].json.name).toBe(testDomainName);
		expect(result[0].json.state).toBe("hosted");

		createdDomainId = result[0].json.name as string;

		cleanup.register(async () => {
			if (createdDomainId) {
				const deleteContext = createE2EExecuteFunctions({
					domainId: createdDomainId,
				});
				await domainDeleteExecute.call(deleteContext, 0);
			}
		});
	});

	test("get domain", async () => {
		if (!e2eConfig.isConfigured || !createdDomainId) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			domainId: createdDomainId,
		});

		const result = await withDelay(() => domainGetExecute.call(context, 0));

		expect(result).toHaveLength(1);
		expect(result[0].json.name).toBe(testDomainName);
		expect(result[0].json).toHaveProperty("account_id");
		expect(result[0].json).toHaveProperty("created_at");
	});

	test("list domains", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			returnAll: false,
			limit: 50,
			filters: {},
		});

		const result = await withDelay(() => domainListExecute.call(context, 0));

		expect(result.length).toBeGreaterThanOrEqual(0);
		if (createdDomainId) {
			const domainNames = result.map((r) => r.json.name);
			expect(domainNames).toContain(testDomainName);
		}
	});

	test("list domains with filter", async () => {
		if (!e2eConfig.isConfigured || !createdDomainId) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			returnAll: false,
			limit: 50,
			filters: {
				name_like: testDomainName.split("-")[0],
			},
		});

		const result = await withDelay(() => domainListExecute.call(context, 0));

		expect(result.length).toBeGreaterThanOrEqual(1);
	});

	test("delete domain", async () => {
		if (!e2eConfig.isConfigured || !createdDomainId) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			domainId: createdDomainId,
		});

		const result = await withDelay(() => domainDeleteExecute.call(context, 0));

		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);

		createdDomainId = null;
	});
});
