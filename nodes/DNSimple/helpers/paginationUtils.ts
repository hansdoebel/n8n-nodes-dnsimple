import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
} from "n8n-workflow";
import { dnsimpleApiRequest } from "../methods/apiRequest";

interface PaginatedRequestOptions {
	qs?: IDataObject;
	dataPath?: string;
	perPage?: number;
}

export async function fetchAllPages(
	context: IExecuteFunctions,
	endpoint: string,
	options: PaginatedRequestOptions = {},
): Promise<IDataObject[]> {
	const { qs = {}, dataPath = "data", perPage = 100 } = options;
	const allItems: IDataObject[] = [];
	let page = 1;
	let hasMore = true;

	while (hasMore) {
		qs.page = page;
		qs.per_page = perPage;
		const response = await dnsimpleApiRequest.call(
			context,
			"GET",
			endpoint,
			{},
			qs,
		);

		const items = dataPath
			.split(".")
			.reduce((obj: Record<string, unknown>, key: string) =>
				(obj?.[key] ?? {}) as Record<string, unknown>, response) as
			unknown as IDataObject[] | undefined;

		allItems.push(...(items || []));
		hasMore = response.pagination?.total_pages > page;
		page++;
	}

	return allItems;
}

export async function handlePaginatedList(
	context: IExecuteFunctions,
	index: number,
	endpoint: string,
	options: PaginatedRequestOptions = {},
): Promise<INodeExecutionData[]> {
	const returnAll = context.getNodeParameter("returnAll", index) as boolean;
	const qs = { ...(options.qs || {}) };

	if (returnAll) {
		const items = await fetchAllPages(context, endpoint, {
			...options,
			qs,
		});
		return items.map((item) => ({ json: item }));
	}

	const limit = context.getNodeParameter("limit", index) as number;
	qs.per_page = limit;
	const response = await dnsimpleApiRequest.call(
		context,
		"GET",
		endpoint,
		{},
		qs,
	);

	const dataPath = options.dataPath || "data";
	const items = dataPath
		.split(".")
		.reduce((obj: Record<string, unknown>, key: string) =>
				(obj?.[key] ?? {}) as Record<string, unknown>, response) as
		unknown as IDataObject[] | undefined;

	return (items || []).map((item) => ({ json: item }));
}
