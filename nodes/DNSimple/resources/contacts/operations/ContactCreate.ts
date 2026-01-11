import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const contactCreateFields: INodeProperties[] = [
	{
		displayName: "First Name",
		name: "firstName",
		type: "string",
		required: true,
		default: "",
		displayOptions: {
			show: {
				resource: ["contact"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Last Name",
		name: "lastName",
		type: "string",
		required: true,
		default: "",
		displayOptions: {
			show: {
				resource: ["contact"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Email",
		name: "email",
		type: "string",
		placeholder: "name@email.com",
		required: true,
		default: "",
		displayOptions: {
			show: {
				resource: ["contact"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Phone",
		name: "phone",
		type: "string",
		required: true,
		default: "",
		placeholder: "+1 555 123 4567",
		displayOptions: {
			show: {
				resource: ["contact"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Address 1",
		name: "address1",
		type: "string",
		required: true,
		default: "",
		displayOptions: {
			show: {
				resource: ["contact"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "City",
		name: "city",
		type: "string",
		required: true,
		default: "",
		displayOptions: {
			show: {
				resource: ["contact"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "State/Province",
		name: "stateProvince",
		type: "string",
		required: true,
		default: "",
		displayOptions: {
			show: {
				resource: ["contact"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Postal Code",
		name: "postalCode",
		type: "string",
		required: true,
		default: "",
		displayOptions: {
			show: {
				resource: ["contact"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Country",
		name: "country",
		type: "string",
		required: true,
		default: "",
		placeholder: "US",
		description: "Two-letter country code (ISO 3166-1 alpha-2)",
		displayOptions: {
			show: {
				resource: ["contact"],
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
				resource: ["contact"],
				operation: ["create"],
			},
		},
		options: [
			{
				displayName: "Address 2",
				name: "address2",
				type: "string",
				default: "",
			},
			{
				displayName: "Fax",
				name: "fax",
				type: "string",
				default: "",
			},
			{
				displayName: "Job Title",
				name: "jobTitle",
				type: "string",
				default: "",
			},
			{
				displayName: "Label",
				name: "label",
				type: "string",
				default: "",
				description: "A label to identify the contact",
			},
			{
				displayName: "Organization Name",
				name: "organizationName",
				type: "string",
				default: "",
			},
		],
	},
];

export async function contactCreateExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const firstName = this.getNodeParameter("firstName", index) as string;
	const lastName = this.getNodeParameter("lastName", index) as string;
	const email = this.getNodeParameter("email", index) as string;
	const phone = this.getNodeParameter("phone", index) as string;
	const address1 = this.getNodeParameter("address1", index) as string;
	const city = this.getNodeParameter("city", index) as string;
	const stateProvince = this.getNodeParameter("stateProvince", index) as string;
	const postalCode = this.getNodeParameter("postalCode", index) as string;
	const country = this.getNodeParameter("country", index) as string;
	const additionalFields = this.getNodeParameter(
		"additionalFields",
		index,
		{},
	) as {
		address2?: string;
		fax?: string;
		jobTitle?: string;
		label?: string;
		organizationName?: string;
	};

	const accountId = await getAccountId(this);

	const body: IDataObject = {
		first_name: firstName,
		last_name: lastName,
		email,
		phone,
		address1,
		city,
		state_province: stateProvince,
		postal_code: postalCode,
		country,
	};

	if (additionalFields.address2) {
		body.address2 = additionalFields.address2;
	}
	if (additionalFields.fax) {
		body.fax = additionalFields.fax;
	}
	if (additionalFields.jobTitle) {
		body.job_title = additionalFields.jobTitle;
	}
	if (additionalFields.label) {
		body.label = additionalFields.label;
	}
	if (additionalFields.organizationName) {
		body.organization_name = additionalFields.organizationName;
	}

	const response = await dnsimpleApiRequest.call(
		this,
		"POST",
		ENDPOINTS.CONTACTS(accountId),
		body,
	);

	return [{ json: response.data }];
}
