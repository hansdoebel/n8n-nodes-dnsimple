import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const zoneRecordUpdateFields: INodeProperties[] = [
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
				operation: ["update"],
			},
		},
	},
	{
		displayName: "Record ID",
		name: "recordId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the record to update",
		displayOptions: {
			show: {
				resource: ["zoneRecord"],
				operation: ["update"],
			},
		},
	},
	{
		displayName: "Update Fields",
		name: "updateFields",
		type: "collection",
		placeholder: "Add Field",
		default: {},
		displayOptions: {
			show: {
				resource: ["zoneRecord"],
				operation: ["update"],
			},
		},
		options: [
			{
				displayName: "Content",
				name: "content",
				type: "string",
				default: "",
				description: "The content of the record",
			},
			{
				displayName: "Name",
				name: "name",
				type: "string",
				default: "",
				description: "The record name without the domain",
			},
			{
				displayName: "Priority",
				name: "priority",
				type: "number",
				default: 10,
				description: "Priority for MX and SRV records",
			},
			{
				displayName: "Regions",
				name: "regions",
				type: "multiOptions",
				options: [
					{ name: "California (SV1)", value: "SV1" },
					{ name: "Chicago (ORD)", value: "ORD" },
					{ name: "Frankfurt (FRA)", value: "FRA" },
					{ name: "Global", value: "global" },
					{ name: "Hong Kong (HKG)", value: "HKG" },
					{ name: "Sydney (SYD)", value: "SYD" },
					{ name: "Tokyo (NRT)", value: "NRT" },
					{ name: "Virginia (IAD)", value: "IAD" },
				],
				default: [],
				description: "Geographic regions for the record (Enterprise only)",
			},
			{
				displayName: "TTL",
				name: "ttl",
				type: "number",
				default: 3600,
				description: "Time to live in seconds",
			},
		],
	},
];

export async function zoneRecordUpdateExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const zoneNameValue = this.getNodeParameter("zoneName", index) as
		| string
		| { mode: string; value: string };
	const recordId = this.getNodeParameter("recordId", index) as number;
	const updateFields = this.getNodeParameter("updateFields", index, {}) as {
		content?: string;
		name?: string;
		priority?: number;
		regions?: string[];
		ttl?: number;
	};

	let zoneName: string;
	if (typeof zoneNameValue === "object" && zoneNameValue !== null) {
		zoneName = zoneNameValue.value;
	} else {
		zoneName = zoneNameValue;
	}

	const accountId = await getAccountId(this);

	const body: IDataObject = {};

	if (updateFields.name !== undefined) {
		body.name = updateFields.name;
	}
	if (updateFields.content !== undefined) {
		body.content = updateFields.content;
	}
	if (updateFields.ttl !== undefined) {
		body.ttl = updateFields.ttl;
	}
	if (updateFields.priority !== undefined) {
		body.priority = updateFields.priority;
	}
	if (updateFields.regions && updateFields.regions.length > 0) {
		body.regions = updateFields.regions;
	}

	const response = await dnsimpleApiRequest.call(
		this,
		"PATCH",
		ENDPOINTS.ZONE_RECORD(accountId, zoneName, recordId.toString()),
		body,
	);

	return [{ json: response.data }];
}
