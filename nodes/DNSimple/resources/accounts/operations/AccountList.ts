import type { IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import { dnsimpleApiRequest } from "@helpers/apiRequest";
import { ENDPOINTS } from "@constants/endpoints";

export async function accountListExecute(
	this: IExecuteFunctions,
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
