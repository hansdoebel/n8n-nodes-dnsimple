import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

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
	const domainIdValue = this.getNodeParameter("domainId", index) as
		| string
		| { mode: string; value: string };
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

	let domainId: string;
	if (typeof domainIdValue === "object" && domainIdValue !== null) {
		domainId = domainIdValue.value;
	} else {
		domainId = domainIdValue;
	}

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
