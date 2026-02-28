export const DNSIMPLE_URLS = {
	PRODUCTION_API: "https://api.dnsimple.com",
	SANDBOX_API: "https://api.sandbox.dnsimple.com",
	PRODUCTION_BASE: "https://dnsimple.com",
	SANDBOX_BASE: "https://sandbox.dnsimple.com",
	API_VERSION: "v2",
} as const;

export const ENDPOINTS = {
	ACCOUNTS: "/accounts",

	CERTIFICATE: (account: string, domain: string, certificate: string) =>
		`/${account}/domains/${domain}/certificates/${certificate}`,
	CERTIFICATE_DOWNLOAD: (
		account: string,
		domain: string,
		certificate: string,
	) => `/${account}/domains/${domain}/certificates/${certificate}/download`,
	CERTIFICATE_ISSUE: (account: string, domain: string, certificate: string) =>
		`/${account}/domains/${domain}/certificates/letsencrypt/${certificate}/issue`,
	CERTIFICATE_PRIVATE_KEY: (
		account: string,
		domain: string,
		certificate: string,
	) => `/${account}/domains/${domain}/certificates/${certificate}/private_key`,
	CERTIFICATE_RENEWALS: (
		account: string,
		domain: string,
		certificate: string,
	) =>
		`/${account}/domains/${domain}/certificates/letsencrypt/${certificate}/renewals`,
	CERTIFICATES: (account: string, domain: string) =>
		`/${account}/domains/${domain}/certificates`,
	CERTIFICATES_LETSENCRYPT: (account: string, domain: string) =>
		`/${account}/domains/${domain}/certificates/letsencrypt`,

	CONTACT: (account: string, contact: string) =>
		`/${account}/contacts/${contact}`,
	CONTACTS: (account: string) => `/${account}/contacts`,

	DNS_ANALYTICS: (account: string) => `/${account}/dns_analytics`,

	DNSSEC: (account: string, domain: string) =>
		`/${account}/domains/${domain}/dnssec`,
	DOMAIN: (account: string, domain: string) => `/${account}/domains/${domain}`,
	DOMAIN_PUSHES: (account: string, domain: string) =>
		`/${account}/domains/${domain}/pushes`,
	DOMAIN_SERVICE: (account: string, domain: string, service: string) =>
		`/${account}/domains/${domain}/services/${service}`,
	DOMAIN_SERVICES: (account: string, domain: string) =>
		`/${account}/domains/${domain}/services`,
	DOMAIN_TEMPLATE: (account: string, domain: string, template: string) =>
		`/${account}/domains/${domain}/templates/${template}`,
	DOMAINS: (account: string) => `/${account}/domains`,

	DS_RECORD: (account: string, domain: string, dsRecord: string) =>
		`/${account}/domains/${domain}/ds_records/${dsRecord}`,
	DS_RECORDS: (account: string, domain: string) =>
		`/${account}/domains/${domain}/ds_records`,

	EMAIL_FORWARD: (account: string, domain: string, emailForward: string) =>
		`/${account}/domains/${domain}/email_forwards/${emailForward}`,
	EMAIL_FORWARDS: (account: string, domain: string) =>
		`/${account}/domains/${domain}/email_forwards`,

	PUSH: (account: string, push: string) => `/${account}/pushes/${push}`,
	PUSHES: (account: string) => `/${account}/pushes`,

	REGISTRAR_CHECK: (account: string, domain: string) =>
		`/${account}/registrar/domains/${domain}/check`,
	REGISTRAR_PRICES: (account: string, domain: string) =>
		`/${account}/registrar/domains/${domain}/prices`,
	REGISTRAR_REGISTER: (account: string, domain: string) =>
		`/${account}/registrar/domains/${domain}/registrations`,
	REGISTRAR_RENEW: (account: string, domain: string) =>
		`/${account}/registrar/domains/${domain}/renewals`,
	REGISTRAR_TRANSFER: (account: string, domain: string) =>
		`/${account}/registrar/domains/${domain}/transfers`,

	SERVICE: (service: string) => `/services/${service}`,
	SERVICES: "/services",

	TEMPLATE: (account: string, template: string) =>
		`/${account}/templates/${template}`,
	TEMPLATE_RECORD: (account: string, template: string, record: string) =>
		`/${account}/templates/${template}/records/${record}`,
	TEMPLATE_RECORDS: (account: string, template: string) =>
		`/${account}/templates/${template}/records`,
	TEMPLATES: (account: string) => `/${account}/templates`,

	TLD: (tld: string) => `/tlds/${tld}`,
	TLD_EXTENDED_ATTRIBUTES: (tld: string) => `/tlds/${tld}/extended_attributes`,
	TLDS: "/tlds",

	VANITY_NAME_SERVERS: (account: string, domain: string) =>
		`/${account}/vanity/${domain}`,

	WEBHOOK: (account: string, webhook: string) =>
		`/${account}/webhooks/${webhook}`,
	WEBHOOKS: (account: string) => `/${account}/webhooks`,

	ZONE: (account: string, zone: string) => `/${account}/zones/${zone}`,
	ZONE_ACTIVATION: (account: string, zone: string) =>
		`/${account}/zones/${zone}/activation`,
	ZONE_DISTRIBUTION: (account: string, zone: string) =>
		`/${account}/zones/${zone}/distribution`,
	ZONE_FILE: (account: string, zone: string) =>
		`/${account}/zones/${zone}/file`,
	ZONE_RECORD: (account: string, zone: string, record: string) =>
		`/${account}/zones/${zone}/records/${record}`,
	ZONE_RECORD_DISTRIBUTION: (account: string, zone: string, record: string) =>
		`/${account}/zones/${zone}/records/${record}/distribution`,
	ZONE_RECORDS: (account: string, zone: string) =>
		`/${account}/zones/${zone}/records`,
	ZONES: (account: string) => `/${account}/zones`,
} as const;

export const HTTP_METHODS = {
	DELETE: "DELETE",
	GET: "GET",
	PATCH: "PATCH",
	POST: "POST",
	PUT: "PUT",
} as const;

export const PAGINATION = {
	DEFAULT_PER_PAGE: 30,
	MAX_PER_PAGE: 100,
} as const;
