import { beforeEach, describe, expect, test } from "bun:test";
import { ResourceRegistry } from "../nodes/DNSimple/helpers/types";
import type { ResourceDefinition } from "../nodes/DNSimple/helpers/types";

describe("ResourceRegistry", () => {
	let registry: ResourceRegistry;

	beforeEach(() => {
		registry = new ResourceRegistry();
	});

	describe("register", () => {
		test("registers a resource definition", () => {
			const resource: ResourceDefinition = {
				name: "testResource",
				operations: [],
				fields: [],
				handlers: {},
			};

			registry.register(resource);

			expect(registry.getResourceNames()).toContain("testResource");
		});

		test("overwrites existing resource with same name", () => {
			const resource1: ResourceDefinition = {
				name: "testResource",
				operations: [{
					displayName: "Op1",
					name: "op1",
					type: "options",
					options: [],
					default: "",
				}],
				fields: [],
				handlers: {},
			};
			const resource2: ResourceDefinition = {
				name: "testResource",
				operations: [{
					displayName: "Op2",
					name: "op2",
					type: "options",
					options: [],
					default: "",
				}],
				fields: [],
				handlers: {},
			};

			registry.register(resource1);
			registry.register(resource2);

			const operations = registry.getAllOperations();
			expect(operations).toHaveLength(1);
			expect(operations[0].displayName).toBe("Op2");
		});
	});

	describe("getHandler", () => {
		test("returns handler for valid resource and operation", () => {
			const mockHandler = async () => [{ json: {} }];
			const resource: ResourceDefinition = {
				name: "testResource",
				operations: [],
				fields: [],
				handlers: {
					testOperation: mockHandler,
				},
			};

			registry.register(resource);

			const handler = registry.getHandler("testResource", "testOperation");
			expect(handler).toBe(mockHandler);
		});

		test("returns undefined for invalid resource", () => {
			const handler = registry.getHandler("nonExistent", "operation");
			expect(handler).toBeUndefined();
		});

		test("returns undefined for invalid operation", () => {
			const resource: ResourceDefinition = {
				name: "testResource",
				operations: [],
				fields: [],
				handlers: {
					validOperation: async () => [{ json: {} }],
				},
			};

			registry.register(resource);

			const handler = registry.getHandler("testResource", "invalidOperation");
			expect(handler).toBeUndefined();
		});
	});

	describe("getAllOperations", () => {
		test("returns empty array when no resources registered", () => {
			const operations = registry.getAllOperations();
			expect(operations).toEqual([]);
		});

		test("aggregates operations from all resources", () => {
			const resource1: ResourceDefinition = {
				name: "resource1",
				operations: [{
					displayName: "Op1",
					name: "op1",
					type: "options",
					options: [],
					default: "",
				}],
				fields: [],
				handlers: {},
			};
			const resource2: ResourceDefinition = {
				name: "resource2",
				operations: [
					{
						displayName: "Op2",
						name: "op2",
						type: "options",
						options: [],
						default: "",
					},
					{
						displayName: "Op3",
						name: "op3",
						type: "options",
						options: [],
						default: "",
					},
				],
				fields: [],
				handlers: {},
			};

			registry.register(resource1);
			registry.register(resource2);

			const operations = registry.getAllOperations();
			expect(operations).toHaveLength(3);
		});
	});

	describe("getAllFields", () => {
		test("returns empty array when no resources registered", () => {
			const fields = registry.getAllFields();
			expect(fields).toEqual([]);
		});

		test("aggregates fields from all resources", () => {
			const resource1: ResourceDefinition = {
				name: "resource1",
				operations: [],
				fields: [{
					displayName: "Field1",
					name: "field1",
					type: "string",
					default: "",
				}],
				handlers: {},
			};
			const resource2: ResourceDefinition = {
				name: "resource2",
				operations: [],
				fields: [
					{
						displayName: "Field2",
						name: "field2",
						type: "string",
						default: "",
					},
					{ displayName: "Field3", name: "field3", type: "number", default: 0 },
				],
				handlers: {},
			};

			registry.register(resource1);
			registry.register(resource2);

			const fields = registry.getAllFields();
			expect(fields).toHaveLength(3);
		});
	});

	describe("getAllLoadOptions", () => {
		test("returns empty object when no resources have loadOptions", () => {
			const resource: ResourceDefinition = {
				name: "testResource",
				operations: [],
				fields: [],
				handlers: {},
			};

			registry.register(resource);

			const loadOptions = registry.getAllLoadOptions();
			expect(loadOptions).toEqual({});
		});

		test("aggregates loadOptions from all resources", () => {
			const loadOption1 = async () => [];
			const loadOption2 = async () => [];
			const resource1: ResourceDefinition = {
				name: "resource1",
				operations: [],
				fields: [],
				handlers: {},
				methods: {
					loadOptions: { getItems1: loadOption1 },
				},
			};
			const resource2: ResourceDefinition = {
				name: "resource2",
				operations: [],
				fields: [],
				handlers: {},
				methods: {
					loadOptions: { getItems2: loadOption2 },
				},
			};

			registry.register(resource1);
			registry.register(resource2);

			const loadOptions = registry.getAllLoadOptions();
			expect(Object.keys(loadOptions)).toHaveLength(2);
			expect(loadOptions.getItems1).toBe(loadOption1);
			expect(loadOptions.getItems2).toBe(loadOption2);
		});
	});

	describe("getAllListSearch", () => {
		test("returns empty object when no resources have listSearch", () => {
			const resource: ResourceDefinition = {
				name: "testResource",
				operations: [],
				fields: [],
				handlers: {},
			};

			registry.register(resource);

			const listSearch = registry.getAllListSearch();
			expect(listSearch).toEqual({});
		});

		test("aggregates listSearch from all resources", () => {
			const search1 = async () => ({ results: [] });
			const search2 = async () => ({ results: [] });
			const resource1: ResourceDefinition = {
				name: "resource1",
				operations: [],
				fields: [],
				handlers: {},
				methods: {
					listSearch: { searchItems1: search1 },
				},
			};
			const resource2: ResourceDefinition = {
				name: "resource2",
				operations: [],
				fields: [],
				handlers: {},
				methods: {
					listSearch: { searchItems2: search2 },
				},
			};

			registry.register(resource1);
			registry.register(resource2);

			const listSearch = registry.getAllListSearch();
			expect(Object.keys(listSearch)).toHaveLength(2);
			expect(listSearch.searchItems1).toBe(search1);
			expect(listSearch.searchItems2).toBe(search2);
		});
	});

	describe("getResourceNames", () => {
		test("returns empty array when no resources registered", () => {
			const names = registry.getResourceNames();
			expect(names).toEqual([]);
		});

		test("returns all registered resource names", () => {
			registry.register({
				name: "domains",
				operations: [],
				fields: [],
				handlers: {},
			});
			registry.register({
				name: "contacts",
				operations: [],
				fields: [],
				handlers: {},
			});
			registry.register({
				name: "zones",
				operations: [],
				fields: [],
				handlers: {},
			});

			const names = registry.getResourceNames();
			expect(names).toHaveLength(3);
			expect(names).toContain("domains");
			expect(names).toContain("contacts");
			expect(names).toContain("zones");
		});
	});
});
