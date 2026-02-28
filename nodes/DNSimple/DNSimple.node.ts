import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import { NodeApiError, NodeOperationError } from "n8n-workflow";

import { registry } from "./resources/index";
import { getAccounts } from "./methods/loadOptions";

export class Dnsimple implements INodeType {
  description: INodeTypeDescription = {
    displayName: "DNSimple",
    name: "dnsimple",
    icon: "file:../../icons/dnsimple.svg",
    group: ["transform"],
    subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
    version: 1,
    description: "Interact with DNSimple API for domain management",
    defaults: {
      name: "DNSimple",
    },
    usableAsTool: true,
    inputs: ["main"],
    outputs: ["main"],
    credentials: [
      {
        name: "dnsimpleApi",
        required: true,
      },
    ],
    properties: [
      {
        displayName: "Account Name or ID",
        name: "accountId",
        type: "options",
        typeOptions: {
          loadOptionsMethod: "getAccounts",
        },
        default: "",
        required: true,
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
      },
      {
        displayName: "Resource",
        name: "resource",
        type: "options",
        noDataExpression: true,
        options: [
          { name: "Account", value: "account" },
          { name: "Certificate", value: "certificate" },
          { name: "Contact", value: "contact" },
          { name: "DNS Analytic", value: "dnsAnalytics" },
          { name: "DNSSEC", value: "dnssec" },
          { name: "Domain", value: "domain" },
          { name: "Domain Push", value: "domainPush" },
          { name: "Email Forward", value: "emailForward" },
          { name: "Registrar", value: "registrar" },
          { name: "Service", value: "service" },
          { name: "Template", value: "template" },
          { name: "Template Record", value: "templateRecord" },
          { name: "TLD", value: "tld" },
          { name: "Vanity Name Server", value: "vanityNameServer" },
          { name: "Webhook", value: "webhook" },
          { name: "Zone", value: "zone" },
          { name: "Zone Record", value: "zoneRecord" },
        ],
        default: "domain",
      },
      ...registry.getAllOperations(),
      ...registry.getAllFields(),
    ],
  };

  methods = {
    loadOptions: {
      getAccounts,
      ...registry.getAllLoadOptions(),
    },
    listSearch: registry.getAllListSearch(),
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = this.getNodeParameter("resource", i) as string;
        const operation = this.getNodeParameter("operation", i) as string;

        const handler = registry.getHandler(resource, operation);

        if (!handler) {
          throw new NodeOperationError(
            this.getNode(),
            `Unsupported operation: ${resource}.${operation}`,
            { itemIndex: i },
          );
        }

        const result = await handler.call(this, i);
        returnData.push(...result);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as Error).message },
          });
          continue;
        }
        throw new NodeApiError(this.getNode(), error, { itemIndex: i });
      }
    }

    return [returnData];
  }
}
