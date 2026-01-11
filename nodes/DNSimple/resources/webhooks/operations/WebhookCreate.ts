import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const webhookCreateFields: INodeProperties[] = [
	{
		displayName: "URL",
		name: "url",
		type: "string",
		required: true,
		default: "",
		placeholder: "https://example.com/webhook",
		description: "The webhook URL (must be HTTPS)",
		displayOptions: {
			show: {
				resource: ["webhook"],
				operation: ["create"],
			},
		},
	},
];

export async function webhookCreateExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const url = this.getNodeParameter("url", index) as string;

	const accountId = await getAccountId(this);

	const body: IDataObject = {
		url,
	};

	const response = await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.WEBHOOKS(accountId),
		body,
	);

	return [{ json: response.data }];
}
