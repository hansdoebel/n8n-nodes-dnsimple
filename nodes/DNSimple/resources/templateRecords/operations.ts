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

export const templateRecordCreateFields: INodeProperties[] = [
	{
		displayName: "Template",
		name: "templateId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The template to create the record in",
		modes: [
			{
				displayName: "From List",
				name: "list",
				type: "list",
				typeOptions: {
					searchListMethod: "getTemplates",
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: "By ID or SID",
				name: "id",
				type: "string",
				placeholder: "1234 or my-template",
			},
		],
		displayOptions: {
			show: {
				resource: ["templateRecord"],
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
				resource: ["templateRecord"],
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
				resource: ["templateRecord"],
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
				resource: ["templateRecord"],
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
				resource: ["templateRecord"],
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
				displayName: "TTL",
				name: "ttl",
				type: "number",
				default: 3600,
				description: "Time to live in seconds",
			},
		],
	},
];

export async function templateRecordCreateExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const templateId = resolveResourceLocator(this, "templateId", index);
	const recordName = this.getNodeParameter("recordName", index) as string;
	const recordType = this.getNodeParameter("recordType", index) as string;
	const content = this.getNodeParameter("content", index) as string;
	const additionalFields = this.getNodeParameter(
		"additionalFields",
		index,
		{},
	) as {
		priority?: number;
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

	const response = await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.TEMPLATE_RECORDS(accountId, templateId),
		body,
	);

	return [{ json: response.data }];
}

export const templateRecordDeleteFields: INodeProperties[] = [
	{
		displayName: "Template",
		name: "templateId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The template containing the record",
		modes: [
			{
				displayName: "From List",
				name: "list",
				type: "list",
				typeOptions: {
					searchListMethod: "getTemplates",
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: "By ID or SID",
				name: "id",
				type: "string",
				placeholder: "1234 or my-template",
			},
		],
		displayOptions: {
			show: {
				resource: ["templateRecord"],
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
				resource: ["templateRecord"],
				operation: ["delete"],
			},
		},
	},
];

export async function templateRecordDeleteExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const templateId = resolveResourceLocator(this, "templateId", index);
	const recordId = this.getNodeParameter("recordId", index) as number;

	const accountId = await getAccountId(this);

	await dnsimpleApiRequest.call(
		this,
		"DELETE",
		ENDPOINTS.TEMPLATE_RECORD(accountId, templateId, recordId.toString()),
	);

	return [{ json: { success: true } }];
}

export const templateRecordGetFields: INodeProperties[] = [
	{
		displayName: "Template",
		name: "templateId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The template containing the record",
		modes: [
			{
				displayName: "From List",
				name: "list",
				type: "list",
				typeOptions: {
					searchListMethod: "getTemplates",
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: "By ID or SID",
				name: "id",
				type: "string",
				placeholder: "1234 or my-template",
			},
		],
		displayOptions: {
			show: {
				resource: ["templateRecord"],
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
				resource: ["templateRecord"],
				operation: ["get"],
			},
		},
	},
];

export async function templateRecordGetExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const templateId = resolveResourceLocator(this, "templateId", index);
	const recordId = this.getNodeParameter("recordId", index) as number;

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.TEMPLATE_RECORD(accountId, templateId, recordId.toString()),
	);

	return [{ json: response.data }];
}

export const templateRecordListFields: INodeProperties[] = [
	{
		displayName: "Template",
		name: "templateId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The template to list records for",
		modes: [
			{
				displayName: "From List",
				name: "list",
				type: "list",
				typeOptions: {
					searchListMethod: "getTemplates",
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: "By ID or SID",
				name: "id",
				type: "string",
				placeholder: "1234 or my-template",
			},
		],
		displayOptions: {
			show: {
				resource: ["templateRecord"],
				operation: ["list"],
			},
		},
	},
	...makeReturnAllFields("templateRecord", "list"),
	{
		displayName: "Options",
		name: "options",
		type: "collection",
		placeholder: "Add Option",
		default: {},
		displayOptions: {
			show: {
				resource: ["templateRecord"],
				operation: ["list"],
			},
		},
		options: [
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
		],
	},
];

export async function templateRecordListExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const templateId = resolveResourceLocator(this, "templateId", index);
	const options = this.getNodeParameter("options", index, {}) as {
		sort?: string;
	};

	const accountId = await getAccountId(this);
	const qs: IDataObject = {};

	if (options.sort) {
		qs.sort = options.sort;
	}

	return handlePaginatedList(
		this,
		index,
		ENDPOINTS.TEMPLATE_RECORDS(accountId, templateId),
		{ qs },
	);
}
