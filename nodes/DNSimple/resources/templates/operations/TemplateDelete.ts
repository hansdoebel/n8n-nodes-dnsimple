import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const templateDeleteFields: INodeProperties[] = [
	{
		displayName: "Template",
		name: "templateId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The template to delete",
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
				resource: ["template"],
				operation: ["delete"],
			},
		},
	},
];

export async function templateDeleteExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const templateIdValue = this.getNodeParameter("templateId", index) as
		| string
		| { mode: string; value: string };

	let templateId: string;
	if (typeof templateIdValue === "object" && templateIdValue !== null) {
		templateId = templateIdValue.value;
	} else {
		templateId = templateIdValue;
	}

	const accountId = await getAccountId(this);

	await dnsimpleApiRequest.call(
		this,
		"DELETE",
		ENDPOINTS.TEMPLATE(accountId, templateId),
	);

	return [{ json: { success: true } }];
}
