import type {
	ILoadOptionsFunctions,
	INodeListSearchResult,
	INodePropertyOptions,
} from "n8n-workflow";
import type { ListSearchFunction } from "./types";

export function createListSearchMethod(
	loader: (
		this: ILoadOptionsFunctions,
	) => Promise<INodePropertyOptions[]>,
): ListSearchFunction {
	return async function (
		this: ILoadOptionsFunctions,
		filter?: string,
	): Promise<INodeListSearchResult> {
		const items = await loader.call(this);
		if (!filter) {
			return { results: items };
		}
		const filtered = items.filter((item) =>
			item.name.toLowerCase().includes(filter.toLowerCase()),
		);
		return { results: filtered };
	};
}
