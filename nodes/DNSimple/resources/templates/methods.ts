import type {
	ResourceMethods,
	ResourceOperationHandler,
} from "@dnsimple-types/registry";
import { getTemplates } from "@helpers/loadOptions";
import {
	templateApplyToDomainExecute,
	templateCreateExecute,
	templateDeleteExecute,
	templateGetExecute,
	templateListExecute,
	templateUpdateExecute,
} from "./operations";

export const templateHandlers: Record<string, ResourceOperationHandler> = {
	list: templateListExecute,
	create: templateCreateExecute,
	get: templateGetExecute,
	update: templateUpdateExecute,
	delete: templateDeleteExecute,
	applyToDomain: templateApplyToDomainExecute,
};

export const templateMethods: ResourceMethods = {
	listSearch: {
		getTemplates: async function (filter) {
			const templates = await getTemplates.call(this);
			if (!filter) {
				return { results: templates };
			}
			const filtered = templates.filter((t) =>
				t.name.toLowerCase().includes(filter.toLowerCase())
			);
			return { results: filtered };
		},
	},
};
