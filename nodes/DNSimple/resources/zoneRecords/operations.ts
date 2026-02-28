import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "../../methods/apiRequest";
import { resolveResourceLocator } from "../../helpers/parameterUtils";
import { ENDPOINTS } from "../../helpers/constants";
import { makeReturnAllFields } from "../../helpers/fieldFactories";
import { handlePaginatedList } from "../../helpers/paginationUtils";

export const zoneRecordCheckDistributionFields: INodeProperties[] = [
	{
		displayName: "Zone Name",
		name: "zoneName",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The zone containing the record",
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
				operation: ["checkDistribution"],
			},
		},
	},
	{
		displayName: "Record ID",
		name: "recordId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the record to check distribution for",
		displayOptions: {
			show: {
				resource: ["zoneRecord"],
				operation: ["checkDistribution"],
			},
		},
	},
];

export async function zoneRecordCheckDistributionExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const zoneName = resolveResourceLocator(this, "zoneName", index);
	const recordId = this.getNodeParameter("recordId", index) as number;

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.ZONE_RECORD_DISTRIBUTION(
			accountId,
			zoneName,
			recordId.toString(),
		),
	);

	return [{ json: response.data }];
}

export const zoneRecordCreateFields: INodeProperties[] = [
	{
		displayName: "Zone Name",
		name: "zoneName",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The zone to create the record in",
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
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Record Name",
		name: "recordName",
		type: "string",
		required: true,
		default: "",
		placeholder: "www",
		description:
			"The record name without the domain. Use empty string for apex records.",
		displayOptions: {
			show: {
				resource: ["zoneRecord"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Record Type",
		name: "recordType",
		type: "options",
		required: true,
		options: [
			{ name: "A", value: "A" },
			{ name: "AAAA", value: "AAAA" },
			{ name: "ALIAS", value: "ALIAS" },
			{ name: "CAA", value: "CAA" },
			{ name: "CNAME", value: "CNAME" },
			{ name: "HINFO", value: "HINFO" },
			{ name: "MX", value: "MX" },
			{ name: "NAPTR", value: "NAPTR" },
			{ name: "NS", value: "NS" },
			{ name: "POOL", value: "POOL" },
			{ name: "PTR", value: "PTR" },
			{ name: "SPF", value: "SPF" },
			{ name: "SRV", value: "SRV" },
			{ name: "SSHFP", value: "SSHFP" },
			{ name: "TXT", value: "TXT" },
			{ name: "URL", value: "URL" },
		],
		default: "A",
		description: "The type of DNS record",
		displayOptions: {
			show: {
				resource: ["zoneRecord"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Content",
		name: "content",
		type: "string",
		required: true,
		default: "",
		placeholder: "192.0.2.1",
		description: "The content of the record (IP address, hostname, etc.)",
		displayOptions: {
			show: {
				resource: ["zoneRecord"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Additional Fields",
		name: "additionalFields",
		type: "collection",
		placeholder: "Add Field",
		default: {},
		displayOptions: {
			show: {
				resource: ["zoneRecord"],
				operation: ["create"],
			},
		},
		options: [
			{
				displayName: "Priority",
				name: "priority",
				type: "number",
				default: 10,
				description: "Priority for MX and SRV records",
			},
			{
				displayName: "Regions",
				name: "regions",
				type: "multiOptions",
				options: [
					{ name: "California (SV1)", value: "SV1" },
					{ name: "Chicago (ORD)", value: "ORD" },
					{ name: "Frankfurt (FRA)", value: "FRA" },
					{ name: "Global", value: "global" },
					{ name: "Hong Kong (HKG)", value: "HKG" },
					{ name: "Sydney (SYD)", value: "SYD" },
					{ name: "Tokyo (NRT)", value: "NRT" },
					{ name: "Virginia (IAD)", value: "IAD" },
				],
				default: [],
				description: "Geographic regions for the record (Enterprise only)",
			},
			{
				displayName: "TTL",
				name: "ttl",
				type: "number",
				default: 3600,
				description: "Time to live in seconds",
			},
		],
	},
];

export async function zoneRecordCreateExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const zoneName = resolveResourceLocator(this, "zoneName", index);
	const recordName = this.getNodeParameter("recordName", index) as string;
	const recordType = this.getNodeParameter("recordType", index) as string;
	const content = this.getNodeParameter("content", index) as string;
	const additionalFields = this.getNodeParameter(
		"additionalFields",
		index,
		{},
	) as {
		priority?: number;
		regions?: string[];
		ttl?: number;
	};

	const accountId = await getAccountId(this);

	const body: IDataObject = {
		name: recordName,
		type: recordType,
		content,
	};

	if (additionalFields.ttl !== undefined) {
		body.ttl = additionalFields.ttl;
	}
	if (additionalFields.priority !== undefined) {
		body.priority = additionalFields.priority;
	}
	if (additionalFields.regions && additionalFields.regions.length > 0) {
		body.regions = additionalFields.regions;
	}

	const response = await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.ZONE_RECORDS(accountId, zoneName),
		body,
	);

	return [{ json: response.data }];
}

export const zoneRecordDeleteFields: INodeProperties[] = [
	{
		displayName: "Zone Name",
		name: "zoneName",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The zone containing the record",
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
				operation: ["delete"],
			},
		},
	},
	{
		displayName: "Record ID",
		name: "recordId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the record to delete",
		displayOptions: {
			show: {
				resource: ["zoneRecord"],
				operation: ["delete"],
			},
		},
	},
];

export async function zoneRecordDeleteExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const zoneName = resolveResourceLocator(this, "zoneName", index);
	const recordId = this.getNodeParameter("recordId", index) as number;

	const accountId = await getAccountId(this);

	await dnsimpleApiRequest.call(
		this,
		"DELETE",
		ENDPOINTS.ZONE_RECORD(accountId, zoneName, recordId.toString()),
	);

	return [{ json: { success: true } }];
}

export const zoneRecordGetFields: INodeProperties[] = [
	{
		displayName: "Zone Name",
		name: "zoneName",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The zone containing the record",
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
				operation: ["get"],
			},
		},
	},
	{
		displayName: "Record ID",
		name: "recordId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the record to retrieve",
		displayOptions: {
			show: {
				resource: ["zoneRecord"],
				operation: ["get"],
			},
		},
	},
];

export async function zoneRecordGetExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const zoneName = resolveResourceLocator(this, "zoneName", index);
	const recordId = this.getNodeParameter("recordId", index) as number;

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.ZONE_RECORD(accountId, zoneName, recordId.toString()),
	);

	return [{ json: response.data }];
}

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
	...makeReturnAllFields("zoneRecord", "list"),
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
	const zoneName = resolveResourceLocator(this, "zoneName", index);
	const filters = this.getNodeParameter("filters", index, {}) as {
		name?: string;
		nameLike?: string;
		sort?: string;
		type?: string;
	};

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

	return handlePaginatedList(
		this,
		index,
		ENDPOINTS.ZONE_RECORDS(accountId, zoneName),
		{ qs },
	);
}

