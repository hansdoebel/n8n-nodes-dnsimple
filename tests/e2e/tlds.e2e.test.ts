import { beforeAll, describe, expect, test } from "bun:test";
import {
	createE2EExecuteFunctions,
	e2eConfig,
	ensureAccountId,
	skipIfNotConfigured,
} from "./config";
import { withDelay } from "./helpers";
import { tldListExecute, tldGetExecute, tldGetExtendedAttributesExecute } from "../../nodes/DNSimple/resources/tlds/operations";

describe("TLDs E2E", () => {
	beforeAll(async () => {
		if (skipIfNotConfigured()) {
			return;
		}
		await ensureAccountId();
	});

	test("list TLDs", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			returnAll: false,
			limit: 10,
		});

		const result = await withDelay(() => tldListExecute.call(context, 0));

		expect(result.length).toBeGreaterThan(0);
		expect(result[0].json).toHaveProperty("tld");
		expect(result[0].json).toHaveProperty("tld_type");
	});

	test("list all TLDs with pagination", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			returnAll: true,
		});

		const result = await withDelay(() => tldListExecute.call(context, 0));

		expect(result.length).toBeGreaterThan(10);
	});

	test("get TLD details for com", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			tld: "com",
		});

		const result = await withDelay(() => tldGetExecute.call(context, 0));

		expect(result).toHaveLength(1);
		expect(result[0].json.tld).toBe("com");
		expect(result[0].json).toHaveProperty("whois_privacy");
		expect(result[0].json).toHaveProperty("registration_enabled");
	});

	test("get extended attributes for us TLD", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			tld: "us",
		});

		const result = await withDelay(() =>
			tldGetExtendedAttributesExecute.call(context, 0)
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toHaveProperty("data");
	});

	test("get extended attributes for com TLD returns empty", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			tld: "com",
		});

		const result = await withDelay(() =>
			tldGetExtendedAttributesExecute.call(context, 0)
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.data).toEqual([]);
	});
});
