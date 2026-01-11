import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const emailForwardCreateFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to create the email forward for",
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
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Alias Name",
		name: "aliasName",
		type: "string",
		required: true,
		default: "",
		placeholder: "info",
		description:
			'The receiving email alias (name part only, without domain). E.g., "info" for info@example.com.',
		displayOptions: {
			show: {
				resource: ["emailForward"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Destination Email",
		name: "destinationEmail",
		type: "string",
		required: true,
		default: "",
		placeholder: "name@email.com",
		description: "The email address to forward messages to",
		displayOptions: {
			show: {
				resource: ["emailForward"],
				operation: ["create"],
			},
		},
	},
];

export async function emailForwardCreateExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainIdValue = this.getNodeParameter("domainId", index) as
		| string
		| { mode: string; value: string };
	const aliasName = this.getNodeParameter("aliasName", index) as string;
	const destinationEmail = this.getNodeParameter(
		"destinationEmail",
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
		alias_name: aliasName,
		destination_email: destinationEmail,
	};

	const response = await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.EMAIL_FORWARDS(accountId, domainId),
		body,
	);

	return [{ json: response.data }];
}
