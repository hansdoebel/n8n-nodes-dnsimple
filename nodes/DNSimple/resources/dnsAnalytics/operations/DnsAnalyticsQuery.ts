import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const dnsAnalyticsQueryFields: INodeProperties[] = [
	{
		displayName: "Return All",
		name: "returnAll",
		type: "boolean",
		default: false,
		description: "Whether to return all results or only up to a given limit",
		displayOptions: {
			show: {
				resource: ["dnsAnalytics"],
				operation: ["query"],
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
				resource: ["dnsAnalytics"],
				operation: ["query"],
				returnAll: [false],
			},
		},
	},
	{
		displayName: "Options",
		name: "options",
		type: "collection",
		placeholder: "Add Option",
		default: {},
		displayOptions: {
			show: {
				resource: ["dnsAnalytics"],
				operation: ["query"],
			},
		},
		options: [
			{
				displayName: "End Date",
				name: "endDate",
				type: "dateTime",
				default: "",
				description: "End date for the analytics period (ISO 8601 format)",
			},
			{
				displayName: "Group By",
				name: "groupings",
				type: "multiOptions",
				options: [
					{ name: "Date", value: "date" },
					{ name: "Zone Name", value: "zone_name" },
				],
				default: [],
				description: "Group results by these dimensions",
			},
			{
				displayName: "Sort",
				name: "sort",
				type: "options",
				options: [
					{ name: "Date (Ascending)", value: "date:asc" },
					{ name: "Date (Descending)", value: "date:desc" },
					{ name: "Volume (Ascending)", value: "volume:asc" },
					{ name: "Volume (Descending)", value: "volume:desc" },
					{ name: "Zone Name (Ascending)", value: "zone_name:asc" },
					{ name: "Zone Name (Descending)", value: "zone_name:desc" },
				],
				default: "date:asc",
				description: "Sort order for the results",
			},
			{
				displayName: "Start Date",
				name: "startDate",
				type: "dateTime",
				default: "",
				description: "Start date for the analytics period (ISO 8601 format)",
			},
		],
	},
];

export async function dnsAnalyticsQueryExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter("returnAll", index) as boolean;
	const options = this.getNodeParameter("options", index, {}) as {
		endDate?: string;
		groupings?: string[];
		sort?: string;
		startDate?: string;
	};

	const accountId = await getAccountId(this);
	const qs: IDataObject = {};

	if (options.startDate) {
		qs.start_date = options.startDate;
	}
	if (options.endDate) {
		qs.end_date = options.endDate;
	}
	if (options.groupings && options.groupings.length > 0) {
		qs.groupings = options.groupings.join(",");
	}
	if (options.sort) {
		qs.sort = options.sort;
	}

	if (returnAll) {
		const analytics: IDataObject[] = [];
		let page = 1;
		let hasMore = true;

		while (hasMore) {
			qs.page = page;
			qs.per_page = 10000;
			const response = await dnsimpleApiRequest.call(
				this,
				"GET",
				ENDPOINTS.DNS_ANALYTICS(accountId),
				{},
				qs,
			);
			analytics.push(...(response.data.rows as IDataObject[]));
			hasMore = response.pagination.total_pages > page;
			page++;
		}

		return analytics.map((row) => ({ json: row }));
	}

	const limit = this.getNodeParameter("limit", index) as number;
	qs.per_page = limit;

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.DNS_ANALYTICS(accountId),
		{},
		qs,
	);

	return (response.data.rows as IDataObject[]).map((row) => ({ json: row }));
}
