import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const templateRecordGetFields: INodeProperties[] = [
	{
		displayName: "Template",
		name: "templateId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The template containing the record",
		modes: [
			{
				displayName: "From List",
				name: "list",
				type: "list",
				typeOptions: {
					searchListMethod: "getTemplates",
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: "By ID or SID",
				name: "id",
				type: "string",
				placeholder: "1234 or my-template",
			},
		],
		displayOptions: {
			show: {
				resource: ["templateRecord"],
				operation: ["get"],
			},
		},
	},
	{
		displayName: "Record ID",
		name: "recordId",
		type: "number",
		required: true,
		default: 0,
		description: "The ID of the record to retrieve",
		displayOptions: {
			show: {
				resource: ["templateRecord"],
				operation: ["get"],
			},
		},
	},
];

export async function templateRecordGetExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const templateIdValue = this.getNodeParameter("templateId", index) as
		| string
		| { mode: string; value: string };
	const recordId = this.getNodeParameter("recordId", index) as number;

	let templateId: string;
	if (typeof templateIdValue === "object" && templateIdValue !== null) {
		templateId = templateIdValue.value;
	} else {
		templateId = templateIdValue;
	}

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.TEMPLATE_RECORD(accountId, templateId, recordId.toString()),
	);

	return [{ json: response.data }];
}
