import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { ENDPOINTS } from "../../helpers/constants";
import { makeReturnAllFields } from "../../helpers/fieldFactories";
import { handlePaginatedList } from "../../helpers/paginationUtils";
import { dnsimpleApiRequest } from "../../methods/apiRequest";

export const tldGetFields: INodeProperties[] = [
	{
		displayName: "TLD",
		name: "tld",
		type: "string",
		required: true,
		default: "",
		placeholder: "com",
		description: "The TLD to retrieve (e.g., com, net, org)",
		displayOptions: {
			show: {
				resource: ["tld"],
				operation: ["get"],
			},
		},
	},
];

export async function tldGetExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const tld = this.getNodeParameter("tld", index) as string;

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.TLD(tld),
	);

	return [{ json: response.data }];
}

export const tldGetExtendedAttributesFields: INodeProperties[] = [
	{
		displayName: "TLD",
		name: "tld",
		type: "string",
		required: true,
		default: "",
		placeholder: "us",
		description: "The TLD to get extended attributes for",
		displayOptions: {
			show: {
				resource: ["tld"],
				operation: ["getExtendedAttributes"],
			},
		},
	},
];

export async function tldGetExtendedAttributesExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const tld = this.getNodeParameter("tld", index) as string;

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.TLD_EXTENDED_ATTRIBUTES(tld),
	);

	return [{ json: { data: response.data } }];
}

export const tldListFields: INodeProperties[] = [
	...makeReturnAllFields("tld", "list"),
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
	const options = this.getNodeParameter("options", index, {}) as {
		sort?: string;
	};

	const qs: IDataObject = {};

	if (options.sort) {
		qs.sort = options.sort;
	}

	return handlePaginatedList(this, index, ENDPOINTS.TLDS, { qs });
}
