import { describe, expect, test } from "bun:test";
import {
	vanityNameServerEnableExecute,
	vanityNameServerDisableExecute,
} from "../../nodes/DNSimple/resources/vanityNameServers/operations";
import { createMockExecuteFunctions } from "../mocks/n8nContext";

describe("vanityNameServers resource", () => {
	describe("enable operation", () => {
		test("enables vanity name servers for domain", async () => {
			const mockResponse = [
				{ id: 1, name: "ns1.example.com", ipv4: "1.2.3.4", ipv6: "::1" },
				{ id: 2, name: "ns2.example.com", ipv4: "5.6.7.8", ipv6: "::2" },
			];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
				},
				httpResponse: { data: mockResponse },
			});

			const result = await vanityNameServerEnableExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({ data: mockResponse });
		});
	});

	describe("disable operation", () => {
		test("disables vanity name servers for domain", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
				},
				httpResponse: {},
			});

			const result = await vanityNameServerDisableExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});
});
