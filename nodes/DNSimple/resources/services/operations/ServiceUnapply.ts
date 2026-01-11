import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const serviceUnapplyFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to remove the service from",
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
				resource: ["service"],
				operation: ["unapply"],
			},
		},
	},
	{
		displayName: "Service",
		name: "serviceId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The service to remove",
		modes: [
			{
				displayName: "From List",
				name: "list",
				type: "list",
				typeOptions: {
					searchListMethod: "getServices",
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: "By ID or SID",
				name: "id",
				type: "string",
				placeholder: "1 or heroku",
			},
		],
		displayOptions: {
			show: {
				resource: ["service"],
				operation: ["unapply"],
			},
		},
	},
];

export async function serviceUnapplyExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainIdValue = this.getNodeParameter("domainId", index) as
		| string
		| { mode: string; value: string };
	const serviceIdValue = this.getNodeParameter("serviceId", index) as
		| string
		| { mode: string; value: string };

	let domainId: string;
	if (typeof domainIdValue === "object" && domainIdValue !== null) {
		domainId = domainIdValue.value;
	} else {
		domainId = domainIdValue;
	}

	let serviceId: string;
	if (typeof serviceIdValue === "object" && serviceIdValue !== null) {
		serviceId = serviceIdValue.value;
	} else {
		serviceId = serviceIdValue;
	}

	const accountId = await getAccountId(this);

	await dnsimpleApiRequest.call(
		this,
		"DELETE",
		ENDPOINTS.DOMAIN_SERVICE(accountId, domainId, serviceId),
	);

	return [{ json: { success: true } }];
}
