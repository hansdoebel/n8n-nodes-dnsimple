import type { ResourceOperationHandler } from "@dnsimple-types/registry";
import {
	vanityNameServerDisableExecute,
	vanityNameServerEnableExecute,
} from "./operations";

export const vanityNameServerMethods: Record<string, ResourceOperationHandler> =
	{
		enable: vanityNameServerEnableExecute,
		disable: vanityNameServerDisableExecute,
	};
