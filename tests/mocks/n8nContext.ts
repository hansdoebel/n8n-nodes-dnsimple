import type {
	ICredentialDataDecryptedObject,
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INode,
	INodeExecutionData,
} from "n8n-workflow";

export interface MockCredentials {
	apiToken?: string;
	environment?: string;
}

export interface MockNodeParameters {
	[key: string]: unknown;
}

export interface MockHttpResponse {
	data?: unknown;
	pagination?: unknown;
	[key: string]: unknown;
}

export function createMockCredentials(
	overrides: Partial<MockCredentials> = {},
): ICredentialDataDecryptedObject {
	return {
		apiToken: "test_token_abc123",
		environment: "production",
		...overrides,
	};
}

export function createMockNode(name = "DNSimple"): INode {
	return {
		id: "test-node-id",
		name,
		type: "n8n-nodes-dnsimple.dnsimple",
		typeVersion: 1,
		position: [0, 0],
		parameters: {},
	};
}

export function createMockExecuteFunctions(options: {
	credentials?: Partial<MockCredentials>;
	nodeParameters?: MockNodeParameters;
	inputData?: INodeExecutionData[];
	httpResponse?: MockHttpResponse | MockHttpResponse[];
	continueOnFail?: boolean;
}): IExecuteFunctions {
	const {
		credentials = {},
		nodeParameters = {},
		inputData = [{ json: {} }],
		httpResponse = { data: {} },
		continueOnFail = false,
	} = options;

	let httpCallCount = 0;
	const httpResponses = Array.isArray(httpResponse)
		? httpResponse
		: [httpResponse];

	const mockContext = {
		getCredentials: async () => createMockCredentials(credentials),

		getNodeParameter: (
			parameterName: string,
			itemIndex: number,
			fallbackValue?: unknown,
		) => {
			const value = nodeParameters[parameterName];
			if (value === undefined) {
				return fallbackValue;
			}
			return value;
		},

		getInputData: () => inputData,

		getNode: () => createMockNode(),

		continueOnFail: () => continueOnFail,

		helpers: {
			httpRequestWithAuthentication: async (
				_credentialType: string,
				_requestOptions: IHttpRequestOptions,
			) => {
				const response = httpResponses[httpCallCount] || httpResponses[0];
				httpCallCount++;
				return response;
			},
			returnJsonArray: (items: IDataObject | IDataObject[]) => {
				const arr = Array.isArray(items) ? items : [items];
				return arr.map((item) => ({ json: item }));
			},
		},

		getHttpCallCount: () => httpCallCount,
		resetHttpCallCount: () => {
			httpCallCount = 0;
		},
	};

	return mockContext as unknown as IExecuteFunctions;
}

export function createMockLoadOptionsFunctions(options: {
	credentials?: Partial<MockCredentials>;
	nodeParameters?: MockNodeParameters;
	httpResponse?: MockHttpResponse;
}): ILoadOptionsFunctions {
	const {
		credentials = {},
		nodeParameters = {},
		httpResponse = { data: [] },
	} = options;

	const mockContext = {
		getCredentials: async () => createMockCredentials(credentials),

		getCurrentNodeParameter: (parameterName: string) => {
			return nodeParameters[parameterName];
		},

		getNode: () => createMockNode(),

		helpers: {
			httpRequestWithAuthentication: async () => httpResponse,
		},
	};

	return mockContext as unknown as ILoadOptionsFunctions;
}

export function createMockHookFunctions(options: {
	credentials?: Partial<MockCredentials>;
	nodeParameters?: MockNodeParameters;
	httpResponse?: MockHttpResponse;
}): IHookFunctions {
	const {
		credentials = {},
		nodeParameters = {},
		httpResponse = { data: {} },
	} = options;

	const mockContext = {
		getCredentials: async () => createMockCredentials(credentials),

		getNodeParameter: (
			parameterName: string,
			_itemIndex: number,
			fallbackValue?: unknown,
		) => {
			const value = nodeParameters[parameterName];
			if (value === undefined) {
				return fallbackValue;
			}
			return value;
		},

		getNode: () => createMockNode(),

		helpers: {
			httpRequestWithAuthentication: async () => httpResponse,
		},
	};

	return mockContext as unknown as IHookFunctions;
}
