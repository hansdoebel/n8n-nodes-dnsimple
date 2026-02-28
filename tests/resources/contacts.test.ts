import { describe, expect, test } from "bun:test";
import {
	contactListExecute,
	contactCreateExecute,
	contactGetExecute,
	contactUpdateExecute,
	contactDeleteExecute,
} from "../../nodes/DNSimple/resources/contacts/operations";
import { createMockExecuteFunctions } from "../mocks/n8nContext";

describe("contacts resource", () => {
	describe("list operation", () => {
		test("returns all contacts", async () => {
			const mockContacts = [
				{
					id: 1,
					first_name: "John",
					last_name: "Doe",
					email: "john@example.com",
				},
				{
					id: 2,
					first_name: "Jane",
					last_name: "Smith",
					email: "jane@example.com",
				},
			];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					returnAll: false,
					limit: 50,
				},
				httpResponse: { data: mockContacts },
			});

			const result = await contactListExecute.call(mockContext, 0);

			expect(result).toHaveLength(2);
			expect(result[0].json).toEqual(mockContacts[0]);
		});

		test("returns all contacts with pagination", async () => {
			const page1 = [{ id: 1 }, { id: 2 }];
			const page2 = [{ id: 3 }];

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					returnAll: true,
				},
				httpResponse: [
					{ data: page1, pagination: { total_pages: 2 } },
					{ data: page2, pagination: { total_pages: 2 } },
				],
			});

			const result = await contactListExecute.call(mockContext, 0);

			expect(result.length).toBeGreaterThanOrEqual(2);
		});
	});

	describe("create operation", () => {
		test("creates a new contact with required fields", async () => {
			const mockResponse = {
				id: 1,
				first_name: "John",
				last_name: "Doe",
				email: "john@example.com",
				phone: "+1234567890",
				address1: "123 Main St",
				city: "New York",
				state_province: "NY",
				postal_code: "10001",
				country: "US",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					firstName: "John",
					lastName: "Doe",
					email: "john@example.com",
					phone: "+1234567890",
					address1: "123 Main St",
					city: "New York",
					stateProvince: "NY",
					postalCode: "10001",
					country: "US",
					additionalFields: {},
				},
				httpResponse: { data: mockResponse },
			});

			const result = await contactCreateExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});

		test("creates contact with additional fields", async () => {
			const mockResponse = {
				id: 1,
				first_name: "John",
				last_name: "Doe",
				organization_name: "Acme Inc",
				job_title: "Developer",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					firstName: "John",
					lastName: "Doe",
					email: "john@example.com",
					phone: "+1234567890",
					address1: "123 Main St",
					city: "New York",
					stateProvince: "NY",
					postalCode: "10001",
					country: "US",
					additionalFields: {
						organizationName: "Acme Inc",
						jobTitle: "Developer",
					},
				},
				httpResponse: { data: mockResponse },
			});

			const result = await contactCreateExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.organization_name).toBe("Acme Inc");
		});
	});

	describe("get operation", () => {
		test("returns contact by ID", async () => {
			const mockContact = {
				id: 1,
				first_name: "John",
				last_name: "Doe",
				email: "john@example.com",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					contactId: { mode: "id", value: "1" },
				},
				httpResponse: { data: mockContact },
			});

			const result = await contactGetExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockContact);
		});
	});

	describe("update operation", () => {
		test("updates contact fields", async () => {
			const mockResponse = {
				id: 1,
				first_name: "Johnny",
				last_name: "Doe",
				email: "johnny@example.com",
			};

			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					contactId: { mode: "id", value: "1" },
					updateFields: {
						firstName: "Johnny",
						email: "johnny@example.com",
					},
				},
				httpResponse: { data: mockResponse },
			});

			const result = await contactUpdateExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.first_name).toBe("Johnny");
		});
	});

	describe("delete operation", () => {
		test("deletes contact by ID", async () => {
			const mockContext = createMockExecuteFunctions({
				nodeParameters: {
					accountId: "123",
					contactId: { mode: "id", value: "1" },
				},
				httpResponse: {},
			});

			const result = await contactDeleteExecute.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});
});
