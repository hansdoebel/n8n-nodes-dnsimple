import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export const contactUpdateFields: INodeProperties[] = [
	{
		displayName: "Contact",
		name: "contactId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The contact to update",
		modes: [
			{
				displayName: "From List",
				name: "list",
				type: "list",
				typeOptions: {
					searchListMethod: "getContacts",
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: "By ID",
				name: "id",
				type: "string",
				placeholder: "1234",
			},
		],
		displayOptions: {
			show: {
				resource: ["contact"],
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
				resource: ["contact"],
				operation: ["update"],
			},
		},
		options: [
			{
				displayName: "Address 1",
				name: "address1",
				type: "string",
				default: "",
			},
			{
				displayName: "Address 2",
				name: "address2",
				type: "string",
				default: "",
			},
			{
				displayName: "City",
				name: "city",
				type: "string",
				default: "",
			},
			{
				displayName: "Country",
				name: "country",
				type: "string",
				default: "",
				description: "Two-letter country code (ISO 3166-1 alpha-2)",
			},
			{
				displayName: "Email",
				name: "email",
				type: "string",
				placeholder: "name@email.com",
				default: "",
			},
			{
				displayName: "Fax",
				name: "fax",
				type: "string",
				default: "",
			},
			{
				displayName: "First Name",
				name: "firstName",
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
			},
			{
				displayName: "Last Name",
				name: "lastName",
				type: "string",
				default: "",
			},
			{
				displayName: "Organization Name",
				name: "organizationName",
				type: "string",
				default: "",
			},
			{
				displayName: "Phone",
				name: "phone",
				type: "string",
				default: "",
			},
			{
				displayName: "Postal Code",
				name: "postalCode",
				type: "string",
				default: "",
			},
			{
				displayName: "State/Province",
				name: "stateProvince",
				type: "string",
				default: "",
			},
		],
	},
];

export async function contactUpdateExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const contactIdValue = this.getNodeParameter("contactId", index) as
		| string
		| { mode: string; value: string };

	let contactId: string;
	if (typeof contactIdValue === "object" && contactIdValue !== null) {
		contactId = contactIdValue.value;
	} else {
		contactId = contactIdValue;
	}

	const updateFields = this.getNodeParameter("updateFields", index, {}) as {
		firstName?: string;
		lastName?: string;
		email?: string;
		phone?: string;
		address1?: string;
		address2?: string;
		city?: string;
		stateProvince?: string;
		postalCode?: string;
		country?: string;
		fax?: string;
		jobTitle?: string;
		label?: string;
		organizationName?: string;
	};

	const accountId = await getAccountId(this);

	const body: IDataObject = {};

	if (updateFields.firstName) body.first_name = updateFields.firstName;
	if (updateFields.lastName) body.last_name = updateFields.lastName;
	if (updateFields.email) body.email = updateFields.email;
	if (updateFields.phone) body.phone = updateFields.phone;
	if (updateFields.address1) body.address1 = updateFields.address1;
	if (updateFields.address2) body.address2 = updateFields.address2;
	if (updateFields.city) body.city = updateFields.city;
	if (updateFields.stateProvince) {
		body.state_province = updateFields.stateProvince;
	}
	if (updateFields.postalCode) body.postal_code = updateFields.postalCode;
	if (updateFields.country) body.country = updateFields.country;
	if (updateFields.fax) body.fax = updateFields.fax;
	if (updateFields.jobTitle) body.job_title = updateFields.jobTitle;
	if (updateFields.label) body.label = updateFields.label;
	if (updateFields.organizationName) {
		body.organization_name = updateFields.organizationName;
	}

	const response = await dnsimpleApiRequest.call(
		this,
		"PATCH",
		ENDPOINTS.CONTACT(accountId, contactId),
		body,
	);

	return [{ json: response.data }];
}
