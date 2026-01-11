import { describe, expect, test } from "bun:test";
import { checkAvailabilityExecute } from "../../nodes/DNSimple/resources/registrar/operations/CheckAvailability";
import { getPricesExecute } from "../../nodes/DNSimple/resources/registrar/operations/GetPrices";
import { registerExecute } from "../../nodes/DNSimple/resources/registrar/operations/Register";
import { renewExecute } from "../../nodes/DNSimple/resources/registrar/operations/Renew";
import { transferExecute } from "../../nodes/DNSimple/resources/registrar/operations/Transfer";
import { createMockExecuteFunctions } from "../mocks/n8nContext";

describe("registrar resource", () => {
	describe("checkAvailability operation", () => {
		test("returns availability for domain", async () => {
			const mockResponse = {
				domain: "example.com",
				available: false,
				premium: false,
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainName: "example.com",
				},
				httpResponse: { data: mockResponse },
			});

			const result = await checkAvailabilityExecute.call(
				mockContext,
				0,
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.available).toBe(false);
		});

		test("returns availability for available domain", async () => {
			const mockResponse = {
				domain: "newdomain.com",
				available: true,
				premium: false,
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainName: "newdomain.com",
				},
				httpResponse: { data: mockResponse },
			});

			const result = await checkAvailabilityExecute.call(
				mockContext,
				0,
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.available).toBe(true);
		});
	});

	describe("getPrices operation", () => {
		test("returns prices for domain", async () => {
			const mockResponse = {
				domain: "example.com",
				premium: false,
				registration_price: 14.0,
				renewal_price: 14.0,
				transfer_price: 14.0,
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainName: "example.com",
				},
				httpResponse: { data: mockResponse },
			});

			const result = await getPricesExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.registration_price).toBe(14.0);
		});
	});

	describe("register operation", () => {
		test("registers a new domain", async () => {
			const mockResponse = {
				id: 1,
				domain_id: 123,
				registrant_id: 456,
				state: "new",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainName: "newdomain.com",
					registrantId: { mode: "id", value: "456" },
					options: {},
				},
				httpResponse: { data: mockResponse },
			});

			const result = await registerExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.state).toBe("new");
		});

		test("registers domain with auto-renew", async () => {
			const mockResponse = {
				id: 1,
				domain_id: 123,
				auto_renew: true,
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainName: "newdomain.com",
					registrantId: { mode: "id", value: "456" },
					options: { autoRenew: true },
				},
				httpResponse: { data: mockResponse },
			});

			const result = await registerExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.auto_renew).toBe(true);
		});
	});

	describe("renew operation", () => {
		test("renews a domain", async () => {
			const mockResponse = {
				id: 1,
				domain_id: 123,
				state: "renewing",
				period: 1,
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: { mode: "list", value: "example.com" },
					period: 1,
				},
				httpResponse: { data: mockResponse },
			});

			const result = await renewExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.state).toBe("renewing");
		});
	});

	describe("transfer operation", () => {
		test("initiates domain transfer", async () => {
			const mockResponse = {
				id: 1,
				domain_id: 123,
				state: "transferring",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainName: "example.com",
					registrantId: { mode: "id", value: "456" },
					authCode: "",
					options: {},
				},
				httpResponse: { data: mockResponse },
			});

			const result = await transferExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.state).toBe("transferring");
		});

		test("transfers with auth code", async () => {
			const mockResponse = {
				id: 1,
				domain_id: 123,
				state: "transferring",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainName: "example.com",
					registrantId: { mode: "id", value: "456" },
					authCode: "ABC123",
					options: {},
				},
				httpResponse: { data: mockResponse },
			});

			const result = await transferExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
		});
	});
});