export const zoneRecordUpdateFields: INodeProperties[] = [
	{
		displayName: "Zone Name",
		name: "zoneName",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The zone containing the record",
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
				operation: ["update"],
			},
		},
	},
	{
		displayName: "Record ID",
		name: "recordId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the record to update",
		displayOptions: {
			show: {
				resource: ["zoneRecord"],
				operation: ["update"],
			},
		},
	},
	{
		displayName: "Update Fields",
		name: "updateFields",
		type: "collection",
		placeholder: "Add Field",
		default: {},
		displayOptions: {
			show: {
				resource: ["zoneRecord"],
				operation: ["update"],
			},
		},
		options: [
			{
				displayName: "Content",
				name: "content",
				type: "string",
				default: "",
				description: "The content of the record",
			},
			{
				displayName: "Name",
				name: "name",
				type: "string",
				default: "",
				description: "The record name without the domain",
			},
			{
				displayName: "Priority",
				name: "priority",
				type: "number",
				default: 10,
				description: "Priority for MX and SRV records",
			},
			{
				displayName: "Regions",
				name: "regions",
				type: "multiOptions",
				options: [
					{ name: "California (SV1)", value: "SV1" },
					{ name: "Chicago (ORD)", value: "ORD" },
					{ name: "Frankfurt (FRA)", value: "FRA" },
					{ name: "Global", value: "global" },
					{ name: "Hong Kong (HKG)", value: "HKG" },
					{ name: "Sydney (SYD)", value: "SYD" },
					{ name: "Tokyo (NRT)", value: "NRT" },
					{ name: "Virginia (IAD)", value: "IAD" },
				],
				default: [],
				description: "Geographic regions for the record (Enterprise only)",
			},
			{
				displayName: "TTL",
				name: "ttl",
				type: "number",
				default: 3600,
				description: "Time to live in seconds",
			},
		],
	},
];

export async function zoneRecordUpdateExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const zoneName = resolveResourceLocator(this, "zoneName", index);
	const recordId = this.getNodeParameter("recordId", index) as number;
	const updateFields = this.getNodeParameter("updateFields", index, {}) as {
		content?: string;
		name?: string;
		priority?: number;
		regions?: string[];
		ttl?: number;
	};

	const accountId = await getAccountId(this);

	const body: IDataObject = {};

	if (updateFields.name !== undefined) {
		body.name = updateFields.name;
	}
	if (updateFields.content !== undefined) {
		body.content = updateFields.content;
	}
	if (updateFields.ttl !== undefined) {
		body.ttl = updateFields.ttl;
	}
	if (updateFields.priority !== undefined) {
		body.priority = updateFields.priority;
	}
	if (updateFields.regions && updateFields.regions.length > 0) {
		body.regions = updateFields.regions;
	}

	const response = await dnsimpleApiRequest.call(
		this,
		"PATCH",
		ENDPOINTS.ZONE_RECORD(accountId, zoneName, recordId.toString()),
		body,
	);

	return [{ json: response.data }];
}
