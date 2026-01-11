import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const domainDeleteFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to delete. Warning: This action cannot be undone.",
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
				displayName: "By Name",
				name: "name",
				type: "string",
				placeholder: "example.com",
			},
		],
		displayOptions: {
			show: {
				resource: ["domain"],
				operation: ["delete"],
			},
		},
	},
];

export async function domainDeleteExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainIdValue = this.getNodeParameter("domainId", index) as
		| string
		| { mode: string; value: string };

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
		ENDPOINTS.DOMAIN(accountId, domainId),
	);

	return [{ json: { success: true, domain: domainId } }];
}
