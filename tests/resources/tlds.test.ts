import { describe, expect, test } from "bun:test";
import { tldListExecute, tldGetExecute, tldGetExtendedAttributesExecute } from "../../nodes/DNSimple/resources/tlds/operations";
import { createMockExecuteFunctions } from "../mocks/n8nContext";

describe("tlds resource", () => {
	describe("list operation", () => {
		test("returns all TLDs", async () => {
			const mockTlds = [
				{ tld: "com", tld_type: 1, minimum_registration: 1 },
				{ tld: "net", tld_type: 1, minimum_registration: 1 },
				{ tld: "org", tld_type: 1, minimum_registration: 1 },
			];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					returnAll: false,
					limit: 50,
				},
				httpResponse: { data: mockTlds },
			});

			const result = await tldListExecute.call(mockContext, 0);

			expect(result).toHaveLength(3);
			expect(result[0].json.tld).toBe("com");
		});

		test("returns all TLDs with pagination", async () => {
			const page1 = [{ tld: "com" }, { tld: "net" }];
			const page2 = [{ tld: "org" }];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					returnAll: true,
				},
				httpResponse: [
					{ data: page1, pagination: { total_pages: 2 } },
					{ data: page2, pagination: { total_pages: 2 } },
				],
			});

			const result = await tldListExecute.call(mockContext, 0);

			expect(result).toHaveLength(3);
		});
	});

	describe("get operation", () => {
		test("returns TLD details", async () => {
			const mockTld = {
				tld: "com",
				tld_type: 1,
				whois_privacy: true,
				auto_renew_only: false,
				minimum_registration: 1,
				registration_enabled: true,
				renewal_enabled: true,
				transfer_enabled: true,
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					tld: "com",
				},
				httpResponse: { data: mockTld },
			});

			const result = await tldGetExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.tld).toBe("com");
			expect(result[0].json.whois_privacy).toBe(true);
		});
	});

	describe("getExtendedAttributes operation", () => {
		test("returns extended attributes for TLD", async () => {
			const mockAttributes = [
				{
					name: "us_nexus",
					description: "Nexus Category",
					required: true,
					options: [
						{ title: "US Citizen", value: "C11" },
						{ title: "Permanent Resident", value: "C12" },
					],
				},
			];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					tld: "us",
				},
				httpResponse: { data: mockAttributes },
			});

			const result = await tldGetExtendedAttributesExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.data).toEqual(mockAttributes);
		});

		test("returns result for TLD without extended attributes", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					tld: "com",
				},
				httpResponse: { data: [] },
			});

			const result = await tldGetExtendedAttributesExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.data).toEqual([]);
		});
	});
});
