import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const contactListFields: INodeProperties[] = [
	{
		displayName: "Return All",
		name: "returnAll",
		type: "boolean",
		default: false,
		description: "Whether to return all results or only up to a given limit",
		displayOptions: {
			show: {
				resource: ["contact"],
				operation: ["list"],
			},
		},
	},
	{
		displayName: "Limit",
		name: "limit",
		type: "number",
		default: 50,
		description: "Max number of results to return",
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ["contact"],
				operation: ["list"],
				returnAll: [false],
			},
		},
	},
];

export async function contactListExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter("returnAll", index) as boolean;
	const accountId = await getAccountId(this);
	const qs: IDataObject = {};

	if (returnAll) {
		const allContacts: IDataObject[] = [];
		let page = 1;
		let hasMore = true;

		while (hasMore) {
			qs.page = page;
			qs.per_page = 100;
			const response = await dnsimpleApiRequest.call(
				this,
				"GET",
				ENDPOINTS.CONTACTS(accountId),
				{},
				qs,
			);
			const contacts = response.data || [];
			allContacts.push(...contacts);

			const pagination = response.pagination;
			hasMore = pagination && pagination.current_page < pagination.total_pages;
			page++;
		}

		return allContacts.map((contact) => ({ json: contact }));
	}

	const limit = this.getNodeParameter("limit", index) as number;
	qs.per_page = limit;

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.CONTACTS(accountId),
		{},
		qs,
	);

	const contacts = response.data || [];
	return contacts.map((contact: IDataObject) => ({
		json: contact,
	}));
}
