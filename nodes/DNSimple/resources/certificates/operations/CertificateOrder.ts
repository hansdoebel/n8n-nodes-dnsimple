import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

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
	const domainIdValue = this.getNodeParameter("domainId", index) as
		| string
		| { mode: string; value: string };
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

	let domainId: string;
	if (typeof domainIdValue === "object" && domainIdValue !== null) {
		domainId = domainIdValue.value;
	} else {
		domainId = domainIdValue;
	}

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
