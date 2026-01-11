import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const templateUpdateFields: INodeProperties[] = [
	{
		displayName: "Template",
		name: "templateId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The template to update",
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
				resource: ["template"],
				operation: ["update"],
			},
		},
		options: [
			{
				displayName: "Description",
				name: "description",
				type: "string",
				default: "",
				description: "A description for the template",
			},
			{
				displayName: "Name",
				name: "name",
				type: "string",
				default: "",
				description: "The name of the template",
			},
			{
				displayName: "Short Name (SID)",
				name: "sid",
				type: "string",
				default: "",
				description: "A unique short name identifier for the template",
			},
		],
	},
];

export async function templateUpdateExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const templateIdValue = this.getNodeParameter("templateId", index) as
		| string
		| { mode: string; value: string };
	const updateFields = this.getNodeParameter("updateFields", index, {}) as {
		description?: string;
		name?: string;
		sid?: string;
	};

	let templateId: string;
	if (typeof templateIdValue === "object" && templateIdValue !== null) {
		templateId = templateIdValue.value;
	} else {
		templateId = templateIdValue;
	}

	const accountId = await getAccountId(this);

	const body: IDataObject = {};

	if (updateFields.name !== undefined) {
		body.name = updateFields.name;
	}
	if (updateFields.sid !== undefined) {
		body.sid = updateFields.sid;
	}
	if (updateFields.description !== undefined) {
		body.description = updateFields.description;
	}

	const response = await dnsimpleApiRequest.call(
		this,
		"PATCH",
		ENDPOINTS.TEMPLATE(accountId, templateId),
		body,
	);

	return [{ json: response.data }];
}
