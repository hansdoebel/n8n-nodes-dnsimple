import type {
	ResourceMethods,
	ResourceOperationHandler,
} from "@dnsimple-types/registry";
import { getZones } from "@helpers/loadOptions";
import {
	zoneActivateExecute,
	zoneCheckDistributionExecute,
	zoneDeactivateExecute,
	zoneDownloadFileExecute,
	zoneGetExecute,
	zoneListExecute,
} from "./operations";

export const zoneHandlers: Record<string, ResourceOperationHandler> = {
	list: zoneListExecute,
	get: zoneGetExecute,
	downloadFile: zoneDownloadFileExecute,
	checkDistribution: zoneCheckDistributionExecute,
	activate: zoneActivateExecute,
	deactivate: zoneDeactivateExecute,
};

export const zoneMethods: ResourceMethods = {
	listSearch: {
		getZones: async function (filter) {
			const zones = await getZones.call(this);
			if (!filter) {
				return { results: zones };
			}
			const filtered = zones.filter((z) =>
				z.name.toLowerCase().includes(filter.toLowerCase())
			);
			return { results: filtered };
		},
	},
};
