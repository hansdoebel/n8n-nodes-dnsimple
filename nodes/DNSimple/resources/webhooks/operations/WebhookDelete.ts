import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const webhookDeleteFields: INodeProperties[] = [
	{
		displayName: "Webhook ID",
		name: "webhookId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the webhook to delete",
		displayOptions: {
			show: {
				resource: ["webhook"],
				operation: ["delete"],
			},
		},
	},
];

export async function webhookDeleteExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const webhookId = this.getNodeParameter("webhookId", index) as number;

	const accountId = await getAccountId(this);

	await dnsimpleApiRequest.call(
		this,
		"DELETE",
		ENDPOINTS.WEBHOOK(accountId, webhookId.toString()),
	);

	return [{ json: { success: true } }];
}
