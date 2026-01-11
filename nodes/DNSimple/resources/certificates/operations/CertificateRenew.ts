import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

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
	const domainIdValue = this.getNodeParameter("domainId", index) as
		| string
		| { mode: string; value: string };
	const certificateId = this.getNodeParameter("certificateId", index) as number;
	const additionalFields = this.getNodeParameter(
		"additionalFields",
		index,
		{},
	) as {
		autoRenew?: boolean;
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
