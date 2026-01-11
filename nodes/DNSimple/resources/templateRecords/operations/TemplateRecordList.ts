import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const templateRecordListFields: INodeProperties[] = [
	{
		displayName: "Template",
		name: "templateId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The template to list records for",
		modes: [
			{
				displayName: "From List",
				name: "list",
				type: "list",
				typeOptions: {
					searchListMethod: "getTemplates",
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: "By ID or SID",
				name: "id",
				type: "string",
				placeholder: "1234 or my-template",
			},
		],
		displayOptions: {
			show: {
				resource: ["templateRecord"],
				operation: ["list"],
			},
		},
	},
	{
		displayName: "Return All",
		name: "returnAll",
		type: "boolean",
		default: false,
		description: "Whether to return all results or only up to a given limit",
		displayOptions: {
			show: {
				resource: ["templateRecord"],
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
				resource: ["templateRecord"],
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
				resource: ["templateRecord"],
				operation: ["list"],
			},
		},
		options: [
			{
				displayName: "Sort",
				name: "sort",
				type: "options",
				options: [
					{ name: "Content (Ascending)", value: "content:asc" },
					{ name: "Content (Descending)", value: "content:desc" },
					{ name: "ID (Ascending)", value: "id:asc" },
					{ name: "ID (Descending)", value: "id:desc" },
					{ name: "Name (Ascending)", value: "name:asc" },
					{ name: "Name (Descending)", value: "name:desc" },
					{ name: "Type (Ascending)", value: "type:asc" },
					{ name: "Type (Descending)", value: "type:desc" },
				],
				default: "id:asc",
				description: "Sort order for the results",
			},
		],
	},
];

export async function templateRecordListExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const templateIdValue = this.getNodeParameter("templateId", index) as
		| string
		| { mode: string; value: string };
	const returnAll = this.getNodeParameter("returnAll", index) as boolean;
	const options = this.getNodeParameter("options", index, {}) as {
		sort?: string;
	};

	let templateId: string;
	if (typeof templateIdValue === "object" && templateIdValue !== null) {
		templateId = templateIdValue.value;
	} else {
		templateId = templateIdValue;
	}

	const accountId = await getAccountId(this);
	const qs: IDataObject = {};

	if (options.sort) {
		qs.sort = options.sort;
	}

	if (returnAll) {
		const records: IDataObject[] = [];
		let page = 1;
		let hasMore = true;

		while (hasMore) {
			qs.page = page;
			qs.per_page = 100;
			const response = await dnsimpleApiRequest.call(
				this,
				"GET",
				ENDPOINTS.TEMPLATE_RECORDS(accountId, templateId),
				{},
				qs,
			);
			records.push(...(response.data as IDataObject[]));
			hasMore = response.pagination.total_pages > page;
			page++;
		}

		return records.map((record) => ({ json: record }));
	}

	const limit = this.getNodeParameter("limit", index) as number;
	qs.per_page = limit;

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.TEMPLATE_RECORDS(accountId, templateId),
		{},
		qs,
	);

	return (response.data as IDataObject[]).map((record) => ({ json: record }));
}
