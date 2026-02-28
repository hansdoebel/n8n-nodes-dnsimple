import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "../../methods/apiRequest";
import { resolveResourceLocator } from "../../helpers/parameterUtils";
import { ENDPOINTS } from "../../helpers/constants";
import { makeReturnAllFields } from "../../helpers/fieldFactories";
import { handlePaginatedList } from "../../helpers/paginationUtils";

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
	const contactId = resolveResourceLocator(this, "contactId", index);

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
	const domainId = resolveResourceLocator(this, "domainId", index);
	const newAccountIdentifier = this.getNodeParameter(
		"newAccountIdentifier",
		index,
	) as string;

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

export const domainPushListFields: INodeProperties[] = [
	...makeReturnAllFields("domainPush", "list"),
];

export async function domainPushListExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const accountId = await getAccountId(this);
	return handlePaginatedList(this, index, ENDPOINTS.PUSHES(accountId));
}

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
