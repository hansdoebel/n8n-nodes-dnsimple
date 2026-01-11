import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const webhookGetFields: INodeProperties[] = [
	{
		displayName: "Webhook ID",
		name: "webhookId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the webhook to retrieve",
		displayOptions: {
			show: {
				resource: ["webhook"],
				operation: ["get"],
			},
		},
	},
];

export async function webhookGetExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const webhookId = this.getNodeParameter("webhookId", index) as number;

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.WEBHOOK(accountId, webhookId.toString()),
	);

	return [{ json: response.data }];
}
