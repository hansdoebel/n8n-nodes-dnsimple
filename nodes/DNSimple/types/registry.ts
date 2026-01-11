import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeListSearchResult,
	INodeProperties,
} from "n8n-workflow";

export type ListSearchFunction = (
	this: ILoadOptionsFunctions,
	filter?: string,
) => Promise<INodeListSearchResult>;

export type LoadOptionsFunction = (this: ILoadOptionsFunctions) => Promise<any>;

export type OperationHandler = (
	this: IExecuteFunctions,
	index: number,
) => Promise<INodeExecutionData[]>;

export type ResourceOperationHandler = OperationHandler;

export interface ResourceDefinition {
	fields: INodeProperties[];
	handlers: Record<string, OperationHandler>;
	methods?: ResourceMethods;
	name: string;
	operations: INodeProperties[];
}

export interface ResourceMethods {
	listSearch?: Record<string, ListSearchFunction>;
	loadOptions?: Record<string, LoadOptionsFunction>;
}

export class ResourceRegistry {
	private resources = new Map<string, ResourceDefinition>();

	getAllFields(): INodeProperties[] {
		return Array.from(this.resources.values()).flatMap((r) => r.fields);
	}

	getAllListSearch(): Record<string, ListSearchFunction> {
		const allSearch: Record<string, ListSearchFunction> = {};
		for (const resource of this.resources.values()) {
			if (resource.methods?.listSearch) {
				Object.assign(allSearch, resource.methods.listSearch);
			}
		}
		return allSearch;
	}

	getAllLoadOptions(): Record<string, LoadOptionsFunction> {
		const allOptions: Record<string, LoadOptionsFunction> = {};
		for (const resource of this.resources.values()) {
			if (resource.methods?.loadOptions) {
				Object.assign(allOptions, resource.methods.loadOptions);
			}
		}
		return allOptions;
	}

	getAllOperations(): INodeProperties[] {
		return Array.from(this.resources.values()).flatMap((r) => r.operations);
	}

	getHandler(
		resource: string,
		operation: string,
	): OperationHandler | undefined {
		const resourceDef = this.resources.get(resource);
		return resourceDef?.handlers[operation];
	}

	getResourceNames(): string[] {
		return Array.from(this.resources.keys());
	}

	register(resource: ResourceDefinition): void {
		this.resources.set(resource.name, resource);
	}
}
