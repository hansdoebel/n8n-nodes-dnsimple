import { beforeAll, describe, expect, test } from "bun:test";
import {
	createE2EExecuteFunctions,
	e2eConfig,
	ensureAccountId,
	skipIfNotConfigured,
} from "./config";
import { withDelay } from "./helpers";
import { checkAvailabilityExecute } from "../../nodes/DNSimple/resources/registrar/operations/CheckAvailability";
import { getPricesExecute } from "../../nodes/DNSimple/resources/registrar/operations/GetPrices";

describe("Registrar E2E", () => {
	beforeAll(async () => {
		if (skipIfNotConfigured()) {
			return;
		}
		await ensureAccountId();
	});

	test("check availability for taken domain", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			domainName: "google.com",
		});

		const result = await withDelay(() =>
			checkAvailabilityExecute.call(context, 0)
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.domain).toBe("google.com");
		expect(result[0].json.available).toBe(false);
	});

	test("check availability for potentially available domain", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const uniqueDomain = `test-${Date.now()}-${
			Math.random().toString(36).substring(2, 10)
		}.com`;

		const context = createE2EExecuteFunctions({
			domainName: uniqueDomain,
		});

		const result = await withDelay(() =>
			checkAvailabilityExecute.call(context, 0)
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.domain).toBe(uniqueDomain);
		expect(result[0].json).toHaveProperty("available");
		expect(result[0].json).toHaveProperty("premium");
	});

	test("get prices for com domain", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			domainName: "example.com",
		});

		const result = await withDelay(() => getPricesExecute.call(context, 0));

		expect(result).toHaveLength(1);
		expect(result[0].json.domain).toBe("example.com");
		expect(result[0].json).toHaveProperty("premium");
		expect(result[0].json).toHaveProperty("registration_price");
		expect(result[0].json).toHaveProperty("renewal_price");
		expect(result[0].json).toHaveProperty("transfer_price");
	});

	test("get prices for different TLDs", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			domainName: "example.io",
		});

		const result = await withDelay(() => getPricesExecute.call(context, 0));

		expect(result).toHaveLength(1);
		expect(result[0].json.domain).toBe("example.io");
		expect(typeof result[0].json.registration_price).toBe("number");
	});
});
