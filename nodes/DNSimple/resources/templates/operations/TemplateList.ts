import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const templateListFields: INodeProperties[] = [
	{
		displayName: "Return All",
		name: "returnAll",
		type: "boolean",
		default: false,
		description: "Whether to return all results or only up to a given limit",
		displayOptions: {
			show: {
				resource: ["template"],
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
				resource: ["template"],
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
				resource: ["template"],
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
					{ name: "Name (Ascending)", value: "name:asc" },
					{ name: "Name (Descending)", value: "name:desc" },
					{ name: "SID (Ascending)", value: "sid:asc" },
					{ name: "SID (Descending)", value: "sid:desc" },
				],
				default: "id:asc",
				description: "Sort order for the results",
			},
		],
	},
];

export async function templateListExecute(
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
		const templates: IDataObject[] = [];
		let page = 1;
		let hasMore = true;

		while (hasMore) {
			qs.page = page;
			qs.per_page = 100;
			const response = await dnsimpleApiRequest.call(
				this,
				"GET",
				ENDPOINTS.TEMPLATES(accountId),
				{},
				qs,
			);
			templates.push(...(response.data as IDataObject[]));
			hasMore = response.pagination.total_pages > page;
			page++;
		}

		return templates.map((template) => ({ json: template }));
	}

	const limit = this.getNodeParameter("limit", index) as number;
	qs.per_page = limit;

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.TEMPLATES(accountId),
		{},
		qs,
	);

	return (response.data as IDataObject[]).map((template) => ({
		json: template,
	}));
}
