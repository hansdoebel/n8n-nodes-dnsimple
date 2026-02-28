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

export const zoneActivateFields: INodeProperties[] = [
	{
		displayName: "Zone Name",
		name: "zoneName",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The zone to activate DNS services for",
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
				resource: ["zone"],
				operation: ["activate"],
			},
		},
	},
];

export async function zoneActivateExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const zoneName = resolveResourceLocator(this, "zoneName", index);

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"PUT",
		ENDPOINTS.ZONE_ACTIVATION(accountId, zoneName),
	);

	return [{ json: response.data }];
}

export const zoneCheckDistributionFields: INodeProperties[] = [
	{
		displayName: "Zone Name",
		name: "zoneName",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The zone to check distribution for",
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
				resource: ["zone"],
				operation: ["checkDistribution"],
			},
		},
	},
];

export async function zoneCheckDistributionExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const zoneName = resolveResourceLocator(this, "zoneName", index);

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.ZONE_DISTRIBUTION(accountId, zoneName),
	);

	return [{ json: response.data }];
}

export const zoneDeactivateFields: INodeProperties[] = [
	{
		displayName: "Zone Name",
		name: "zoneName",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The zone to deactivate DNS services for",
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
				resource: ["zone"],
				operation: ["deactivate"],
			},
		},
	},
];

export async function zoneDeactivateExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const zoneName = resolveResourceLocator(this, "zoneName", index);

	const accountId = await getAccountId(this);

	await dnsimpleApiRequest.call(
		this,
		"DELETE",
		ENDPOINTS.ZONE_ACTIVATION(accountId, zoneName),
	);

	return [{ json: { success: true } }];
}

export const zoneDownloadFileFields: INodeProperties[] = [
	{
		displayName: "Zone Name",
		name: "zoneName",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The zone to download",
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
				resource: ["zone"],
				operation: ["downloadFile"],
			},
		},
	},
];

export async function zoneDownloadFileExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const zoneName = resolveResourceLocator(this, "zoneName", index);

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.ZONE_FILE(accountId, zoneName),
	);

	return [{ json: response.data }];
}

export const zoneGetFields: INodeProperties[] = [
	{
		displayName: "Zone Name",
		name: "zoneName",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The zone to retrieve",
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
				resource: ["zone"],
				operation: ["get"],
			},
		},
	},
];

export async function zoneGetExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const zoneName = resolveResourceLocator(this, "zoneName", index);

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.ZONE(accountId, zoneName),
	);

	return [{ json: response.data }];
}

export const zoneListFields: INodeProperties[] = [
	...makeReturnAllFields("zone", "list"),
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

	return handlePaginatedList(this, index, ENDPOINTS.ZONES(accountId), { qs });
}
