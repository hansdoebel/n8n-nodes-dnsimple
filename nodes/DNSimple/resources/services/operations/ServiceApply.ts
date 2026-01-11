import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const serviceApplyFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain to apply the service to",
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
				operation: ["apply"],
			},
		},
	},
	{
		displayName: "Service",
		name: "serviceId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The service to apply",
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
				operation: ["apply"],
			},
		},
	},
	{
		displayName: "Additional Fields",
		name: "additionalFields",
		type: "collection",
		placeholder: "Add Field",
		default: {},
		displayOptions: {
			show: {
				resource: ["service"],
				operation: ["apply"],
			},
		},
		options: [
			{
				displayName: "Settings",
				name: "settings",
				type: "json",
				default: "{}",
				description:
					'Service-specific settings as JSON (e.g., {"app": "my-heroku-app"} for Heroku)',
			},
		],
	},
];

export async function serviceApplyExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainIdValue = this.getNodeParameter("domainId", index) as
		| string
		| { mode: string; value: string };
	const serviceIdValue = this.getNodeParameter("serviceId", index) as
		| string
		| { mode: string; value: string };
	const additionalFields = this.getNodeParameter(
		"additionalFields",
		index,
		{},
	) as {
		settings?: string;
	};

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

	const body: IDataObject = {};

	if (additionalFields.settings) {
		try {
			body.settings = JSON.parse(additionalFields.settings);
		} catch {
			throw new Error("Settings must be valid JSON");
		}
	}

	await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.DOMAIN_SERVICE(accountId, domainId, serviceId),
		body,
	);

	return [{ json: { success: true } }];
}
