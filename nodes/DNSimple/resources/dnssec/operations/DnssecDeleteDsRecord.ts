import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const dnssecDeleteDsRecordFields: INodeProperties[] = [
	{
		displayName: "Domain",
		name: "domainId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The domain the DS record belongs to",
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
				resource: ["dnssec"],
				operation: ["deleteDsRecord"],
			},
		},
	},
	{
		displayName: "DS Record ID",
		name: "dsRecordId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the DS record to delete",
		displayOptions: {
			show: {
				resource: ["dnssec"],
				operation: ["deleteDsRecord"],
			},
		},
	},
];

export async function dnssecDeleteDsRecordExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const domainIdValue = this.getNodeParameter("domainId", index) as
		| string
		| { mode: string; value: string };
	const dsRecordId = this.getNodeParameter("dsRecordId", index) as number;

	let domainId: string;
	if (typeof domainIdValue === "object" && domainIdValue !== null) {
		domainId = domainIdValue.value;
	} else {
		domainId = domainIdValue;
	}

	const accountId = await getAccountId(this);

	await dnsimpleApiRequest.call(
		this,
		"DELETE",
		ENDPOINTS.DS_RECORD(accountId, domainId, dsRecordId.toString()),
	);

	return [{ json: { success: true } }];
}
