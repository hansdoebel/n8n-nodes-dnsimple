import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const getPricesFields: INodeProperties[] = [
	{
		displayName: "Domain Name",
		name: "domainName",
		type: "string",
		required: true,
		default: "",
		placeholder: "example.com",
		description: "The domain name to get prices for",
		displayOptions: {
			show: {
				resource: ["registrar"],
				operation: ["getPrices"],
			},
		},
	},
];

export async function getPricesExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainName = this.getNodeParameter("domainName", index) as string;
	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.REGISTRAR_PRICES(accountId, domainName),
	);

	return [{ json: response.data }];
}
