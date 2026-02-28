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

export const certificateDownloadFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain the certificate belongs to",
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
				resource: ["certificate"],
				operation: ["download"],
			},
		},
	},
	{
		displayName: "Certificate ID",
		name: "certificateId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the certificate to download",
		displayOptions: {
			show: {
				resource: ["certificate"],
				operation: ["download"],
			},
		},
	},
];

export async function certificateDownloadExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);
	const certificateId = this.getNodeParameter("certificateId", index) as number;

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.CERTIFICATE_DOWNLOAD(
			accountId,
			domainId,
			certificateId.toString(),
		),
	);

	return [{ json: response.data }];
}

export const certificateGetFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain the certificate belongs to",
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
				resource: ["certificate"],
				operation: ["get"],
			},
		},
	},
	{
		displayName: "Certificate ID",
		name: "certificateId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the certificate to retrieve",
		displayOptions: {
			show: {
				resource: ["certificate"],
				operation: ["get"],
			},
		},
	},
];

export async function certificateGetExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);
	const certificateId = this.getNodeParameter("certificateId", index) as number;

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.CERTIFICATE(accountId, domainId, certificateId.toString()),
	);

	return [{ json: response.data }];
}

export const certificateGetPrivateKeyFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain the certificate belongs to",
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
				resource: ["certificate"],
				operation: ["getPrivateKey"],
			},
		},
	},
	{
		displayName: "Certificate ID",
		name: "certificateId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the certificate",
		displayOptions: {
			show: {
				resource: ["certificate"],
				operation: ["getPrivateKey"],
			},
		},
	},
];

export async function certificateGetPrivateKeyExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);
	const certificateId = this.getNodeParameter("certificateId", index) as number;

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.CERTIFICATE_PRIVATE_KEY(
			accountId,
			domainId,
			certificateId.toString(),
		),
	);

	return [{ json: response.data }];
}

export const certificateIssueFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain the certificate belongs to",
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
				resource: ["certificate"],
				operation: ["issue"],
			},
		},
	},
	{
		displayName: "Certificate ID",
		name: "certificateId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the certificate to issue",
		displayOptions: {
			show: {
				resource: ["certificate"],
				operation: ["issue"],
			},
		},
	},
];

export async function certificateIssueExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);
	const certificateId = this.getNodeParameter("certificateId", index) as number;

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.CERTIFICATE_ISSUE(accountId, domainId, certificateId.toString()),
	);

	return [{ json: response.data }];
}

export const certificateListFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to list certificates for",
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
				resource: ["certificate"],
				operation: ["list"],
			},
		},
	},
	...makeReturnAllFields("certificate", "list"),
	{
		displayName: "Options",
		name: "options",
		type: "collection",
		placeholder: "Add Option",
		default: {},
		displayOptions: {
			show: {
				resource: ["certificate"],
				operation: ["list"],
			},
		},
		options: [
			{
				displayName: "Sort",
				name: "sort",
				type: "options",
				options: [
					{ name: "Common Name (Ascending)", value: "common_name:asc" },
					{ name: "Common Name (Descending)", value: "common_name:desc" },
					{ name: "Expiration (Ascending)", value: "expiration:asc" },
					{ name: "Expiration (Descending)", value: "expiration:desc" },
					{ name: "ID (Ascending)", value: "id:asc" },
					{ name: "ID (Descending)", value: "id:desc" },
				],
				default: "id:desc",
				description: "Sort order for the results",
			},
		],
	},
];

export async function certificateListExecute(
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
		ENDPOINTS.CERTIFICATES(accountId, domainId),
		{ qs },
	);
}

export const certificateOrderFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to order a certificate for",
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
				resource: ["certificate"],
				operation: ["order"],
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
				resource: ["certificate"],
				operation: ["order"],
			},
		},
		options: [
			{
				displayName: "Alternate Names",
				name: "alternateNames",
				type: "string",
				default: "",
				placeholder: "www.example.com,api.example.com",
				description: "Comma-separated list of alternate names (SAN)",
			},
			{
				displayName: "Auto Renew",
				name: "autoRenew",
				type: "boolean",
				default: false,
				description: "Whether to enable auto-renewal",
			},
			{
				displayName: "Name",
				name: "name",
				type: "string",
				default: "",
				placeholder: "www",
				description: "The subdomain name (default: www)",
			},
			{
				displayName: "Signature Algorithm",
				name: "signatureAlgorithm",
				type: "options",
				options: [
					{ name: "ECDSA", value: "ECDSA" },
					{ name: "RSA", value: "RSA" },
				],
				default: "ECDSA",
				description: "The signature algorithm for the certificate",
			},
		],
	},
];

export async function certificateOrderExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);
	const additionalFields = this.getNodeParameter(
		"additionalFields",
		index,
		{},
	) as {
		alternateNames?: string;
		autoRenew?: boolean;
		name?: string;
		signatureAlgorithm?: string;
	};

	const accountId = await getAccountId(this);

	const body: IDataObject = {};

	if (additionalFields.name) {
		body.name = additionalFields.name;
	}
	if (additionalFields.autoRenew !== undefined) {
		body.auto_renew = additionalFields.autoRenew;
	}
	if (additionalFields.signatureAlgorithm) {
		body.signature_algorithm = additionalFields.signatureAlgorithm;
	}
	if (additionalFields.alternateNames) {
		body.alternate_names = additionalFields.alternateNames
			.split(",")
			.map((n) => n.trim());
	}

	const response = await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.CERTIFICATES_LETSENCRYPT(accountId, domainId),
		body,
	);

	return [{ json: response.data }];
}

export const certificateRenewFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain the certificate belongs to",
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
				resource: ["certificate"],
				operation: ["renew"],
			},
		},
	},
	{
		displayName: "Certificate ID",
		name: "certificateId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the certificate to renew",
		displayOptions: {
			show: {
				resource: ["certificate"],
				operation: ["renew"],
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
				resource: ["certificate"],
				operation: ["renew"],
			},
		},
		options: [
			{
				displayName: "Auto Renew",
				name: "autoRenew",
				type: "boolean",
				default: false,
				description: "Whether to enable auto-renewal for the new certificate",
			},
			{
				displayName: "Signature Algorithm",
				name: "signatureAlgorithm",
				type: "options",
				options: [
					{ name: "ECDSA", value: "ECDSA" },
					{ name: "RSA", value: "RSA" },
				],
				default: "ECDSA",
				description: "The signature algorithm for the renewed certificate",
			},
		],
	},
];

export async function certificateRenewExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);
	const certificateId = this.getNodeParameter("certificateId", index) as number;
	const additionalFields = this.getNodeParameter(
		"additionalFields",
		index,
		{},
	) as {
		autoRenew?: boolean;
		signatureAlgorithm?: string;
	};

	const accountId = await getAccountId(this);

	const body: IDataObject = {};

	if (additionalFields.autoRenew !== undefined) {
		body.auto_renew = additionalFields.autoRenew;
	}
	if (additionalFields.signatureAlgorithm) {
		body.signature_algorithm = additionalFields.signatureAlgorithm;
	}

	const response = await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.CERTIFICATE_RENEWALS(
			accountId,
			domainId,
			certificateId.toString(),
		),
		body,
	);

	return [{ json: response.data }];
}
