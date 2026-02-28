import type { IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import { dnsimpleApiRequest } from "../../methods/apiRequest";
import { ENDPOINTS } from "../../helpers/constants";

export async function accountListExecute(
	this: IExecuteFunctions,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	index: number,
): Promise<INodeExecutionData[]> {
	const response = await dnsimpleApiRequest.call(
		this,
		"GET",
		ENDPOINTS.ACCOUNTS,
	);

	const accounts = response.data || [];
	return accounts.map((account: Record<string, unknown>) => ({
		json: account,
	}));
}
