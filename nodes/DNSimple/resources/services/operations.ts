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

export const serviceApplyFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to apply the service to",
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
				displayName: "By Name or ID",
				name: "id",
				type: "string",
				placeholder: "example.com or 1234",
			},
		],
		displayOptions: {
			show: {
				resource: ["service"],
				operation: ["apply"],
			},
		},
	},
	{
		displayName: "Service",
		name: "serviceId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The service to apply",
		modes: [
			{
				displayName: "From List",
				name: "list",
				type: "list",
				typeOptions: {
					searchListMethod: "getServices",
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: "By ID or SID",
				name: "id",
				type: "string",
				placeholder: "1 or heroku",
			},
		],
		displayOptions: {
			show: {
				resource: ["service"],
				operation: ["apply"],
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
				resource: ["service"],
				operation: ["apply"],
			},
		},
		options: [
			{
				displayName: "Settings",
				name: "settings",
				type: "json",
				default: "{}",
				description:
					'Service-specific settings as JSON (e.g., {"app": "my-heroku-app"} for Heroku)',
			},
		],
	},
];

export async function serviceApplyExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);
	const serviceId = resolveResourceLocator(this, "serviceId", index);
	const additionalFields = this.getNodeParameter(
		"additionalFields",
		index,
		{},
	) as {
		settings?: string;
	};

	const accountId = await getAccountId(this);

	const body: IDataObject = {};

	if (additionalFields.settings) {
		try {
			body.settings = JSON.parse(additionalFields.settings);
		} catch {
			throw new Error("Settings must be valid JSON");
		}
	}

	await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.DOMAIN_SERVICE(accountId, domainId, serviceId),
		body,
	);

	return [{ json: { success: true } }];
}

export const serviceGetFields: INodeProperties[] = [
	{
		displayName: "Service",
		name: "serviceId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The service to retrieve",
		modes: [
			{
				displayName: "From List",
				name: "list",
				type: "list",
				typeOptions: {
					searchListMethod: "getServices",
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: "By ID or SID",
				name: "id",
				type: "string",
				placeholder: "1 or heroku",
			},
		],
		displayOptions: {
			show: {
				resource: ["service"],
				operation: ["get"],
			},
		},
	},
];

export async function serviceGetExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const serviceId = resolveResourceLocator(this, "serviceId", index);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.SERVICE(serviceId),
	);

	return [{ json: response.data }];
}

export const serviceListFields: INodeProperties[] = [
	...makeReturnAllFields("service", "list"),
	{
		displayName: "Options",
		name: "options",
		type: "collection",
		placeholder: "Add Option",
		default: {},
		displayOptions: {
			show: {
				resource: ["service"],
				operation: ["list"],
			},
		},
		options: [
			{
				displayName: "Sort",
				name: "sort",
				type: "options",
				options: [
					{ name: "ID (Ascending)", value: "id:asc" },
					{ name: "ID (Descending)", value: "id:desc" },
					{ name: "SID (Ascending)", value: "sid:asc" },
					{ name: "SID (Descending)", value: "sid:desc" },
				],
				default: "id:asc",
				description: "Sort order for the results",
			},
		],
	},
];

export async function serviceListExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const options = this.getNodeParameter("options", index, {}) as {
		sort?: string;
	};

	const qs: IDataObject = {};

	if (options.sort) {
		qs.sort = options.sort;
	}

	return handlePaginatedList(this, index, ENDPOINTS.SERVICES, { qs });
}

export const serviceListAppliedFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to list applied services for",
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
				displayName: "By Name or ID",
				name: "id",
				type: "string",
				placeholder: "example.com or 1234",
			},
		],
		displayOptions: {
			show: {
				resource: ["service"],
				operation: ["listApplied"],
			},
		},
	},
	...makeReturnAllFields("service", "listApplied"),
];

export async function serviceListAppliedExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);
	const accountId = await getAccountId(this);
	return handlePaginatedList(
		this,
		index,
		ENDPOINTS.DOMAIN_SERVICES(accountId, domainId),
	);
}

export const serviceUnapplyFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to remove the service from",
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
				displayName: "By Name or ID",
				name: "id",
				type: "string",
				placeholder: "example.com or 1234",
			},
		],
		displayOptions: {
			show: {
				resource: ["service"],
				operation: ["unapply"],
			},
		},
	},
	{
		displayName: "Service",
		name: "serviceId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The service to remove",
		modes: [
			{
				displayName: "From List",
				name: "list",
				type: "list",
				typeOptions: {
					searchListMethod: "getServices",
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: "By ID or SID",
				name: "id",
				type: "string",
				placeholder: "1 or heroku",
			},
		],
		displayOptions: {
			show: {
				resource: ["service"],
				operation: ["unapply"],
			},
		},
	},
];

export async function serviceUnapplyExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);
	const serviceId = resolveResourceLocator(this, "serviceId", index);

	const accountId = await getAccountId(this);

	await dnsimpleApiRequest.call(
		this,
		"DELETE",
		ENDPOINTS.DOMAIN_SERVICE(accountId, domainId, serviceId),
	);

	return [{ json: { success: true } }];
}
