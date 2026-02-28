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

export const templateApplyToDomainFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to apply the template to",
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
				resource: ["template"],
				operation: ["applyToDomain"],
			},
		},
	},
	{
		displayName: "Template",
		name: "templateId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The template to apply",
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
				resource: ["template"],
				operation: ["applyToDomain"],
			},
		},
	},
];

export async function templateApplyToDomainExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);
	const templateId = resolveResourceLocator(this, "templateId", index);


	const accountId = await getAccountId(this);

	await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.DOMAIN_TEMPLATE(accountId, domainId, templateId),
	);

	return [{ json: { success: true } }];
}

export const templateCreateFields: INodeProperties[] = [
	{
		displayName: "Name",
		name: "name",
		type: "string",
		required: true,
		default: "",
		description: "The name of the template",
		displayOptions: {
			show: {
				resource: ["template"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Short Name (SID)",
		name: "sid",
		type: "string",
		required: true,
		default: "",
		placeholder: "my-template",
		description: "A unique short name identifier for the template",
		displayOptions: {
			show: {
				resource: ["template"],
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
				resource: ["template"],
				operation: ["create"],
			},
		},
		options: [
			{
				displayName: "Description",
				name: "description",
				type: "string",
				default: "",
				description: "A description for the template",
			},
		],
	},
];

export async function templateCreateExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter("name", index) as string;
	const sid = this.getNodeParameter("sid", index) as string;
	const additionalFields = this.getNodeParameter(
		"additionalFields",
		index,
		{},
	) as {
		description?: string;
	};

	const accountId = await getAccountId(this);

	const body: IDataObject = {
		name,
		sid,
	};

	if (additionalFields.description) {
		body.description = additionalFields.description;
	}

	const response = await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.TEMPLATES(accountId),
		body,
	);

	return [{ json: response.data }];
}

export const templateDeleteFields: INodeProperties[] = [
	{
		displayName: "Template",
		name: "templateId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The template to delete",
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
				resource: ["template"],
				operation: ["delete"],
			},
		},
	},
];

export async function templateDeleteExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const templateId = resolveResourceLocator(this, "templateId", index);

	const accountId = await getAccountId(this);

	await dnsimpleApiRequest.call(
		this,
		"DELETE",
		ENDPOINTS.TEMPLATE(accountId, templateId),
	);

	return [{ json: { success: true } }];
}

export const templateGetFields: INodeProperties[] = [
	{
		displayName: "Template",
		name: "templateId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The template to retrieve",
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
				resource: ["template"],
				operation: ["get"],
			},
		},
	},
];

export async function templateGetExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const templateId = resolveResourceLocator(this, "templateId", index);

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.TEMPLATE(accountId, templateId),
	);

	return [{ json: response.data }];
}

export const templateListFields: INodeProperties[] = [
	...makeReturnAllFields("template", "list"),
	{
		displayName: "Options",
		name: "options",
		type: "collection",
		placeholder: "Add Option",
		default: {},
		displayOptions: {
			show: {
				resource: ["template"],
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
					{ name: "Name (Ascending)", value: "name:asc" },
					{ name: "Name (Descending)", value: "name:desc" },
					{ name: "SID (Ascending)", value: "sid:asc" },
					{ name: "SID (Descending)", value: "sid:desc" },
				],
				default: "id:asc",
				description: "Sort order for the results",
			},
		],
	},
];

export async function templateListExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const options = this.getNodeParameter("options", index, {}) as {
		sort?: string;
	};

	const accountId = await getAccountId(this);
	const qs: IDataObject = {};

	if (options.sort) {
		qs.sort = options.sort;
	}

	return handlePaginatedList(this, index, ENDPOINTS.TEMPLATES(accountId), {
		qs,
	});
}

export const templateUpdateFields: INodeProperties[] = [
	{
		displayName: "Template",
		name: "templateId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The template to update",
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
				resource: ["template"],
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
				resource: ["template"],
				operation: ["update"],
			},
		},
		options: [
			{
				displayName: "Description",
				name: "description",
				type: "string",
				default: "",
				description: "A description for the template",
			},
			{
				displayName: "Name",
				name: "name",
				type: "string",
				default: "",
				description: "The name of the template",
			},
			{
				displayName: "Short Name (SID)",
				name: "sid",
				type: "string",
				default: "",
				description: "A unique short name identifier for the template",
			},
		],
	},
];

export async function templateUpdateExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const templateId = resolveResourceLocator(this, "templateId", index);
	const updateFields = this.getNodeParameter("updateFields", index, {}) as {
		description?: string;
		name?: string;
		sid?: string;
	};

	const accountId = await getAccountId(this);

	const body: IDataObject = {};

	if (updateFields.name !== undefined) {
		body.name = updateFields.name;
	}
	if (updateFields.sid !== undefined) {
		body.sid = updateFields.sid;
	}
	if (updateFields.description !== undefined) {
		body.description = updateFields.description;
	}

	const response = await dnsimpleApiRequest.call(
		this,
		"PATCH",
		ENDPOINTS.TEMPLATE(accountId, templateId),
		body,
	);

	return [{ json: response.data }];
}
