import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const domainCreateFields: INodeProperties[] = [
	{
		displayName: "Domain Name",
		name: "domainName",
		type: "string",
		required: true,
		default: "",
		placeholder: "example.com",
		description: "The domain name to add to the account",
		displayOptions: {
			show: {
				resource: ["domain"],
				operation: ["create"],
			},
		},
	},
];

export async function domainCreateExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainName = this.getNodeParameter("domainName", index) as string;
	const accountId = await getAccountId(this);

	const body = {
		name: domainName,
	};

	const response = await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.DOMAINS(accountId),
		body,
	);

	return [{ json: response.data }];
}
