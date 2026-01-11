import type { ResourceMethods } from "@dnsimple-types/registry";
import { getDomains } from "@helpers/loadOptions";

export const domainMethods: ResourceMethods = {
	listSearch: {
		getDomains: async function (filter) {
			const domains = await getDomains.call(this);
			if (!filter) {
				return { results: domains };
			}
			const filtered = domains.filter((d) =>
				d.name.toLowerCase().includes(filter.toLowerCase())
			);
			return { results: filtered };
		},
	},
};
