import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from "n8n-workflow";
import { DNSIMPLE_URLS } from "@constants/urls";

export class DNSimpleApi implements ICredentialType {
	name = "dnsimpleApi";
	displayName = "DNSimple API";
	documentationUrl = "https://developer.dnsimple.com/v2/";
	icon: Icon = "file:dnsimple.svg";
	properties: INodeProperties[] = [
		{
			displayName: "Environment",
			name: "environment",
			type: "options",
			options: [
				{ name: "Production", value: "production" },
				{ name: "Sandbox", value: "sandbox" },
			],
			default: "production",
			description: "Choose between production and sandbox environments",
		},
		{
			displayName: "API Token",
			name: "apiToken",
			type: "string",
			typeOptions: {
				password: true,
			},
			default: "",
			required: true,
			description: "Your DNSimple API token",
			placeholder: "e.g. dnsimple_a_kM7vXnR2pL4wHcT9bJ6yQfE3sN8mK5aD",
			displayOptions: {
				show: {
					environment: ["production"],
				},
			},
		},
		{
			displayName: "API Token",
			name: "apiToken",
			type: "string",
			typeOptions: {
				password: true,
			},
			default: "",
			required: true,
			description: "Your DNSimple Sandbox API token",
			placeholder: "e.g. dnsimpletest_a_xK4mNpQ7wL2vHcY8bR5jTfE9sG3nM6aW",
			displayOptions: {
				show: {
					environment: ["sandbox"],
				},
			},
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: "generic",
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL:
				`={{$credentials.environment === "sandbox" ? "${DNSIMPLE_URLS.SANDBOX_API}" : "${DNSIMPLE_URLS.PRODUCTION_API}"}}`,
			url: `/${DNSIMPLE_URLS.API_VERSION}/accounts`,
		},
	};
}
