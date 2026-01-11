import { describe, expect, test } from "bun:test";
import { dnssecGetStatusExecute } from "../../nodes/DNSimple/resources/dnssec/operations/DnssecGetStatus";
import { dnssecEnableExecute } from "../../nodes/DNSimple/resources/dnssec/operations/DnssecEnable";
import { dnssecDisableExecute } from "../../nodes/DNSimple/resources/dnssec/operations/DnssecDisable";
import { dnssecListDsRecordsExecute } from "../../nodes/DNSimple/resources/dnssec/operations/DnssecListDsRecords";
import { dnssecCreateDsRecordExecute } from "../../nodes/DNSimple/resources/dnssec/operations/DnssecCreateDsRecord";
import { dnssecGetDsRecordExecute } from "../../nodes/DNSimple/resources/dnssec/operations/DnssecGetDsRecord";
import { dnssecDeleteDsRecordExecute } from "../../nodes/DNSimple/resources/dnssec/operations/DnssecDeleteDsRecord";
import { createMockExecuteFunctions } from "../mocks/n8nContext";

describe("dnssec resource", () => {
	describe("getStatus operation", () => {
		test("returns DNSSEC status for domain", async () => {
			const mockStatus = {
				enabled: true,
				created_at: "2024-01-01T00:00:00Z",
				updated_at: "2024-01-01T00:00:00Z",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
				},
				httpResponse: { data: mockStatus },
			});

			const result = await dnssecGetStatusExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.enabled).toBe(true);
		});
	});

	describe("enable operation", () => {
		test("enables DNSSEC for domain", async () => {
			const mockResponse = {
				enabled: true,
				created_at: "2024-01-01T00:00:00Z",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
				},
				httpResponse: { data: mockResponse },
			});

			const result = await dnssecEnableExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.enabled).toBe(true);
		});
	});

	describe("disable operation", () => {
		test("disables DNSSEC for domain", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
				},
				httpResponse: {},
			});

			const result = await dnssecDisableExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});

	describe("listDsRecords operation", () => {
		test("returns DS records for domain", async () => {
			const mockRecords = [
				{ id: 1, domain_id: 123, algorithm: "13", digest: "abc123" },
				{ id: 2, domain_id: 123, algorithm: "8", digest: "def456" },
			];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					returnAll: false,
					limit: 50,
				},
				httpResponse: { data: mockRecords },
			});

			const result = await dnssecListDsRecordsExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
		});
	});

	describe("createDsRecord operation", () => {
		test("creates a new DS record", async () => {
			const mockResponse = {
				id: 1,
				domain_id: 123,
				algorithm: "13",
				digest: "abc123",
				digest_type: "2",
				keytag: "12345",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					algorithm: "13",
					digest: "abc123",
					digestType: "2",
					keytag: "12345",
				},
				httpResponse: { data: mockResponse },
			});

			const result = await dnssecCreateDsRecordExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.algorithm).toBe("13");
		});
	});

	describe("getDsRecord operation", () => {
		test("returns DS record by ID", async () => {
			const mockRecord = {
				id: 1,
				domain_id: 123,
				algorithm: "13",
				digest: "abc123",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					dsRecordId: 1,
				},
				httpResponse: { data: mockRecord },
			});

			const result = await dnssecGetDsRecordExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockRecord);
		});
	});

	describe("deleteDsRecord operation", () => {
		test("deletes DS record by ID", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					dsRecordId: 1,
				},
				httpResponse: {},
			});

			const result = await dnssecDeleteDsRecordExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});
});
