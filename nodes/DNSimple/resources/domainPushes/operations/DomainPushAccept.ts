import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const domainPushAcceptFields: INodeProperties[] = [
	{
		displayName: "Push ID",
		name: "pushId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the push to accept",
		displayOptions: {
			show: {
				resource: ["domainPush"],
				operation: ["accept"],
			},
		},
	},
	{
		displayName: "Contact",
		name: "contactId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The contact to use as the domain registrant",
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
				resource: ["domainPush"],
				operation: ["accept"],
			},
		},
	},
];

export async function domainPushAcceptExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const pushId = this.getNodeParameter("pushId", index) as number;
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

	const body: IDataObject = {
		contact_id: parseInt(contactId, 10),
	};

	await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.PUSH(accountId, pushId.toString()),
		body,
	);

	return [{ json: { success: true } }];
}
