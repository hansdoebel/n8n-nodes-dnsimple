import { beforeAll, describe, expect, test } from "bun:test";
import {
	createE2EExecuteFunctions,
	e2eConfig,
	ensureAccountId,
	skipIfNotConfigured,
} from "./config";
import { accountListExecute } from "../../nodes/DNSimple/resources/accounts/operations/AccountList";

describe("Accounts E2E", () => {
	beforeAll(async () => {
		if (skipIfNotConfigured()) {
			return;
		}
		await ensureAccountId();
	});

	test("list accounts", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({});
		const result = await accountListExecute.call(context, 0);

		expect(result.length).toBeGreaterThan(0);
		expect(result[0].json).toHaveProperty("id");
		expect(result[0].json).toHaveProperty("email");
	});

	test("list accounts returns valid account data", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({});
		const result = await accountListExecute.call(context, 0);

		expect(result.length).toBeGreaterThan(0);
		expect(result[0].json).toHaveProperty("id");
		expect(result[0].json).toHaveProperty("created_at");
		expect(result[0].json).toHaveProperty("updated_at");
	});
});
