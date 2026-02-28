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

export const domainCreateFields: INodeProperties[] = [
	{
		displayName: "Domain Name",
		name: "domainName",
		type: "string",
		required: true,
		default: "",
		placeholder: "example.com",
		description: "The domain name to add to the account",
		displayOptions: {
			show: {
				resource: ["domain"],
				operation: ["create"],
			},
		},
	},
];

export async function domainCreateExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainName = this.getNodeParameter("domainName", index) as string;
	const accountId = await getAccountId(this);

	const body = {
		name: domainName,
	};

	const response = await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.DOMAINS(accountId),
		body,
	);

	return [{ json: response.data }];
}

export const domainDeleteFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to delete. Warning: This action cannot be undone.",
		modes: [
			{
				displayName: "From List",
				name: "list",
				type: "list",
				typeOptions: {
					searchListMethod: "getDomains",
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
				resource: ["domain"],
				operation: ["delete"],
			},
		},
	},
];

export async function domainDeleteExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);

	const accountId = await getAccountId(this);

	await dnsimpleApiRequest.call(
		this,
		"DELETE",
		ENDPOINTS.DOMAIN(accountId, domainId),
	);

	return [{ json: { success: true, domain: domainId } }];
}

export const domainGetFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to retrieve",
		modes: [
			{
				displayName: "From List",
				name: "list",
				type: "list",
				typeOptions: {
					searchListMethod: "getDomains",
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
				resource: ["domain"],
				operation: ["get"],
			},
		},
	},
];

export async function domainGetExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.DOMAIN(accountId, domainId),
	);

	return [{ json: response.data }];
}

export const domainListFields: INodeProperties[] = [
	...makeReturnAllFields("domain", "list"),
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

	return handlePaginatedList(this, index, ENDPOINTS.DOMAINS(accountId), {
		qs,
	});
}
