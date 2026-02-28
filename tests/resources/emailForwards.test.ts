import { describe, expect, test } from "bun:test";
import {
	emailForwardListExecute,
	emailForwardCreateExecute,
	emailForwardGetExecute,
	emailForwardDeleteExecute,
} from "../../nodes/DNSimple/resources/emailForwards/operations";
import { createMockExecuteFunctions } from "../mocks/n8nContext";

describe("emailForwards resource", () => {
	describe("list operation", () => {
		test("returns email forwards for domain", async () => {
			const mockForwards = [
				{
					id: 1,
					domain_id: 123,
					from: "info@example.com",
					to: "admin@gmail.com",
				},
				{
					id: 2,
					domain_id: 123,
					from: "support@example.com",
					to: "help@gmail.com",
				},
			];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					returnAll: false,
					limit: 50,
				},
				httpResponse: { data: mockForwards },
			});

			const result = await emailForwardListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
			expect(result[0].json).toEqual(mockForwards[0]);
		});

		test("returns all email forwards with pagination", async () => {
			const page1 = [{ id: 1, from: "info@example.com" }];
			const page2 = [{ id: 2, from: "support@example.com" }];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					returnAll: true,
				},
				httpResponse: [
					{ data: page1, pagination: { total_pages: 2 } },
					{ data: page2, pagination: { total_pages: 2 } },
				],
			});

			const result = await emailForwardListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
		});
	});

	describe("create operation", () => {
		test("creates a new email forward", async () => {
			const mockResponse = {
				id: 1,
				domain_id: 123,
				from: "info@example.com",
				to: "admin@gmail.com",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					aliasName: "info",
					destinationEmail: "admin@gmail.com",
				},
				httpResponse: { data: mockResponse },
			});

			const result = await emailForwardCreateExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.from).toBe("info@example.com");
		});
	});

	describe("get operation", () => {
		test("returns email forward by ID", async () => {
			const mockForward = {
				id: 1,
				domain_id: 123,
				from: "info@example.com",
				to: "admin@gmail.com",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					emailForwardId: 1,
				},
				httpResponse: { data: mockForward },
			});

			const result = await emailForwardGetExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockForward);
		});
	});

	describe("delete operation", () => {
		test("deletes email forward by ID", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					emailForwardId: 1,
				},
				httpResponse: {},
			});

			const result = await emailForwardDeleteExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});
});
