import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const webhookListFields: INodeProperties[] = [
	{
		displayName: "Return All",
		name: "returnAll",
		type: "boolean",
		default: false,
		description: "Whether to return all results or only up to a given limit",
		displayOptions: {
			show: {
				resource: ["webhook"],
				operation: ["list"],
			},
		},
	},
	{
		displayName: "Limit",
		name: "limit",
		type: "number",
		default: 50,
		typeOptions: {
			minValue: 1,
		},
		description: "Max number of results to return",
		displayOptions: {
			show: {
				resource: ["webhook"],
				operation: ["list"],
				returnAll: [false],
			},
		},
	},
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
	const returnAll = this.getNodeParameter("returnAll", index) as boolean;
	const options = this.getNodeParameter("options", index, {}) as {
		sort?: string;
	};

	const accountId = await getAccountId(this);
	const qs: IDataObject = {};

	if (options.sort) {
		qs.sort = options.sort;
	}

	if (returnAll) {
		const webhooks: IDataObject[] = [];
		let page = 1;
		let hasMore = true;

		while (hasMore) {
			qs.page = page;
			qs.per_page = 100;
			const response = await dnsimpleApiRequest.call(
				this,
				"GET",
				ENDPOINTS.WEBHOOKS(accountId),
				{},
				qs,
			);
			webhooks.push(...(response.data as IDataObject[]));
			hasMore = response.pagination.total_pages > page;
			page++;
		}

		return webhooks.map((webhook) => ({ json: webhook }));
	}

	const limit = this.getNodeParameter("limit", index) as number;
	qs.per_page = limit;

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.WEBHOOKS(accountId),
		{},
		qs,
	);

	return (response.data as IDataObject[]).map((webhook) => ({ json: webhook }));
}
