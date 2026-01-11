import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const domainListFields: INodeProperties[] = [
	{
		displayName: "Return All",
		name: "returnAll",
		type: "boolean",
		default: false,
		description: "Whether to return all results or only up to a given limit",
		displayOptions: {
			show: {
				resource: ["domain"],
				operation: ["list"],
			},
		},
	},
	{
		displayName: "Limit",
		name: "limit",
		type: "number",
		default: 50,
		description: "Max number of results to return",
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ["domain"],
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
				resource: ["domain"],
				operation: ["list"],
			},
		},
		options: [
			{
				displayName: "Name Filter",
				name: "name_like",
				type: "string",
				default: "",
				description: "Only include domains containing this string",
			},
			{
				displayName: "Registrant ID",
				name: "registrant_id",
				type: "number",
				default: 0,
				description: "Only include domains with this registrant ID",
			},
		],
	},
];

export async function domainListExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter("returnAll", index) as boolean;
	const filters = this.getNodeParameter("filters", index, {}) as {
		name_like?: string;
		registrant_id?: number;
	};

	const accountId = await getAccountId(this);
	const qs: IDataObject = {};

	if (filters.name_like) {
		qs.name_like = filters.name_like;
	}
	if (filters.registrant_id) {
		qs.registrant_id = filters.registrant_id;
	}

	if (returnAll) {
		const allDomains: IDataObject[] = [];
		let page = 1;
		let hasMore = true;

		while (hasMore) {
			qs.page = page;
			qs.per_page = 100;
			const response = await dnsimpleApiRequest.call(
				this,
				"GET",
				ENDPOINTS.DOMAINS(accountId),
				{},
				qs,
			);
			const domains = response.data || [];
			allDomains.push(...domains);

			const pagination = response.pagination;
			hasMore = pagination && pagination.current_page < pagination.total_pages;
			page++;
		}

		return allDomains.map((domain) => ({ json: domain }));
	}

	const limit = this.getNodeParameter("limit", index) as number;
	qs.per_page = limit;

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.DOMAINS(accountId),
		{},
		qs,
	);

	const domains = response.data || [];
	return domains.map((domain: IDataObject) => ({ json: domain }));
}
