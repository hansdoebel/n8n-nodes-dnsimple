import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const tldGetFields: INodeProperties[] = [
	{
		displayName: "TLD",
		name: "tld",
		type: "string",
		required: true,
		default: "",
		placeholder: "com",
		description: "The TLD to retrieve (e.g., com, net, org)",
		displayOptions: {
			show: {
				resource: ["tld"],
				operation: ["get"],
			},
		},
	},
];

export async function tldGetExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const tld = this.getNodeParameter("tld", index) as string;

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.TLD(tld),
	);

	return [{ json: response.data }];
}
