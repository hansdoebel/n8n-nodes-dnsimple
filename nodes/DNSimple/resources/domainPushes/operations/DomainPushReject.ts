import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const domainPushRejectFields: INodeProperties[] = [
	{
		displayName: "Push ID",
		name: "pushId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the push to reject",
		displayOptions: {
			show: {
				resource: ["domainPush"],
				operation: ["reject"],
			},
		},
	},
];

export async function domainPushRejectExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const pushId = this.getNodeParameter("pushId", index) as number;

	const accountId = await getAccountId(this);

	await dnsimpleApiRequest.call(
		this,
		"DELETE",
		ENDPOINTS.PUSH(accountId, pushId.toString()),
	);

	return [{ json: { success: true } }];
}
