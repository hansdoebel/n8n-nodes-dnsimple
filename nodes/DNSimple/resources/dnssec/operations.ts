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

export const dnssecGetStatusFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to get DNSSEC status for",
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
				resource: ["dnssec"],
				operation: ["getStatus"],
			},
		},
	},
];

export async function dnssecGetStatusExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.DNSSEC(accountId, domainId),
	);

	return [{ json: response.data }];
}

export const dnssecEnableFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to enable DNSSEC for",
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
				resource: ["dnssec"],
				operation: ["enable"],
			},
		},
	},
];

export async function dnssecEnableExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.DNSSEC(accountId, domainId),
	);

	return [{ json: response.data }];
}

export const dnssecDisableFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to disable DNSSEC for",
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
				resource: ["dnssec"],
				operation: ["disable"],
			},
		},
	},
];

export async function dnssecDisableExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);

	const accountId = await getAccountId(this);

	await dnsimpleApiRequest.call(
		this,
		"DELETE",
		ENDPOINTS.DNSSEC(accountId, domainId),
	);

	return [{ json: { success: true } }];
}

export const dnssecListDsRecordsFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to list DS records for",
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
				resource: ["dnssec"],
				operation: ["listDsRecords"],
			},
		},
	},
	...makeReturnAllFields("dnssec", "listDsRecords"),
];

export async function dnssecListDsRecordsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);
	const accountId = await getAccountId(this);
	return handlePaginatedList(
		this,
		index,
		ENDPOINTS.DS_RECORDS(accountId, domainId),
	);
}

export const dnssecCreateDsRecordFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to create the DS record for",
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
				resource: ["dnssec"],
				operation: ["createDsRecord"],
			},
		},
	},
	{
		displayName: "Algorithm",
		name: "algorithm",
		type: "string",
		required: true,
		default: "",
		description: "DNSSEC algorithm as defined in RFC 4034",
		displayOptions: {
			show: {
				resource: ["dnssec"],
				operation: ["createDsRecord"],
			},
		},
	},
	{
		displayName: "Digest",
		name: "digest",
		type: "string",
		required: true,
		default: "",
		description: "DS record digest",
		displayOptions: {
			show: {
				resource: ["dnssec"],
				operation: ["createDsRecord"],
			},
		},
	},
	{
		displayName: "Digest Type",
		name: "digestType",
		type: "string",
		required: true,
		default: "",
		description: "Digest type as defined in RFC 4034",
		displayOptions: {
			show: {
				resource: ["dnssec"],
				operation: ["createDsRecord"],
			},
		},
	},
	{
		displayName: "Keytag",
		name: "keytag",
		type: "string",
		required: true,
		default: "",
		description: "Key tag for the DS record",
		displayOptions: {
			show: {
				resource: ["dnssec"],
				operation: ["createDsRecord"],
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
				resource: ["dnssec"],
				operation: ["createDsRecord"],
			},
		},
		options: [
			{
				displayName: "Public Key",
				name: "publicKey",
				type: "string",
				default: "",
				description: "Public key for the DS record",
			},
		],
	},
];

export async function dnssecCreateDsRecordExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);
	const algorithm = this.getNodeParameter("algorithm", index) as string;
	const digest = this.getNodeParameter("digest", index) as string;
	const digestType = this.getNodeParameter("digestType", index) as string;
	const keytag = this.getNodeParameter("keytag", index) as string;
	const additionalFields = this.getNodeParameter(
		"additionalFields",
		index,
		{},
	) as {
		publicKey?: string;
	};

	const accountId = await getAccountId(this);

	const body: IDataObject = {
		algorithm,
		digest,
		digest_type: digestType,
		keytag,
	};

	if (additionalFields.publicKey) {
		body.public_key = additionalFields.publicKey;
	}

	const response = await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.DS_RECORDS(accountId, domainId),
		body,
	);

	return [{ json: response.data }];
}

export const dnssecGetDsRecordFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain the DS record belongs to",
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
				resource: ["dnssec"],
				operation: ["getDsRecord"],
			},
		},
	},
	{
		displayName: "DS Record ID",
		name: "dsRecordId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the DS record to retrieve",
		displayOptions: {
			show: {
				resource: ["dnssec"],
				operation: ["getDsRecord"],
			},
		},
	},
];

export async function dnssecGetDsRecordExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);
	const dsRecordId = this.getNodeParameter("dsRecordId", index) as number;

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.DS_RECORD(accountId, domainId, dsRecordId.toString()),
	);

	return [{ json: response.data }];
}

export const dnssecDeleteDsRecordFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain the DS record belongs to",
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
				resource: ["dnssec"],
				operation: ["deleteDsRecord"],
			},
		},
	},
	{
		displayName: "DS Record ID",
		name: "dsRecordId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the DS record to delete",
		displayOptions: {
			show: {
				resource: ["dnssec"],
				operation: ["deleteDsRecord"],
			},
		},
	},
];

export async function dnssecDeleteDsRecordExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);
	const dsRecordId = this.getNodeParameter("dsRecordId", index) as number;

	const accountId = await getAccountId(this);

	await dnsimpleApiRequest.call(
		this,
		"DELETE",
		ENDPOINTS.DS_RECORD(accountId, domainId, dsRecordId.toString()),
	);

	return [{ json: { success: true } }];
}
