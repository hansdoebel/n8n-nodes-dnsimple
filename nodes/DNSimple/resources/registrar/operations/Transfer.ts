import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const transferFields: INodeProperties[] = [
	{
		displayName: "Domain Name",
		name: "domainName",
		type: "string",
		required: true,
		default: "",
		placeholder: "example.com",
		description: "The domain name to transfer",
		displayOptions: {
			show: {
				resource: ["registrar"],
				operation: ["transfer"],
			},
		},
	},
	{
		displayName: "Registrant Contact",
		name: "registrantId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The contact to use as registrant for the domain",
		modes: [
			{
				displayName: "From List",
				name: "list",
				type: "list",
				typeOptions: {
					searchListMethod: "getContacts",
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: "By ID",
				name: "id",
				type: "string",
				placeholder: "1234",
			},
		],
		displayOptions: {
			show: {
				resource: ["registrar"],
				operation: ["transfer"],
			},
		},
	},
	{
		displayName: "Authorization Code",
		name: "authCode",
		type: "string",
		typeOptions: {
			password: true,
		},
		default: "",
		description: "The authorization code from the current registrar (EPP code)",
		displayOptions: {
			show: {
				resource: ["registrar"],
				operation: ["transfer"],
			},
		},
	},
	{
		displayName: "Options",
		name: "options",
		type: "collection",
		placeholder: "Add Option",
		default: {},
		displayOptions: {
			show: {
				resource: ["registrar"],
				operation: ["transfer"],
			},
		},
		options: [
			{
				displayName: "Auto Renew",
				name: "autoRenew",
				type: "boolean",
				default: true,
				description: "Whether to enable auto-renewal for the domain",
			},
			{
				displayName: "Extended Attributes",
				name: "extendedAttributes",
				type: "json",
				default: "{}",
				description: "Extended attributes required by some TLDs",
			},
			{
				displayName: "Premium Price",
				name: "premiumPrice",
				type: "string",
				default: "",
				description:
					"Required for premium domains. The expected price for the transfer.",
			},
			{
				displayName: "Privacy",
				name: "whoisPrivacy",
				type: "boolean",
				default: false,
				description: "Whether to enable WHOIS privacy for the domain",
			},
		],
	},
];

export async function transferExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainName = this.getNodeParameter("domainName", index) as string;
	const registrantIdValue = this.getNodeParameter("registrantId", index) as
		| string
		| { mode: string; value: string };
	const authCode = this.getNodeParameter("authCode", index, "") as string;
	const options = this.getNodeParameter("options", index, {}) as {
		autoRenew?: boolean;
		extendedAttributes?: string;
		premiumPrice?: string;
		whoisPrivacy?: boolean;
	};

	let registrantId: string;
	if (typeof registrantIdValue === "object" && registrantIdValue !== null) {
		registrantId = registrantIdValue.value;
	} else {
		registrantId = registrantIdValue;
	}

	const accountId = await getAccountId(this);

	const body: IDataObject = {
		registrant_id: parseInt(registrantId, 10),
	};

	if (authCode) {
		body.auth_code = authCode;
	}
	if (options.autoRenew !== undefined) {
		body.auto_renew = options.autoRenew;
	}
	if (options.premiumPrice) {
		body.premium_price = options.premiumPrice;
	}
	if (options.whoisPrivacy !== undefined) {
		body.whois_privacy = options.whoisPrivacy;
	}
	if (options.extendedAttributes) {
		try {
			body.extended_attributes = JSON.parse(options.extendedAttributes);
		} catch {
			throw new Error("Extended Attributes must be valid JSON");
		}
	}

	const response = await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.REGISTRAR_TRANSFER(accountId, domainName),
		body,
	);

	return [{ json: response.data }];
}
