import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const templateCreateFields: INodeProperties[] = [
	{
		displayName: "Name",
		name: "name",
		type: "string",
		required: true,
		default: "",
		description: "The name of the template",
		displayOptions: {
			show: {
				resource: ["template"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Short Name (SID)",
		name: "sid",
		type: "string",
		required: true,
		default: "",
		placeholder: "my-template",
		description: "A unique short name identifier for the template",
		displayOptions: {
			show: {
				resource: ["template"],
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
				resource: ["template"],
				operation: ["create"],
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
		],
	},
];

export async function templateCreateExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter("name", index) as string;
	const sid = this.getNodeParameter("sid", index) as string;
	const additionalFields = this.getNodeParameter(
		"additionalFields",
		index,
		{},
	) as {
		description?: string;
	};

	const accountId = await getAccountId(this);

	const body: IDataObject = {
		name,
		sid,
	};

	if (additionalFields.description) {
		body.description = additionalFields.description;
	}

	const response = await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.TEMPLATES(accountId),
		body,
	);

	return [{ json: response.data }];
}
