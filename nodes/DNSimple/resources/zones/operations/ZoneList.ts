import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const zoneListFields: INodeProperties[] = [
	{
		displayName: "Return All",
		name: "returnAll",
		type: "boolean",
		default: false,
		description: "Whether to return all results or only up to a given limit",
		displayOptions: {
			show: {
				resource: ["zone"],
				operation: ["list"],
			},
		},
	},
	{
		displayName: "Limit",
		name: "limit",
		type: "number",
		default: 50,
		typeOptions: {
			minValue: 1,
		},
		description: "Max number of results to return",
		displayOptions: {
			show: {
				resource: ["zone"],
				operation: ["list"],
				returnAll: [false],
			},
		},
	},
	{
		displayName: "Filters",
		name: "filters",
		type: "collection",
		placeholder: "Add Filter",
		default: {},
		displayOptions: {
			show: {
				resource: ["zone"],
				operation: ["list"],
			},
		},
		options: [
			{
				displayName: "Name Like",
				name: "nameLike",
				type: "string",
				default: "",
				description: "Filter zones containing this string",
			},
			{
				displayName: "Sort",
				name: "sort",
				type: "options",
				options: [
					{ name: "ID (Ascending)", value: "id:asc" },
					{ name: "ID (Descending)", value: "id:desc" },
					{ name: "Name (Ascending)", value: "name:asc" },
					{ name: "Name (Descending)", value: "name:desc" },
				],
				default: "name:asc",
				description: "Sort order for the results",
			},
		],
	},
];

export async function zoneListExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter("returnAll", index) as boolean;
	const filters = this.getNodeParameter("filters", index, {}) as {
		nameLike?: string;
		sort?: string;
	};

	const accountId = await getAccountId(this);
	const qs: IDataObject = {};

	if (filters.nameLike) {
		qs.name_like = filters.nameLike;
	}
	if (filters.sort) {
		qs.sort = filters.sort;
	}

	if (returnAll) {
		const zones: IDataObject[] = [];
		let page = 1;
		let hasMore = true;

		while (hasMore) {
			qs.page = page;
			qs.per_page = 100;
			const response = await dnsimpleApiRequest.call(
				this,
				"GET",
				ENDPOINTS.ZONES(accountId),
				{},
				qs,
			);
			zones.push(...(response.data as IDataObject[]));
			hasMore = response.pagination.total_pages > page;
			page++;
		}

		return zones.map((zone) => ({ json: zone }));
	}

	const limit = this.getNodeParameter("limit", index) as number;
	qs.per_page = limit;

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.ZONES(accountId),
		{},
		qs,
	);

	return (response.data as IDataObject[]).map((zone) => ({ json: zone }));
}
