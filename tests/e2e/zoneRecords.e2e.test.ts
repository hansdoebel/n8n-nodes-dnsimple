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
	domainDeleteExecute,
} from "../../nodes/DNSimple/resources/domains/operations";
import {
	zoneRecordCreateExecute,
	zoneRecordGetExecute,
	zoneRecordListExecute,
	zoneRecordUpdateExecute,
	zoneRecordDeleteExecute,
	zoneRecordCheckDistributionExecute,
} from "../../nodes/DNSimple/resources/zoneRecords/operations";

describe("Zone Records E2E", () => {
	const cleanup = new CleanupManager();
	let testDomainName: string;
	let createdRecordId: number | null = null;

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

	test("create A record", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			zoneName: testDomainName,
			recordName: "test",
			recordType: "A",
			content: "192.0.2.1",
			additionalFields: {
				ttl: 3600,
			},
		});

		const result = await withDelay(() =>
			zoneRecordCreateExecute.call(context, 0)
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toHaveProperty("id");
		expect(result[0].json.name).toBe("test");
		expect(result[0].json.type).toBe("A");
		expect(result[0].json.content).toBe("192.0.2.1");

		createdRecordId = result[0].json.id as number;

		cleanup.register(async () => {
			if (createdRecordId) {
				const deleteContext = createE2EExecuteFunctions({
					zoneName: testDomainName,
					recordId: createdRecordId,
				});
				try {
					await zoneRecordDeleteExecute.call(deleteContext, 0);
				} catch {
					// Ignore
				}
			}
		});
	});

	test("get zone record", async () => {
		if (!e2eConfig.isConfigured || !createdRecordId) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			zoneName: testDomainName,
			recordId: createdRecordId,
		});

		const result = await withDelay(() => zoneRecordGetExecute.call(context, 0));

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBe(createdRecordId);
		expect(result[0].json.name).toBe("test");
		expect(result[0].json.type).toBe("A");
	});

	test("list zone records", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			zoneName: testDomainName,
			returnAll: false,
			limit: 50,
			filters: {},
		});

		const result = await withDelay(() =>
			zoneRecordListExecute.call(context, 0)
		);

		expect(result.length).toBeGreaterThanOrEqual(1);

		if (createdRecordId) {
			const recordIds = result.map((r) => r.json.id);
			expect(recordIds).toContain(createdRecordId);
		}
	});

	test("list zone records with type filter", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			zoneName: testDomainName,
			returnAll: false,
			limit: 50,
			filters: {
				type: "A",
			},
		});

		const result = await withDelay(() =>
			zoneRecordListExecute.call(context, 0)
		);

		for (const record of result) {
			expect(record.json.type).toBe("A");
		}
	});

	test("update zone record", async () => {
		if (!e2eConfig.isConfigured || !createdRecordId) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			zoneName: testDomainName,
			recordId: createdRecordId,
			updateFields: {
				content: "192.0.2.2",
				ttl: 7200,
			},
		});

		const result = await withDelay(() =>
			zoneRecordUpdateExecute.call(context, 0)
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBe(createdRecordId);
		expect(result[0].json.content).toBe("192.0.2.2");
		expect(result[0].json.ttl).toBe(7200);
	});

	// Note: Distribution check doesn't work in sandbox - zones don't resolve publicly
	test.skip("check zone record distribution", async () => {
		if (!e2eConfig.isConfigured || !createdRecordId) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			zoneName: testDomainName,
			recordId: createdRecordId,
		});

		const result = await withDelay(() =>
			zoneRecordCheckDistributionExecute.call(context, 0)
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toHaveProperty("distributed");
		expect(typeof result[0].json.distributed).toBe("boolean");
	});

	test("create MX record with priority", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			zoneName: testDomainName,
			recordName: "",
			recordType: "MX",
			content: "mail.example.com",
			additionalFields: {
				ttl: 3600,
				priority: 10,
			},
		});

		const result = await withDelay(() =>
			zoneRecordCreateExecute.call(context, 0)
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.type).toBe("MX");
		expect(result[0].json.priority).toBe(10);

		const mxRecordId = result[0].json.id as number;

		const deleteContext = createE2EExecuteFunctions({
			zoneName: testDomainName,
			recordId: mxRecordId,
		});
		await withDelay(() => zoneRecordDeleteExecute.call(deleteContext, 0));
	});

	test("delete zone record", async () => {
		if (!e2eConfig.isConfigured || !createdRecordId) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			zoneName: testDomainName,
			recordId: createdRecordId,
		});

		const result = await withDelay(() =>
			zoneRecordDeleteExecute.call(context, 0)
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);

		createdRecordId = null;
	});
});
