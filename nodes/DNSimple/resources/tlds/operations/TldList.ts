import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const tldListFields: INodeProperties[] = [
	{
		displayName: "Return All",
		name: "returnAll",
		type: "boolean",
		default: false,
		description: "Whether to return all results or only up to a given limit",
		displayOptions: {
			show: {
				resource: ["tld"],
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
				resource: ["tld"],
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
				resource: ["tld"],
				operation: ["list"],
			},
		},
		options: [
			{
				displayName: "Sort",
				name: "sort",
				type: "options",
				options: [
					{ name: "TLD (Ascending)", value: "tld:asc" },
					{ name: "TLD (Descending)", value: "tld:desc" },
				],
				default: "tld:asc",
				description: "Sort order for the results",
			},
		],
	},
];

export async function tldListExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter("returnAll", index) as boolean;
	const options = this.getNodeParameter("options", index, {}) as {
		sort?: string;
	};

	const qs: IDataObject = {};

	if (options.sort) {
		qs.sort = options.sort;
	}

	if (returnAll) {
		const tlds: IDataObject[] = [];
		let page = 1;
		let hasMore = true;

		while (hasMore) {
			qs.page = page;
			qs.per_page = 100;
			const response = await dnsimpleApiRequest.call(
				this,
				"GET",
				ENDPOINTS.TLDS,
				{},
				qs,
			);
			tlds.push(...(response.data as IDataObject[]));
			hasMore = response.pagination.total_pages > page;
			page++;
		}

		return tlds.map((tld) => ({ json: tld }));
	}

	const limit = this.getNodeParameter("limit", index) as number;
	qs.per_page = limit;

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.TLDS,
		{},
		qs,
	);

	return (response.data as IDataObject[]).map((tld) => ({ json: tld }));
}
