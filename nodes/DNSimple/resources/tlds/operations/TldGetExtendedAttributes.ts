import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const tldGetExtendedAttributesFields: INodeProperties[] = [
	{
		displayName: "TLD",
		name: "tld",
		type: "string",
		required: true,
		default: "",
		placeholder: "us",
		description: "The TLD to get extended attributes for",
		displayOptions: {
			show: {
				resource: ["tld"],
				operation: ["getExtendedAttributes"],
			},
		},
	},
];

export async function tldGetExtendedAttributesExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const tld = this.getNodeParameter("tld", index) as string;

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.TLD_EXTENDED_ATTRIBUTES(tld),
	);

	return [{ json: { data: response.data } }];
}
