import { describe, expect, test } from "bun:test";
import { accountListExecute } from "../../nodes/DNSimple/resources/accounts/operations";
import { createMockExecuteFunctions } from "../mocks/n8nContext";

describe("accounts resource", () => {
	describe("list operation", () => {
		test("returns all accounts", async () => {
			const mockAccounts = [
				{
					id: 123,
					email: "user@example.com",
					plan_identifier: "professional",
					created_at: "2024-01-01T00:00:00Z",
					updated_at: "2024-01-01T00:00:00Z",
				},
				{
					id: 456,
					email: "team@example.com",
					plan_identifier: "business",
					created_at: "2024-01-01T00:00:00Z",
					updated_at: "2024-01-01T00:00:00Z",
				},
			];

			const mockContext = createMockExecuteFunctions({
				httpResponse: { data: mockAccounts },
			});

			const result = await accountListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
			expect(result[0].json).toEqual(mockAccounts[0]);
			expect(result[1].json).toEqual(mockAccounts[1]);
		});

		test("returns empty array when no accounts", async () => {
			const mockContext = createMockExecuteFunctions({
				httpResponse: { data: [] },
			});

			const result = await accountListExecute.call(mockContext, 0);

			expect(result).toEqual([]);
		});

		test("handles missing data property", async () => {
			const mockContext = createMockExecuteFunctions({
				httpResponse: {},
			});

			const result = await accountListExecute.call(mockContext, 0);

			expect(result).toEqual([]);
		});
	});
});
