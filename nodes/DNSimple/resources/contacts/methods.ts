import type { ResourceMethods } from "@dnsimple-types/registry";
import { getContacts } from "@helpers/loadOptions";

export const contactMethods: ResourceMethods = {
	listSearch: {
		getContacts: async function (filter) {
			const contacts = await getContacts.call(this);
			if (!filter) {
				return { results: contacts };
			}
			const filtered = contacts.filter((c) =>
				c.name.toLowerCase().includes(filter.toLowerCase())
			);
			return { results: filtered };
		},
	},
};
