import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const zoneGetFields: INodeProperties[] = [
	{
		displayName: "Zone Name",
		name: "zoneName",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The zone to retrieve",
		modes: [
			{
				displayName: "From List",
				name: "list",
				type: "list",
				typeOptions: {
					searchListMethod: "getZones",
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: "By Name",
				name: "name",
				type: "string",
				placeholder: "example.com",
			},
		],
		displayOptions: {
			show: {
				resource: ["zone"],
				operation: ["get"],
			},
		},
	},
];

export async function zoneGetExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const zoneNameValue = this.getNodeParameter("zoneName", index) as
		| string
		| { mode: string; value: string };

	let zoneName: string;
	if (typeof zoneNameValue === "object" && zoneNameValue !== null) {
		zoneName = zoneNameValue.value;
	} else {
		zoneName = zoneNameValue;
	}

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.ZONE(accountId, zoneName),
	);

	return [{ json: response.data }];
}
