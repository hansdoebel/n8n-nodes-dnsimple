import { describe, expect, test } from "bun:test";
import { getBaseUrl } from "../../nodes/DNSimple/methods/apiRequest";
import { DNSIMPLE_URLS } from "../../nodes/DNSimple/helpers/constants";

describe("apiRequest helpers", () => {
	describe("getBaseUrl", () => {
		test("returns production URL for production environment", () => {
			const url = getBaseUrl("production");
			expect(url).toBe(DNSIMPLE_URLS.PRODUCTION_API);
			expect(url).toBe("https://api.dnsimple.com");
		});

		test("returns sandbox URL for sandbox environment", () => {
			const url = getBaseUrl("sandbox");
			expect(url).toBe(DNSIMPLE_URLS.SANDBOX_API);
			expect(url).toBe("https://api.sandbox.dnsimple.com");
		});

		test("returns production URL for unknown environment", () => {
			const url = getBaseUrl("unknown");
			expect(url).toBe(DNSIMPLE_URLS.PRODUCTION_API);
		});

		test("returns production URL for empty string", () => {
			const url = getBaseUrl("");
			expect(url).toBe(DNSIMPLE_URLS.PRODUCTION_API);
		});
	});
});
