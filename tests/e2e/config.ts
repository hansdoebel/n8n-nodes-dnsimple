import type {
	ICredentialDataDecryptedObject,
	IDataObject,
	IExecuteFunctions,
	INode,
	INodeExecutionData,
} from "n8n-workflow";

const SANDBOX_TOKEN = process.env.DNSIMPLE_SANDBOX_TOKEN;

if (!SANDBOX_TOKEN) {
	console.warn(
		"Warning: DNSIMPLE_SANDBOX_TOKEN not set. E2E tests will be skipped.",
	);
}

export const e2eConfig = {
	token: SANDBOX_TOKEN || "",
	accountId: "", // Will be fetched automatically
	isConfigured: Boolean(SANDBOX_TOKEN),
	baseUrl: "https://api.sandbox.dnsimple.com",
	apiVersion: "v2",
};

let accountIdFetched = false;

export async function ensureAccountId(): Promise<void> {
	if (accountIdFetched || !e2eConfig.isConfigured) return;

	try {
		const response = await fetch(
			`${e2eConfig.baseUrl}/${e2eConfig.apiVersion}/accounts`,
			{
				headers: {
					Authorization: `Bearer ${e2eConfig.token}`,
					Accept: "application/json",
				},
			},
		);

		if (response.ok) {
			const data = await response.json() as { data: Array<{ id: number }> };
			if (data.data && data.data.length > 0) {
				e2eConfig.accountId = String(data.data[0].id);
				console.log(`Using account ID: ${e2eConfig.accountId}`);
			}
		}
	} catch (error) {
		console.error("Failed to fetch account ID:", error);
	}

	accountIdFetched = true;
}

export function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const API_DELAY = 100;

export function createE2EExecuteFunctions(
	nodeParameters: Record<string, unknown>,
): IExecuteFunctions {
	const credentials: ICredentialDataDecryptedObject = {
		environment: "sandbox",
		apiToken: e2eConfig.token,
	};

	const params: Record<string, unknown> = {
		accountId: e2eConfig.accountId,
		...nodeParameters,
	};

	return {
		getCredentials: async () => credentials,
		getNodeParameter: (
			name: string,
			_itemIndex: number,
			fallback?: unknown,
		) => {
			if (name in params) {
				return params[name];
			}
			return fallback;
		},
		getInputData: () => [{ json: {} }],
		getNode: () =>
			({
				name: "DNSimple",
				type: "n8n-nodes-dnsimple.dnsimple",
				typeVersion: 1,
				position: [0, 0],
				parameters: params,
			}) as INode,
		continueOnFail: () => false,
		helpers: {
			httpRequestWithAuthentication: async function (
				_credentialsType: string,
				requestOptions: IDataObject,
			): Promise<unknown> {
				const url = requestOptions.url as string;
				const method = requestOptions.method as string;
				const body = requestOptions.body as IDataObject | undefined;
				const qs = requestOptions.qs as IDataObject | undefined;

				const fetchUrl = new URL(url);
				if (qs) {
					for (const [key, value] of Object.entries(qs)) {
						if (value !== undefined && value !== null) {
							fetchUrl.searchParams.set(key, String(value));
						}
					}
				}

				const headers: Record<string, string> = {
					Authorization: `Bearer ${e2eConfig.token}`,
					Accept: "application/json",
					"Content-Type": "application/json",
				};

				const fetchOptions: RequestInit = {
					method,
					headers,
				};

				if (body && Object.keys(body).length > 0) {
					fetchOptions.body = JSON.stringify(body);
				}

				const response = await fetch(fetchUrl.toString(), fetchOptions);

				if (!response.ok) {
					const errorText = await response.text();
					console.error(`API Error: ${method} ${fetchUrl.toString()}`);
					console.error(`Status: ${response.status} ${response.statusText}`);
					console.error(`Response: ${errorText}`);
					throw new Error(
						`HTTP ${response.status}: ${response.statusText} - ${errorText}`,
					);
				}

				const contentType = response.headers.get("content-type");
				if (contentType?.includes("application/json")) {
					return response.json();
				}

				return response.text();
			},
			returnJsonArray: (items: IDataObject[]): INodeExecutionData[] => {
				return items.map((item) => ({ json: item }));
			},
		},
	} as unknown as IExecuteFunctions;
}

export function skipIfNotConfigured(): boolean {
	if (!e2eConfig.isConfigured) {
		console.log("Skipping E2E test: environment variables not configured");
		return true;
	}
	return false;
}

export function generateTestId(): string {
	return `test-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}
