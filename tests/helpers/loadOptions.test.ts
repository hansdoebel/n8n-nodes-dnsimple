import { describe, expect, test } from "bun:test";
import {
	getAccounts,
	getContacts,
	getDomains,
	getServices,
	getTemplates,
	getZones,
} from "../../nodes/DNSimple/helpers/loadOptions";
import { createMockLoadOptionsFunctions } from "../mocks/n8nContext";

describe("loadOptions helpers", () => {
	describe("getAccounts", () => {
		test("returns formatted account options with email and plan", async () => {
			const mockContext = createMockLoadOptionsFunctions({
				httpResponse: {
					data: [
						{
							id: 123,
							email: "user@example.com",
							plan_identifier: "professional",
						},
						{
							id: 456,
							email: "team@example.com",
							plan_identifier: "business",
						},
					],
				},
			});

			const result = await getAccounts.call(mockContext);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({
				name: "user@example.com (professional)",
				value: "123",
			});
			expect(result[1]).toEqual({
				name: "team@example.com (business)",
				value: "456",
			});
		});

		test("returns account ID when email is null", async () => {
			const mockContext = createMockLoadOptionsFunctions({
				httpResponse: {
					data: [
						{
							id: 789,
							email: null,
							plan_identifier: null,
						},
					],
				},
			});

			const result = await getAccounts.call(mockContext);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				name: "Account 789",
				value: "789",
			});
		});

		test("returns email only when plan is null", async () => {
			const mockContext = createMockLoadOptionsFunctions({
				httpResponse: {
					data: [
						{
							id: 111,
							email: "solo@example.com",
							plan_identifier: null,
						},
					],
				},
			});

			const result = await getAccounts.call(mockContext);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				name: "solo@example.com",
				value: "111",
			});
		});

		test("returns empty array when no accounts", async () => {
			const mockContext = createMockLoadOptionsFunctions({
				httpResponse: { data: [] },
			});

			const result = await getAccounts.call(mockContext);

			expect(result).toEqual([]);
		});
	});

	describe("getContacts", () => {
		test("returns formatted contact options with label", async () => {
			const mockContext = createMockLoadOptionsFunctions({
				nodeParameters: { accountId: "123" },
				httpResponse: {
					data: [
						{
							id: 1,
							first_name: "John",
							last_name: "Doe",
							label: "Primary Contact",
						},
						{
							id: 2,
							first_name: "Jane",
							last_name: "Smith",
							label: "",
						},
					],
				},
			});

			const result = await getContacts.call(mockContext);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({
				name: "Primary Contact",
				value: 1,
			});
			expect(result[1]).toEqual({
				name: "Jane Smith",
				value: 2,
			});
		});

		test("returns empty array when no contacts", async () => {
			const mockContext = createMockLoadOptionsFunctions({
				nodeParameters: { accountId: "123" },
				httpResponse: { data: [] },
			});

			const result = await getContacts.call(mockContext);

			expect(result).toEqual([]);
		});
	});

	describe("getDomains", () => {
		test("returns formatted domain options", async () => {
			const mockContext = createMockLoadOptionsFunctions({
				nodeParameters: { accountId: "123" },
				httpResponse: {
					data: [
						{
							id: 1,
							name: "example.com",
							unicode_name: "example.com",
						},
						{
							id: 2,
							name: "xn--nxasmq5b.com",
							unicode_name: "test.com",
						},
					],
				},
			});

			const result = await getDomains.call(mockContext);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({
				name: "example.com",
				value: "example.com",
			});
			expect(result[1]).toEqual({
				name: "test.com",
				value: "xn--nxasmq5b.com",
			});
		});

		test("uses name when unicode_name is empty", async () => {
			const mockContext = createMockLoadOptionsFunctions({
				nodeParameters: { accountId: "123" },
				httpResponse: {
					data: [
						{
							id: 1,
							name: "example.com",
							unicode_name: "",
						},
					],
				},
			});

			const result = await getDomains.call(mockContext);

			expect(result[0].name).toBe("example.com");
		});
	});

	describe("getServices", () => {
		test("returns formatted service options", async () => {
			const mockContext = createMockLoadOptionsFunctions({
				httpResponse: {
					data: [
						{ id: 1, name: "Heroku", sid: "heroku" },
						{ id: 2, name: "GitHub Pages", sid: "github-pages" },
					],
				},
			});

			const result = await getServices.call(mockContext);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({
				name: "Heroku",
				value: "heroku",
			});
			expect(result[1]).toEqual({
				name: "GitHub Pages",
				value: "github-pages",
			});
		});
	});

	describe("getTemplates", () => {
		test("returns formatted template options", async () => {
			const mockContext = createMockLoadOptionsFunctions({
				nodeParameters: { accountId: "123" },
				httpResponse: {
					data: [
						{ id: 1, name: "Default Template", sid: "default" },
						{ id: 2, name: "Custom Template", sid: "custom" },
					],
				},
			});

			const result = await getTemplates.call(mockContext);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({
				name: "Default Template",
				value: "1",
			});
			expect(result[1]).toEqual({
				name: "Custom Template",
				value: "2",
			});
		});
	});

	describe("getZones", () => {
		test("returns formatted zone options", async () => {
			const mockContext = createMockLoadOptionsFunctions({
				nodeParameters: { accountId: "123" },
				httpResponse: {
					data: [
						{ id: 1, name: "example.com" },
						{ id: 2, name: "test.org" },
					],
				},
			});

			const result = await getZones.call(mockContext);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({
				name: "example.com",
				value: "example.com",
			});
			expect(result[1]).toEqual({
				name: "test.org",
				value: "test.org",
			});
		});
	});
});
