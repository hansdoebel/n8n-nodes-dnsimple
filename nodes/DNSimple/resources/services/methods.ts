import type {
	ResourceMethods,
	ResourceOperationHandler,
} from "@dnsimple-types/registry";
import { getServices } from "@helpers/loadOptions";
import {
	serviceApplyExecute,
	serviceGetExecute,
	serviceListAppliedExecute,
	serviceListExecute,
	serviceUnapplyExecute,
} from "./operations";

export const serviceHandlers: Record<string, ResourceOperationHandler> = {
	list: serviceListExecute,
	get: serviceGetExecute,
	listApplied: serviceListAppliedExecute,
	apply: serviceApplyExecute,
	unapply: serviceUnapplyExecute,
};

export const serviceMethods: ResourceMethods = {
	listSearch: {
		getServices: async function (filter) {
			const services = await getServices.call(this);
			if (!filter) {
				return { results: services };
			}
			const filtered = services.filter((s) =>
				s.name.toLowerCase().includes(filter.toLowerCase())
			);
			return { results: filtered };
		},
	},
};
