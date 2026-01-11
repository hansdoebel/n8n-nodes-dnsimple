import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const emailForwardDeleteFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain the email forward belongs to",
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
				displayName: "By Name or ID",
				name: "id",
				type: "string",
				placeholder: "example.com or 1234",
			},
		],
		displayOptions: {
			show: {
				resource: ["emailForward"],
				operation: ["delete"],
			},
		},
	},
	{
		displayName: "Email Forward ID",
		name: "emailForwardId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the email forward to delete",
		displayOptions: {
			show: {
				resource: ["emailForward"],
				operation: ["delete"],
			},
		},
	},
];

export async function emailForwardDeleteExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainIdValue = this.getNodeParameter("domainId", index) as
		| string
		| { mode: string; value: string };
	const emailForwardId = this.getNodeParameter(
		"emailForwardId",
		index,
	) as number;

	let domainId: string;
	if (typeof domainIdValue === "object" && domainIdValue !== null) {
		domainId = domainIdValue.value;
	} else {
		domainId = domainIdValue;
	}

	const accountId = await getAccountId(this);

	await dnsimpleApiRequest.call(
		this,
		"DELETE",
		ENDPOINTS.EMAIL_FORWARD(accountId, domainId, emailForwardId.toString()),
	);

	return [{ json: { success: true } }];
}
