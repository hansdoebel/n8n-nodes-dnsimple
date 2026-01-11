import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const checkAvailabilityFields: INodeProperties[] = [
	{
		displayName: "Domain Name",
		name: "domainName",
		type: "string",
		required: true,
		default: "",
		placeholder: "example.com",
		description: "The domain name to check availability for",
		displayOptions: {
			show: {
				resource: ["registrar"],
				operation: ["checkAvailability"],
			},
		},
	},
];

export async function checkAvailabilityExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainName = this.getNodeParameter("domainName", index) as string;
	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.REGISTRAR_CHECK(accountId, domainName),
	);

	return [{ json: response.data }];
}
