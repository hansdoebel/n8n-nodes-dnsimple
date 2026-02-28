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

export const emailForwardCreateFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to create the email forward for",
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
				resource: ["emailForward"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Alias Name",
		name: "aliasName",
		type: "string",
		required: true,
		default: "",
		placeholder: "info",
		description:
			'The receiving email alias (name part only, without domain). E.g., "info" for info@example.com.',
		displayOptions: {
			show: {
				resource: ["emailForward"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Destination Email",
		name: "destinationEmail",
		type: "string",
		required: true,
		default: "",
		placeholder: "name@email.com",
		description: "The email address to forward messages to",
		displayOptions: {
			show: {
				resource: ["emailForward"],
				operation: ["create"],
			},
		},
	},
];

export async function emailForwardCreateExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);
	const aliasName = this.getNodeParameter("aliasName", index) as string;
	const destinationEmail = this.getNodeParameter(
		"destinationEmail",
		index,
	) as string;

	const accountId = await getAccountId(this);

	const body: IDataObject = {
		alias_name: aliasName,
		destination_email: destinationEmail,
	};

	const response = await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.EMAIL_FORWARDS(accountId, domainId),
		body,
	);

	return [{ json: response.data }];
}

export const emailForwardDeleteFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain the email forward belongs to",
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
				resource: ["emailForward"],
				operation: ["delete"],
			},
		},
	},
	{
		displayName: "Email Forward ID",
		name: "emailForwardId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the email forward to delete",
		displayOptions: {
			show: {
				resource: ["emailForward"],
				operation: ["delete"],
			},
		},
	},
];

export async function emailForwardDeleteExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);
	const emailForwardId = this.getNodeParameter(
		"emailForwardId",
		index,
	) as number;

	const accountId = await getAccountId(this);

	await dnsimpleApiRequest.call(
		this,
		"DELETE",
		ENDPOINTS.EMAIL_FORWARD(accountId, domainId, emailForwardId.toString()),
	);

	return [{ json: { success: true } }];
}

export const emailForwardGetFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain the email forward belongs to",
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
				resource: ["emailForward"],
				operation: ["get"],
			},
		},
	},
	{
		displayName: "Email Forward ID",
		name: "emailForwardId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the email forward to retrieve",
		displayOptions: {
			show: {
				resource: ["emailForward"],
				operation: ["get"],
			},
		},
	},
];

export async function emailForwardGetExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);
	const emailForwardId = this.getNodeParameter(
		"emailForwardId",
		index,
	) as number;

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.EMAIL_FORWARD(accountId, domainId, emailForwardId.toString()),
	);

	return [{ json: response.data }];
}

export const emailForwardListFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to list email forwards for",
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
				resource: ["emailForward"],
				operation: ["list"],
			},
		},
	},
	...makeReturnAllFields("emailForward", "list"),
	{
		displayName: "Options",
		name: "options",
		type: "collection",
		placeholder: "Add Option",
		default: {},
		displayOptions: {
			show: {
				resource: ["emailForward"],
				operation: ["list"],
			},
		},
		options: [
			{
				displayName: "Sort",
				name: "sort",
				type: "options",
				options: [
					{ name: "From (Ascending)", value: "from:asc" },
					{ name: "From (Descending)", value: "from:desc" },
					{ name: "ID (Ascending)", value: "id:asc" },
					{ name: "ID (Descending)", value: "id:desc" },
					{ name: "To (Ascending)", value: "to:asc" },
					{ name: "To (Descending)", value: "to:desc" },
				],
				default: "id:asc",
				description: "Sort order for the results",
			},
		],
	},
];

export async function emailForwardListExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);
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
		ENDPOINTS.EMAIL_FORWARDS(accountId, domainId),
		{ qs },
	);
}
