import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "../../methods/apiRequest";
import { resolveResourceLocator } from "../../helpers/parameterUtils";
import { ENDPOINTS } from "../../helpers/constants";
import { makeReturnAllFields } from "../../helpers/fieldFactories";
import { handlePaginatedList } from "../../helpers/paginationUtils";

export const contactListFields: INodeProperties[] = [
	...makeReturnAllFields("contact", "list"),
];

export async function contactListExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const accountId = await getAccountId(this);
	return handlePaginatedList(this, index, ENDPOINTS.CONTACTS(accountId));
}

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

export const contactGetFields: INodeProperties[] = [
	{
		displayName: "Contact",
		name: "contactId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The contact to retrieve",
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
				operation: ["get"],
			},
		},
	},
];

export async function contactGetExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const contactId = resolveResourceLocator(this, "contactId", index);

	const accountId = await getAccountId(this);

	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.CONTACT(accountId, contactId),
	);

	return [{ json: response.data }];
}

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
	const contactId = resolveResourceLocator(this, "contactId", index);

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

export const contactDeleteFields: INodeProperties[] = [
	{
		displayName: "Contact",
		name: "contactId",
		type: "resourceLocator",
		default: { mode: "list", value: "" },
		required: true,
		description: "The contact to delete",
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
				operation: ["delete"],
			},
		},
	},
];

export async function contactDeleteExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const contactId = resolveResourceLocator(this, "contactId", index);

	const accountId = await getAccountId(this);

	await dnsimpleApiRequest.call(
		this,
		"DELETE",
		ENDPOINTS.CONTACT(accountId, contactId),
	);

	return [{ json: { success: true, contactId } }];
}
