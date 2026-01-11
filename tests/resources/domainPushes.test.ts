import { describe, expect, test } from "bun:test";
import { domainPushListExecute } from "../../nodes/DNSimple/resources/domainPushes/operations/DomainPushList";
import { domainPushInitiateExecute } from "../../nodes/DNSimple/resources/domainPushes/operations/DomainPushInitiate";
import { domainPushAcceptExecute } from "../../nodes/DNSimple/resources/domainPushes/operations/DomainPushAccept";
import { domainPushRejectExecute } from "../../nodes/DNSimple/resources/domainPushes/operations/DomainPushReject";
import { createMockExecuteFunctions } from "../mocks/n8nContext";

describe("domainPushes resource", () => {
	describe("list operation", () => {
		test("returns pending domain pushes", async () => {
			const mockPushes = [
				{ id: 1, domain_id: 123, contact_id: 456, accepted_at: null },
				{ id: 2, domain_id: 124, contact_id: 457, accepted_at: null },
			];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					returnAll: false,
					limit: 50,
				},
				httpResponse: { data: mockPushes },
			});

			const result = await domainPushListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
			expect(result[0].json).toEqual(mockPushes[0]);
		});
	});

	describe("initiate operation", () => {
		test("initiates a domain push", async () => {
			const mockResponse = {
				id: 1,
				domain_id: 123,
				contact_id: 456,
				account_id: 789,
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					newAccountEmail: "recipient@example.com",
					contactId: { mode: "id", value: "456" },
				},
				httpResponse: { data: mockResponse },
			});

			const result = await domainPushInitiateExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe("accept operation", () => {
		test("accepts a domain push", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					pushId: 1,
					contactId: { mode: "id", value: "456" },
				},
				httpResponse: {},
			});

			const result = await domainPushAcceptExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});

	describe("reject operation", () => {
		test("rejects a domain push", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					pushId: 1,
				},
				httpResponse: {},
			});

			const result = await domainPushRejectExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});
});
