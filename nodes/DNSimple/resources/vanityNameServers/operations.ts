import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "../../methods/apiRequest";
import { resolveResourceLocator } from "../../helpers/parameterUtils";
import { ENDPOINTS } from "../../helpers/constants";

export const vanityNameServerEnableFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to enable vanity name servers for",
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
				resource: ["vanityNameServer"],
				operation: ["enable"],
			},
		},
	},
];

export async function vanityNameServerEnableExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"PUT",
		ENDPOINTS.VANITY_NAME_SERVERS(accountId, domainId),
	);

	return [{ json: { data: response.data } }];
}

export const vanityNameServerDisableFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to disable vanity name servers for",
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
				resource: ["vanityNameServer"],
				operation: ["disable"],
			},
		},
	},
];

export async function vanityNameServerDisableExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainId = resolveResourceLocator(this, "domainId", index);

	const accountId = await getAccountId(this);

	await dnsimpleApiRequest.call(
		this,
		"DELETE",
		ENDPOINTS.VANITY_NAME_SERVERS(accountId, domainId),
	);

	return [{ json: { success: true } }];
}
