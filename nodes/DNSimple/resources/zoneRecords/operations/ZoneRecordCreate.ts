import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const zoneRecordCreateFields: INodeProperties[] = [
	{
		displayName: "Zone Name",
		name: "zoneName",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The zone to create the record in",
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
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Record Name",
		name: "recordName",
		type: "string",
		required: true,
		default: "",
		placeholder: "www",
		description:
			"The record name without the domain. Use empty string for apex records.",
		displayOptions: {
			show: {
				resource: ["zoneRecord"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Record Type",
		name: "recordType",
		type: "options",
		required: true,
		options: [
			{ name: "A", value: "A" },
			{ name: "AAAA", value: "AAAA" },
			{ name: "ALIAS", value: "ALIAS" },
			{ name: "CAA", value: "CAA" },
			{ name: "CNAME", value: "CNAME" },
			{ name: "HINFO", value: "HINFO" },
			{ name: "MX", value: "MX" },
			{ name: "NAPTR", value: "NAPTR" },
			{ name: "NS", value: "NS" },
			{ name: "POOL", value: "POOL" },
			{ name: "PTR", value: "PTR" },
			{ name: "SPF", value: "SPF" },
			{ name: "SRV", value: "SRV" },
			{ name: "SSHFP", value: "SSHFP" },
			{ name: "TXT", value: "TXT" },
			{ name: "URL", value: "URL" },
		],
		default: "A",
		description: "The type of DNS record",
		displayOptions: {
			show: {
				resource: ["zoneRecord"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Content",
		name: "content",
		type: "string",
		required: true,
		default: "",
		placeholder: "192.0.2.1",
		description: "The content of the record (IP address, hostname, etc.)",
		displayOptions: {
			show: {
				resource: ["zoneRecord"],
				operation: ["create"],
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
				resource: ["zoneRecord"],
				operation: ["create"],
			},
		},
		options: [
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

export async function zoneRecordCreateExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const zoneNameValue = this.getNodeParameter("zoneName", index) as
		| string
		| { mode: string; value: string };
	const recordName = this.getNodeParameter("recordName", index) as string;
	const recordType = this.getNodeParameter("recordType", index) as string;
	const content = this.getNodeParameter("content", index) as string;
	const additionalFields = this.getNodeParameter(
		"additionalFields",
		index,
		{},
	) as {
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

	const body: IDataObject = {
		name: recordName,
		type: recordType,
		content,
	};

	if (additionalFields.ttl !== undefined) {
		body.ttl = additionalFields.ttl;
	}
	if (additionalFields.priority !== undefined) {
		body.priority = additionalFields.priority;
	}
	if (additionalFields.regions && additionalFields.regions.length > 0) {
		body.regions = additionalFields.regions;
	}

	const response = await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.ZONE_RECORDS(accountId, zoneName),
		body,
	);

	return [{ json: response.data }];
}
