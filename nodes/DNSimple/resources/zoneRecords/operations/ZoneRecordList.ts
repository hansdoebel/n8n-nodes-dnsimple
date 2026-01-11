import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const zoneRecordListFields: INodeProperties[] = [
	{
		displayName: "Zone Name",
		name: "zoneName",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The zone to list records for",
		modes: [
			{
				displayName: "From List",
				name: "list",
				type: "list",
				typeOptions: {
					searchListMethod: "getZones",
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: "By Name",
				name: "name",
				type: "string",
				placeholder: "example.com",
			},
		],
		displayOptions: {
			show: {
				resource: ["zoneRecord"],
				operation: ["list"],
			},
		},
	},
	{
		displayName: "Return All",
		name: "returnAll",
		type: "boolean",
		default: false,
		description: "Whether to return all results or only up to a given limit",
		displayOptions: {
			show: {
				resource: ["zoneRecord"],
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
				resource: ["zoneRecord"],
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
				resource: ["zoneRecord"],
				operation: ["list"],
			},
		},
		options: [
			{
				displayName: "Name",
				name: "name",
				type: "string",
				default: "",
				description: "Filter records with exact name match",
			},
			{
				displayName: "Name Like",
				name: "nameLike",
				type: "string",
				default: "",
				description: "Filter records containing this string in the name",
			},
			{
				displayName: "Sort",
				name: "sort",
				type: "options",
				options: [
					{ name: "Content (Ascending)", value: "content:asc" },
					{ name: "Content (Descending)", value: "content:desc" },
					{ name: "ID (Ascending)", value: "id:asc" },
					{ name: "ID (Descending)", value: "id:desc" },
					{ name: "Name (Ascending)", value: "name:asc" },
					{ name: "Name (Descending)", value: "name:desc" },
					{ name: "Type (Ascending)", value: "type:asc" },
					{ name: "Type (Descending)", value: "type:desc" },
				],
				default: "id:asc",
				description: "Sort order for the results",
			},
			{
				displayName: "Type",
				name: "type",
				type: "options",
				options: [
					{ name: "A", value: "A" },
					{ name: "AAAA", value: "AAAA" },
					{ name: "ALIAS", value: "ALIAS" },
					{ name: "CAA", value: "CAA" },
					{ name: "CNAME", value: "CNAME" },
					{ name: "DNSKEY", value: "DNSKEY" },
					{ name: "DS", value: "DS" },
					{ name: "HINFO", value: "HINFO" },
					{ name: "MX", value: "MX" },
					{ name: "NAPTR", value: "NAPTR" },
					{ name: "NS", value: "NS" },
					{ name: "POOL", value: "POOL" },
					{ name: "PTR", value: "PTR" },
					{ name: "SOA", value: "SOA" },
					{ name: "SPF", value: "SPF" },
					{ name: "SRV", value: "SRV" },
					{ name: "SSHFP", value: "SSHFP" },
					{ name: "TXT", value: "TXT" },
					{ name: "URL", value: "URL" },
				],
				default: "A",
				description: "Filter by record type",
			},
		],
	},
];

export async function zoneRecordListExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const zoneNameValue = this.getNodeParameter("zoneName", index) as
		| string
		| { mode: string; value: string };
	const returnAll = this.getNodeParameter("returnAll", index) as boolean;
	const filters = this.getNodeParameter("filters", index, {}) as {
		name?: string;
		nameLike?: string;
		sort?: string;
		type?: string;
	};

	let zoneName: string;
	if (typeof zoneNameValue === "object" && zoneNameValue !== null) {
		zoneName = zoneNameValue.value;
	} else {
		zoneName = zoneNameValue;
	}

	const accountId = await getAccountId(this);
	const qs: IDataObject = {};

	if (filters.name) {
		qs.name = filters.name;
	}
	if (filters.nameLike) {
		qs.name_like = filters.nameLike;
	}
	if (filters.sort) {
		qs.sort = filters.sort;
	}
	if (filters.type) {
		qs.type = filters.type;
	}

	if (returnAll) {
		const records: IDataObject[] = [];
		let page = 1;
		let hasMore = true;

		while (hasMore) {
			qs.page = page;
			qs.per_page = 100;
			const response = await dnsimpleApiRequest.call(
				this,
				"GET",
				ENDPOINTS.ZONE_RECORDS(accountId, zoneName),
				{},
				qs,
			);
			records.push(...(response.data as IDataObject[]));
			hasMore = response.pagination.total_pages > page;
			page++;
		}

		return records.map((record) => ({ json: record }));
	}

	const limit = this.getNodeParameter("limit", index) as number;
	qs.per_page = limit;

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.ZONE_RECORDS(accountId, zoneName),
		{},
		qs,
	);

	return (response.data as IDataObject[]).map((record) => ({ json: record }));
}
