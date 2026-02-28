import { describe, expect, mock, test } from "bun:test";
import {
	fetchAllPages,
	handlePaginatedList,
} from "../../nodes/DNSimple/helpers/paginationUtils";

function createMockContext(params: Record<string, any>, responses: any[]) {
	let callIndex = 0;
	return {
		getNodeParameter: (name: string) => params[name],
		getCredentials: async () => ({
			environment: "sandbox",
			apiToken: "test",
		}),
		getNode: () => ({ name: "test" }),
		helpers: {
			httpRequestWithAuthentication: mock(async () => {
				return responses[callIndex++] || responses[responses.length - 1];
			}),
		},
	} as any;
}

describe("paginationUtils", () => {
	describe("fetchAllPages", () => {
		test("fetches single page", async () => {
			const ctx = createMockContext({}, [
				{
					data: [{ id: 1 }, { id: 2 }],
					pagination: { total_pages: 1 },
				},
			]);

			const result = await fetchAllPages(ctx, "/test");
			expect(result).toEqual([{ id: 1 }, { id: 2 }]);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledTimes(1);
		});

		test("fetches multiple pages", async () => {
			const ctx = createMockContext({}, [
				{
					data: [{ id: 1 }],
					pagination: { total_pages: 2 },
				},
				{
					data: [{ id: 2 }],
					pagination: { total_pages: 2 },
				},
			]);

			const result = await fetchAllPages(ctx, "/test");
			expect(result).toEqual([{ id: 1 }, { id: 2 }]);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledTimes(2);
		});

		test("supports custom dataPath", async () => {
			const ctx = createMockContext({}, [
				{
					data: { rows: [{ id: 1 }] },
					pagination: { total_pages: 1 },
				},
			]);

			const result = await fetchAllPages(ctx, "/test", {
				dataPath: "data.rows",
			});
			expect(result).toEqual([{ id: 1 }]);
		});

		test("supports custom perPage", async () => {
			const ctx = createMockContext({}, [
				{
					data: [{ id: 1 }],
					pagination: { total_pages: 1 },
				},
			]);

			await fetchAllPages(ctx, "/test", { perPage: 10000 });
			const call = ctx.helpers.httpRequestWithAuthentication.mock.calls[0];
			expect(call[1].qs.per_page).toBe(10000);
		});
	});

	describe("handlePaginatedList", () => {
		test("returns all items when returnAll is true", async () => {
			const ctx = createMockContext({ returnAll: true }, [
				{
					data: [{ id: 1 }, { id: 2 }],
					pagination: { total_pages: 1 },
				},
			]);

			const result = await handlePaginatedList(ctx, 0, "/test");
			expect(result).toEqual([{ json: { id: 1 } }, { json: { id: 2 } }]);
		});

		test("respects limit when returnAll is false", async () => {
			const ctx = createMockContext({ returnAll: false, limit: 5 }, [
				{
					data: [{ id: 1 }, { id: 2 }],
				},
			]);

			const result = await handlePaginatedList(ctx, 0, "/test");
			expect(result).toEqual([{ json: { id: 1 } }, { json: { id: 2 } }]);
			const call = ctx.helpers.httpRequestWithAuthentication.mock.calls[0];
			expect(call[1].qs.per_page).toBe(5);
		});

		test("passes qs filters", async () => {
			const ctx = createMockContext({ returnAll: false, limit: 10 }, [
				{ data: [] },
			]);

			await handlePaginatedList(ctx, 0, "/test", {
				qs: { name_like: "foo" },
			});
			const call = ctx.helpers.httpRequestWithAuthentication.mock.calls[0];
			expect(call[1].qs.name_like).toBe("foo");
		});
	});
});
