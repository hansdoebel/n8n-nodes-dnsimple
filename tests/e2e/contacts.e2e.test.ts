import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import {
	createE2EExecuteFunctions,
	e2eConfig,
	ensureAccountId,
	skipIfNotConfigured,
} from "./config";
import { CleanupManager, generateTestEmail, withDelay } from "./helpers";
import { contactCreateExecute } from "../../nodes/DNSimple/resources/contacts/operations/ContactCreate";
import { contactGetExecute } from "../../nodes/DNSimple/resources/contacts/operations/ContactGet";
import { contactListExecute } from "../../nodes/DNSimple/resources/contacts/operations/ContactList";
import { contactUpdateExecute } from "../../nodes/DNSimple/resources/contacts/operations/ContactUpdate";
import { contactDeleteExecute } from "../../nodes/DNSimple/resources/contacts/operations/ContactDelete";

describe("Contacts E2E", () => {
	const cleanup = new CleanupManager();
	let createdContactId: number | null = null;

	beforeAll(async () => {
		if (skipIfNotConfigured()) {
			return;
		}
		await ensureAccountId();
	});

	afterAll(async () => {
		await cleanup.runAll();
	});

	test("create contact", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const testEmail = generateTestEmail();
		const context = createE2EExecuteFunctions({
			firstName: "Test",
			lastName: "Contact",
			address1: "123 Test Street",
			city: "Test City",
			stateProvince: "CA",
			postalCode: "12345",
			country: "US",
			email: testEmail,
			phone: "+1.5551234567",
			additionalFields: {
				label: "E2E Test Contact",
				organization: "Test Org",
			},
		});

		const result = await withDelay(() => contactCreateExecute.call(context, 0));

		expect(result).toHaveLength(1);
		expect(result[0].json).toHaveProperty("id");
		expect(result[0].json.first_name).toBe("Test");
		expect(result[0].json.last_name).toBe("Contact");
		expect(result[0].json.email).toBe(testEmail);

		createdContactId = result[0].json.id as number;

		cleanup.register(async () => {
			if (createdContactId) {
				const deleteContext = createE2EExecuteFunctions({
					contactId: createdContactId,
				});
				await contactDeleteExecute.call(deleteContext, 0);
			}
		});
	});

	test("get contact", async () => {
		if (!e2eConfig.isConfigured || !createdContactId) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			contactId: createdContactId,
		});

		const result = await withDelay(() => contactGetExecute.call(context, 0));

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBe(createdContactId);
		expect(result[0].json.first_name).toBe("Test");
	});

	test("list contacts", async () => {
		if (!e2eConfig.isConfigured) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			returnAll: false,
			limit: 50,
		});

		const result = await withDelay(() => contactListExecute.call(context, 0));

		expect(result.length).toBeGreaterThanOrEqual(0);
		if (createdContactId) {
			const contactIds = result.map((r) => r.json.id);
			expect(contactIds).toContain(createdContactId);
		}
	});

	test("update contact", async () => {
		if (!e2eConfig.isConfigured || !createdContactId) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			contactId: createdContactId,
			updateFields: {
				label: "Updated E2E Test Contact",
				organization: "Updated Test Org",
			},
		});

		const result = await withDelay(() => contactUpdateExecute.call(context, 0));

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBe(createdContactId);
		expect(result[0].json.label).toBe("Updated E2E Test Contact");
	});

	test("delete contact", async () => {
		if (!e2eConfig.isConfigured || !createdContactId) {
			expect(true).toBe(true);
			return;
		}

		const context = createE2EExecuteFunctions({
			contactId: createdContactId,
		});

		const result = await withDelay(() => contactDeleteExecute.call(context, 0));

		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);

		createdContactId = null;
	});
});
