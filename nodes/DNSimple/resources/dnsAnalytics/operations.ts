import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { getAccountId } from "../../methods/apiRequest";
import { ENDPOINTS } from "../../helpers/constants";
import { makeReturnAllFields } from "../../helpers/fieldFactories";
import { handlePaginatedList } from "../../helpers/paginationUtils";

export const dnsAnalyticsQueryFields: INodeProperties[] = [
	...makeReturnAllFields("dnsAnalytics", "query"),
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

	return handlePaginatedList(
		this,
		index,
		ENDPOINTS.DNS_ANALYTICS(accountId),
		{ qs, dataPath: "data.rows", perPage: 10000 },
	);
}
