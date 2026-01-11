import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const domainPushInitiateFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to push to another account",
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
				resource: ["domainPush"],
				operation: ["initiate"],
			},
		},
	},
	{
		displayName: "New Account Identifier",
		name: "newAccountIdentifier",
		type: "string",
		required: true,
		default: "",
		description: "The email address or account ID of the target account",
		displayOptions: {
			show: {
				resource: ["domainPush"],
				operation: ["initiate"],
			},
		},
	},
];

export async function domainPushInitiateExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainIdValue = this.getNodeParameter("domainId", index) as
		| string
		| { mode: string; value: string };
	const newAccountIdentifier = this.getNodeParameter(
		"newAccountIdentifier",
		index,
	) as string;

	let domainId: string;
	if (typeof domainIdValue === "object" && domainIdValue !== null) {
		domainId = domainIdValue.value;
	} else {
		domainId = domainIdValue;
	}

	const accountId = await getAccountId(this);

	const body: IDataObject = {
		new_account_identifier: newAccountIdentifier,
	};

	const response = await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.DOMAIN_PUSHES(accountId, domainId),
		body,
	);

	return [{ json: response.data }];
}
