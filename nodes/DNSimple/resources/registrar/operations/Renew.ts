import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const renewFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to renew",
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
				displayName: "By Name",
				name: "name",
				type: "string",
				placeholder: "example.com",
			},
		],
		displayOptions: {
			show: {
				resource: ["registrar"],
				operation: ["renew"],
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
				operation: ["renew"],
			},
		},
		options: [
			{
				displayName: "Period",
				name: "period",
				type: "number",
				default: 1,
				description: "The number of years to renew the domain for",
			},
			{
				displayName: "Premium Price",
				name: "premiumPrice",
				type: "string",
				default: "",
				description:
					"Required for premium domains. The expected price for the renewal.",
			},
		],
	},
];

export async function renewExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainIdValue = this.getNodeParameter("domainId", index) as
		| string
		| { mode: string; value: string };
	const options = this.getNodeParameter("options", index, {}) as {
		period?: number;
		premiumPrice?: string;
	};

	let domainId: string;
	if (typeof domainIdValue === "object" && domainIdValue !== null) {
		domainId = domainIdValue.value;
	} else {
		domainId = domainIdValue;
	}

	const accountId = await getAccountId(this);

	const body: IDataObject = {};

	if (options.period) {
		body.period = options.period;
	}
	if (options.premiumPrice) {
		body.premium_price = options.premiumPrice;
	}

	const response = await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.REGISTRAR_RENEW(accountId, domainId),
		body,
	);

	return [{ json: response.data }];
}
