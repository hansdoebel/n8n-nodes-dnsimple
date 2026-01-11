import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const zoneRecordCheckDistributionFields: INodeProperties[] = [
	{
		displayName: "Zone Name",
		name: "zoneName",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The zone containing the record",
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
				resource: ["zoneRecord"],
				operation: ["checkDistribution"],
			},
		},
	},
	{
		displayName: "Record ID",
		name: "recordId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the record to check distribution for",
		displayOptions: {
			show: {
				resource: ["zoneRecord"],
				operation: ["checkDistribution"],
			},
		},
	},
];

export async function zoneRecordCheckDistributionExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const zoneNameValue = this.getNodeParameter("zoneName", index) as
		| string
		| { mode: string; value: string };
	const recordId = this.getNodeParameter("recordId", index) as number;

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
		ENDPOINTS.ZONE_RECORD_DISTRIBUTION(
			accountId,
			zoneName,
			recordId.toString(),
		),
	);

	return [{ json: response.data }];
}
