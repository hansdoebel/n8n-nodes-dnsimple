import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import {
	createE2EExecuteFunctions,
	e2eConfig,
	ensureAccountId,
	skipIfNotConfigured,
} from "./config";
import { CleanupManager, generateTestDomainName, withDelay } from "./helpers";
import { domainCreateExecute } from "../../nodes/DNSimple/resources/domains/operations/DomainCreate";
import { domainDeleteExecute } from "../../nodes/DNSimple/resources/domains/operations/DomainDelete";
import { zoneGetExecute } from "../../nodes/DNSimple/resources/zones/operations/ZoneGet";
import { zoneListExecute } from "../../nodes/DNSimple/resources/zones/operations/ZoneList";
import { zoneCheckDistributionExecute } from "../../nodes/DNSimple/resources/zones/operations/ZoneCheckDistribution";
import { zoneDownloadFileExecute } from "../../nodes/DNSimple/resources/zones/operations/ZoneDownloadFile";

describe("Zones E2E", () => {
	const cleanup = new CleanupManager();
	let testDomainName: string;

	beforeAll(async () => {
		if (skipIfNotConfigured()) {
			return;
		}
		await ensureAccountId();

		testDomainName = generateTestDomainName();

		const context = createE2EExecuteFunctions({
			domainName: testDomainName,
		});

		await withDelay(() => domainCreateExecute.call(context, 0));

		cleanup.register(async () => {
			const deleteContext = createE2EExecuteFunctions({
				domainId: testDomainName,
			});
			try {
				await domainDeleteExecute.call(deleteContext, 0);
			} catch {
				// Ignore cleanup errors
			}
		});
	});

	afterAll(async () => {
		await cleanup.runAll();
	});

	test("get zone", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			zoneName: testDomainName,
		});

		const result = await withDelay(() => zoneGetExecute.call(context, 0));

		expect(result).toHaveLength(1);
		expect(result[0].json.name).toBe(testDomainName);
		expect(result[0].json).toHaveProperty("account_id");
		expect(result[0].json).toHaveProperty("reverse");
	});

	test("list zones", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			returnAll: false,
			limit: 50,
			options: {},
		});

		const result = await withDelay(() => zoneListExecute.call(context, 0));

		expect(result.length).toBeGreaterThanOrEqual(1);

		const zoneNames = result.map((r) => r.json.name);
		expect(zoneNames).toContain(testDomainName);
	});

	test("list zones with name filter", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			returnAll: false,
			limit: 50,
			options: {
				nameFilter: testDomainName,
			},
		});

		const result = await withDelay(() => zoneListExecute.call(context, 0));

		expect(result.length).toBeGreaterThanOrEqual(1);
		expect(result[0].json.name).toBe(testDomainName);
	});

	// Note: Distribution check doesn't work in sandbox - zones don't resolve publicly
	test.skip("check zone distribution", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			zoneName: testDomainName,
		});

		const result = await withDelay(() =>
			zoneCheckDistributionExecute.call(context, 0)
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toHaveProperty("distributed");
		expect(typeof result[0].json.distributed).toBe("boolean");
	});

	test("download zone file", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			zoneName: testDomainName,
		});

		const result = await withDelay(() =>
			zoneDownloadFileExecute.call(context, 0)
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toHaveProperty("zone");
		expect(typeof result[0].json.zone).toBe("string");
		expect(result[0].json.zone).toContain(testDomainName);
	});
});
