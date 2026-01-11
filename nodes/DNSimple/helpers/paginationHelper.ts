import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
} from "n8n-workflow";
import { dnsimpleApiRequest } from "./apiRequest";

export async function getAllPaginatedResults(
	context: IExecuteFunctions,
	endpoint: string,
	qs: IDataObject = {},
): Promise<IDataObject[]> {
	const items: IDataObject[] = [];
	let page = 1;
	let hasMore = true;

	while (hasMore) {
		qs.page = page;
		qs.per_page = 100;
		const response = await dnsimpleApiRequest.call(
			context,
			"GET",
			endpoint,
			{},
			qs,
		);
		const data = (response.data as IDataObject[]) || [];
		items.push(...data);

		const pagination = response.pagination as
			| { current_page: number; total_pages: number }
			| undefined;
		hasMore = pagination !== undefined &&
			pagination.current_page < pagination.total_pages;
		page++;
	}

	return items;
}

export function toNodeExecutionData(
	items: IDataObject[],
): INodeExecutionData[] {
	return items.map((item) => ({ json: item }));
}
