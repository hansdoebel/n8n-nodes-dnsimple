import { describe, expect, test } from "bun:test";
import {
	certificateDownloadExecute,
	certificateGetExecute,
	certificateGetPrivateKeyExecute,
	certificateIssueExecute,
	certificateListExecute,
	certificateOrderExecute,
	certificateRenewExecute,
} from "../../nodes/DNSimple/resources/certificates/operations";
import { createMockExecuteFunctions } from "../mocks/n8nContext";

describe("certificates resource", () => {
	describe("get operation", () => {
		test("returns certificate by ID with string domainId", async () => {
			const mockCertificate = {
				id: 1,
				domain_id: 123,
				common_name: "example.com",
				state: "issued",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					certificateId: 1,
				},
				httpResponse: { data: mockCertificate },
			});

			const result = await certificateGetExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockCertificate);
		});

		test("returns certificate with resourceLocator domainId", async () => {
			const mockCertificate = {
				id: 1,
				domain_id: 123,
				common_name: "example.com",
				state: "issued",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: { mode: "list", value: "example.com" },
					certificateId: 1,
				},
				httpResponse: { data: mockCertificate },
			});

			const result = await certificateGetExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockCertificate);
		});
	});

	describe("list operation", () => {
		test("returns certificates with limit", async () => {
			const mockCertificates = [
				{ id: 1, common_name: "example.com", state: "issued" },
				{ id: 2, common_name: "test.com", state: "pending" },
			];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					returnAll: false,
					limit: 50,
					options: {},
				},
				httpResponse: { data: mockCertificates },
			});

			const result = await certificateListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
			expect(result[0].json).toEqual(mockCertificates[0]);
		});

		test("returns all certificates with pagination", async () => {
			const page1Certs = [{ id: 1 }, { id: 2 }];
			const page2Certs = [{ id: 3 }];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					returnAll: true,
					options: {},
				},
				httpResponse: [
					{ data: page1Certs, pagination: { total_pages: 2 } },
					{ data: page2Certs, pagination: { total_pages: 2 } },
				],
			});

			const result = await certificateListExecute.call(mockContext, 0);

			expect(result).toHaveLength(3);
		});

		test("applies sort option", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					returnAll: false,
					limit: 50,
					options: { sort: "expiration:asc" },
				},
				httpResponse: { data: [] },
			});

			const result = await certificateListExecute.call(mockContext, 0);

			expect(result).toEqual([]);
		});
	});

	describe("download operation", () => {
		test("returns certificate download data", async () => {
			const mockDownload = {
				server: "-----BEGIN CERTIFICATE-----\n...",
				root: "-----BEGIN CERTIFICATE-----\n...",
				chain: ["-----BEGIN CERTIFICATE-----\n..."],
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					certificateId: 1,
				},
				httpResponse: { data: mockDownload },
			});

			const result = await certificateDownloadExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockDownload);
		});
	});

	describe("getPrivateKey operation", () => {
		test("returns certificate private key", async () => {
			const mockPrivateKey = {
				private_key: "-----BEGIN RSA PRIVATE KEY-----\n...",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					certificateId: 1,
				},
				httpResponse: { data: mockPrivateKey },
			});

			const result = await certificateGetPrivateKeyExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockPrivateKey);
		});
	});

	describe("order operation", () => {
		test("orders a new Let's Encrypt certificate", async () => {
			const mockResponse = {
				id: 1,
				domain_id: 123,
				common_name: "example.com",
				state: "requesting",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					options: {},
				},
				httpResponse: { data: mockResponse },
			});

			const result = await certificateOrderExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});

		test("orders certificate with alternate names", async () => {
			const mockResponse = {
				id: 1,
				domain_id: 123,
				common_name: "example.com",
				alternate_names: ["www.example.com", "api.example.com"],
				state: "requesting",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					options: {
						name: "example.com",
						alternateNames: "www.example.com,api.example.com",
					},
				},
				httpResponse: { data: mockResponse },
			});

			const result = await certificateOrderExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.alternate_names).toHaveLength(2);
		});
	});

	describe("issue operation", () => {
		test("issues a pending certificate", async () => {
			const mockResponse = {
				id: 1,
				domain_id: 123,
				common_name: "example.com",
				state: "issued",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					certificateId: 1,
				},
				httpResponse: { data: mockResponse },
			});

			const result = await certificateIssueExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.state).toBe("issued");
		});
	});

	describe("renew operation", () => {
		test("renews an existing certificate", async () => {
			const mockResponse = {
				id: 2,
				domain_id: 123,
				common_name: "example.com",
				state: "requesting",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					domainId: "example.com",
					certificateId: 1,
					options: {},
				},
				httpResponse: { data: mockResponse },
			});

			const result = await certificateRenewExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});
});
