import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const serviceGetFields: INodeProperties[] = [
	{
		displayName: "Service",
		name: "serviceId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The service to retrieve",
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
				operation: ["get"],
			},
		},
	},
];

export async function serviceGetExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const serviceIdValue = this.getNodeParameter("serviceId", index) as
		| string
		| { mode: string; value: string };

	let serviceId: string;
	if (typeof serviceIdValue === "object" && serviceIdValue !== null) {
		serviceId = serviceIdValue.value;
	} else {
		serviceId = serviceIdValue;
	}

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.SERVICE(serviceId),
	);

	return [{ json: response.data }];
}
