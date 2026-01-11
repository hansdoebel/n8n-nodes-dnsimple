import type { ILoadOptionsFunctions, INodePropertyOptions } from "n8n-workflow";
import { dnsimpleApiRequest, getAccountId } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export async function getAccounts(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.ACCOUNTS,
	);

	const accounts = response.data || [];
	return accounts.map(
		(
			account: {
				id: number;
				email: string | null;
				plan_identifier: string | null;
			},
		) => {
			let name = `Account ${account.id}`;
			if (account.email) {
				name = account.plan_identifier
					? `${account.email} (${account.plan_identifier})`
					: account.email;
			}
			return {
				name,
				value: account.id.toString(),
			};
		},
	);
}

export async function getContacts(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const accountId = await getAccountId(this);
	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.CONTACTS(accountId),
	);

	const contacts = response.data || [];
	return contacts.map(
		(
			contact: {
				id: number;
				first_name: string;
				last_name: string;
				label: string;
			},
		) => ({
			name: contact.label || `${contact.first_name} ${contact.last_name}`,
			value: contact.id,
		}),
	);
}

export async function getDomains(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const accountId = await getAccountId(this);
	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.DOMAINS(accountId),
	);

	const domains = response.data || [];
	return domains.map((
		domain: { id: number; name: string; unicode_name: string },
	) => ({
		name: domain.unicode_name || domain.name,
		value: domain.name,
	}));
}

export async function getServices(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.SERVICES,
	);

	const services = response.data || [];
	return services.map(
		(service: { id: number; name: string; sid: string }) => ({
			name: service.name,
			value: service.sid,
		}),
	);
}

export async function getTemplates(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const accountId = await getAccountId(this);
	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.TEMPLATES(accountId),
	);

	const templates = response.data || [];
	return templates.map(
		(template: { id: number; name: string; sid: string }) => ({
			name: template.name,
			value: template.id.toString(),
		}),
	);
}

export async function getZones(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const accountId = await getAccountId(this);
	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.ZONES(accountId),
	);

	const zones = response.data || [];
	return zones.map((zone: { id: number; name: string }) => ({
		name: zone.name,
		value: zone.name,
	}));
}
