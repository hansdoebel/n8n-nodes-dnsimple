import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const contactGetFields: INodeProperties[] = [
	{
		displayName: "Contact",
		name: "contactId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The contact to retrieve",
		modes: [
			{
				displayName: "From List",
				name: "list",
				type: "list",
				typeOptions: {
					searchListMethod: "getContacts",
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: "By ID",
				name: "id",
				type: "string",
				placeholder: "1234",
			},
		],
		displayOptions: {
			show: {
				resource: ["contact"],
				operation: ["get"],
			},
		},
	},
];

export async function contactGetExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const contactIdValue = this.getNodeParameter("contactId", index) as
		| string
		| { mode: string; value: string };

	let contactId: string;
	if (typeof contactIdValue === "object" && contactIdValue !== null) {
		contactId = contactIdValue.value;
	} else {
		contactId = contactIdValue;
	}

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.CONTACT(accountId, contactId),
	);

	return [{ json: response.data }];
}
