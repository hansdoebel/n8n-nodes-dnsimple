import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
} from "n8n-workflow";
import { NodeApiError } from "n8n-workflow";
import { DNSIMPLE_URLS } from "@constants/urls";

export function getBaseUrl(environment: string): string {
	return environment === "sandbox"
		? DNSIMPLE_URLS.SANDBOX_API
		: DNSIMPLE_URLS.PRODUCTION_API;
}

export async function dnsimpleApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
) {
	const credentials = await this.getCredentials("dnsimpleApi");
	const environment = (credentials.environment as string) || "production";
	const baseUrl = getBaseUrl(environment);

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}/${DNSIMPLE_URLS.API_VERSION}${endpoint}`,
		qs,
		json: true,
	};

	if (Object.keys(body).length) {
		options.body = body;
	}

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			"dnsimpleApi",
			options,
		);

		return response;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}

export async function getAccountId(
	context: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	itemIndex = 0,
): Promise<string> {
	if ("getCurrentNodeParameter" in context) {
		return (context as ILoadOptionsFunctions).getCurrentNodeParameter(
			"accountId",
		) as string;
	}
	return (context as IExecuteFunctions).getNodeParameter(
		"accountId",
		itemIndex,
	) as string;
}
