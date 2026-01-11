export interface DNSimplePagination {
	current_page: number;
	per_page: number;
	total_entries: number;
	total_pages: number;
}

export interface DNSimpleResponse<T> {
	data: T;
	pagination?: DNSimplePagination;
}

export interface Account {
	id: number;
	email: string | null;
	plan_identifier: string | null;
	created_at: string;
	updated_at: string;
}

export interface Contact {
	id: number;
	account_id: number;
	label: string;
	first_name: string;
	last_name: string;
	job_title: string | null;
	organization_name: string | null;
	email: string;
	phone: string;
	fax: string | null;
	address1: string;
	address2: string | null;
	city: string;
	state_province: string;
	postal_code: string;
	country: string;
	created_at: string;
	updated_at: string;
}

export interface Domain {
	id: number;
	account_id: number;
	registrant_id: number | null;
	name: string;
	unicode_name: string;
	state: "hosted" | "registered" | "expired";
	auto_renew: boolean;
	private_whois: boolean;
	expires_at: string | null;
	expires_on: string | null;
	created_at: string;
	updated_at: string;
}

export interface Zone {
	id: number;
	account_id: number;
	name: string;
	reverse: boolean;
	secondary: boolean;
	last_transferred_at: string | null;
	active: boolean;
	created_at: string;
	updated_at: string;
}

export interface ZoneRecord {
	id: number;
	zone_id: string;
	parent_id: number | null;
	name: string;
	content: string;
	ttl: number;
	priority: number | null;
	type: string;
	regions: string[];
	system_record: boolean;
	created_at: string;
	updated_at: string;
}

export interface Template {
	id: number;
	account_id: number;
	name: string;
	sid: string;
	description: string;
	created_at: string;
	updated_at: string;
}

export interface TemplateRecord {
	id: number;
	template_id: number;
	name: string;
	content: string;
	ttl: number;
	priority: number | null;
	type: string;
	created_at: string;
	updated_at: string;
}

export interface Webhook {
	id: number;
	url: string;
	suppressed_at: string | null;
	created_at: string;
	updated_at: string;
}

export interface Tld {
	tld: string;
	tld_type: number;
	whois_privacy: boolean;
	auto_renew_only: boolean;
	idn: boolean;
	minimum_registration: number;
	registration_enabled: boolean;
	renewal_enabled: boolean;
	transfer_enabled: boolean;
	dnssec_interface_type: string | null;
}

export interface TldExtendedAttribute {
	name: string;
	description: string;
	required: boolean;
	options: Array<{
		title: string;
		value: string;
		description: string;
	}>;
}

export interface Certificate {
	id: number;
	domain_id: number;
	contact_id: number;
	name: string;
	common_name: string;
	years: number;
	csr: string | null;
	state: string;
	auto_renew: boolean;
	alternate_names: string[];
	authority_identifier: string;
	created_at: string;
	updated_at: string;
	expires_at: string;
}

export interface CertificateDownload {
	server: string;
	root: string | null;
	chain: string[];
}

export interface CertificatePrivateKey {
	private_key: string;
}

export interface DomainAvailability {
	domain: string;
	available: boolean;
	premium: boolean;
}

export interface DomainPrices {
	domain: string;
	premium: boolean;
	registration_price: number;
	renewal_price: number;
	transfer_price: number;
}

export interface DomainRegistration {
	id: number;
	domain_id: number;
	registrant_id: number;
	period: number;
	state: string;
	auto_renew: boolean;
	whois_privacy: boolean;
	created_at: string;
	updated_at: string;
}

export interface DomainTransfer {
	id: number;
	domain_id: number;
	registrant_id: number;
	state: string;
	auto_renew: boolean;
	whois_privacy: boolean;
	created_at: string;
	updated_at: string;
}

export interface DomainRenewal {
	id: number;
	domain_id: number;
	period: number;
	state: string;
	created_at: string;
	updated_at: string;
}

export interface DomainPush {
	id: number;
	domain_id: number;
	contact_id: number | null;
	account_id: number;
	created_at: string;
	updated_at: string;
	accepted_at: string | null;
}

export interface EmailForward {
	id: number;
	domain_id: number;
	alias_name: string;
	alias_email: string;
	destination_email: string;
	created_at: string;
	updated_at: string;
}

export interface Service {
	id: number;
	name: string;
	sid: string;
	description: string;
	setup_description: string | null;
	requires_setup: boolean;
	default_subdomain: string | null;
	created_at: string;
	updated_at: string;
	settings: ServiceSetting[];
}

export interface ServiceSetting {
	name: string;
	label: string;
	append: string | null;
	description: string;
	example: string;
	password: boolean;
}

export interface Dnssec {
	enabled: boolean;
	created_at: string | null;
	updated_at: string | null;
}

export interface DelegationSignerRecord {
	id: number;
	domain_id: number;
	algorithm: string;
	digest: string;
	digest_type: string;
	keytag: string;
	public_key: string | null;
	created_at: string;
	updated_at: string;
}

export interface VanityNameServer {
	id: number;
	name: string;
	ipv4: string;
	ipv6: string;
	created_at: string;
	updated_at: string;
}

export interface ZoneDistribution {
	distributed: boolean;
}

export interface DnsAnalyticsData {
	date: string;
	zone_name: string;
	volume: number;
}
