import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "../../methods/apiRequest";
import { ENDPOINTS } from "../../helpers/constants";
import { makeReturnAllFields } from "../../helpers/fieldFactories";
import { handlePaginatedList } from "../../helpers/paginationUtils";

export const webhookListFields: INodeProperties[] = [
	...makeReturnAllFields("webhook", "list"),
	{
		displayName: "Options",
		name: "options",
		type: "collection",
		placeholder: "Add Option",
		default: {},
		displayOptions: {
			show: {
				resource: ["webhook"],
				operation: ["list"],
			},
		},
		options: [
			{
				displayName: "Sort",
				name: "sort",
				type: "options",
				options: [
					{ name: "ID (Ascending)", value: "id:asc" },
					{ name: "ID (Descending)", value: "id:desc" },
				],
				default: "id:asc",
				description: "Sort order for the results",
			},
		],
	},
];

export async function webhookListExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const options = this.getNodeParameter("options", index, {}) as {
		sort?: string;
	};

	const accountId = await getAccountId(this);
	const qs: IDataObject = {};

	if (options.sort) {
		qs.sort = options.sort;
	}

	return handlePaginatedList(this, index, ENDPOINTS.WEBHOOKS(accountId), {
		qs,
	});
}

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

export const webhookGetFields: INodeProperties[] = [
	{
		displayName: "Webhook ID",
		name: "webhookId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the webhook to retrieve",
		displayOptions: {
			show: {
				resource: ["webhook"],
				operation: ["get"],
			},
		},
	},
];

export async function webhookGetExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const webhookId = this.getNodeParameter("webhookId", index) as number;

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.WEBHOOK(accountId, webhookId.toString()),
	);

	return [{ json: response.data }];
}

export const webhookDeleteFields: INodeProperties[] = [
	{
		displayName: "Webhook ID",
		name: "webhookId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the webhook to delete",
		displayOptions: {
			show: {
				resource: ["webhook"],
				operation: ["delete"],
			},
		},
	},
];

export async function webhookDeleteExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const webhookId = this.getNodeParameter("webhookId", index) as number;

	const accountId = await getAccountId(this);

	await dnsimpleApiRequest.call(
		this,
		"DELETE",
		ENDPOINTS.WEBHOOK(accountId, webhookId.toString()),
	);

	return [{ json: { success: true } }];
}
