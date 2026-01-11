# n8n-nodes-dnsimple

n8n community node for integrating DNSimple DNS and domain management with your workflows.

## Table of Contents

- [Installation](#installation)
- [Credentials](#credentials)
- [Operations](#operations)
- [Compatibility](#compatibility)
- [Development Notes](#development-notes)
- [Resources](#resources)
- [Version History](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

1. Go to **Settings** > **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-dnsimple` in the **npm Package Name** field
4. Agree to the risks of using community nodes
5. Select **Install**

## Credentials

### DNSimple API Token

1. Log in to your DNSimple account
2. Go to **Account** > **Access Tokens**
3. Click **New access token** (User or Account token)
4. Copy the generated token
5. In n8n: Create new credential > **DNSimple API**
6. Select **Environment** (Production or Sandbox)
7. Paste your API token
8. Save

**Token Types:**
- **Account tokens**: Access to a single account's resources (recommended)
- **User tokens**: Access to all accounts the user has access to

**Environments:**
- **Production**: `https://api.dnsimple.com`
- **Sandbox**: `https://api.sandbox.dnsimple.com` (for testing)

## Operations

### Account

| Operation | Description |
|-----------|-------------|
| List | List all accounts accessible with the current token |

### Certificate

| Operation | Description |
|-----------|-------------|
| Download | Download a certificate |
| Get | Get certificate details |
| Get Private Key | Get certificate private key |
| Issue | Issue a pending certificate |
| List | List certificates for a domain |
| Order | Order a new Let's Encrypt certificate |
| Renew | Renew an existing certificate |

### Contact

| Operation | Description |
|-----------|-------------|
| Create | Create a new contact |
| Delete | Delete a contact |
| Get | Get contact details |
| List | List all contacts |
| Update | Update a contact |

### DNS Analytics

| Operation | Description |
|-----------|-------------|
| Query | Query DNS analytics data |

### DNSSEC

| Operation | Description |
|-----------|-------------|
| Create DS Record | Create a delegation signer record |
| Delete DS Record | Delete a delegation signer record |
| Disable | Disable DNSSEC for a domain |
| Enable | Enable DNSSEC for a domain |
| Get DS Record | Get a delegation signer record |
| Get Status | Get DNSSEC status for a domain |
| List DS Records | List delegation signer records |

### Domain

| Operation | Description |
|-----------|-------------|
| Create | Add a domain to an account |
| Delete | Delete a domain |
| Get | Get domain details |
| List | List all domains |

### Domain Push

| Operation | Description |
|-----------|-------------|
| Accept | Accept a domain push |
| Initiate | Initiate a domain push to another account |
| List | List pending domain pushes |
| Reject | Reject a domain push |

### Email Forward

| Operation | Description |
|-----------|-------------|
| Create | Create an email forward |
| Delete | Delete an email forward |
| Get | Get email forward details |
| List | List email forwards for a domain |

### Registrar

| Operation | Description |
|-----------|-------------|
| Check Availability | Check domain availability |
| Get Prices | Get domain registration prices |
| Register | Register a new domain |
| Renew | Renew a domain registration |
| Transfer | Transfer a domain to DNSimple |

### Service

| Operation | Description |
|-----------|-------------|
| Apply | Apply a one-click service to a domain |
| List | List all available one-click services |
| List Applied | List services applied to a domain |
| Unapply | Remove a one-click service from a domain |

### Template

| Operation | Description |
|-----------|-------------|
| Apply to Domain | Apply a template to a domain |
| Create | Create a new template |
| Delete | Delete a template |
| Get | Get template details |
| List | List all templates |
| Update | Update a template |

### Template Record

| Operation | Description |
|-----------|-------------|
| Create | Create a record in a template |
| Delete | Delete a record from a template |
| Get | Get template record details |
| List | List records in a template |

### TLD

| Operation | Description |
|-----------|-------------|
| Get | Get TLD details |
| List | List all supported TLDs |

### Vanity Name Server

| Operation | Description |
|-----------|-------------|
| Disable | Disable vanity name servers for a domain |
| Enable | Enable vanity name servers for a domain |

### Webhook

| Operation | Description |
|-----------|-------------|
| Create | Create a webhook |
| Delete | Delete a webhook |
| Get | Get webhook details |
| List | List all webhooks |

### Zone

| Operation | Description |
|-----------|-------------|
| Activate | Activate DNS resolution for a zone |
| Check Distribution | Check zone distribution across DNSimple name servers |
| Deactivate | Deactivate DNS resolution for a zone |
| Download File | Download zone file |
| Get | Get zone details |
| List | List all zones |

### Zone Record

| Operation | Description |
|-----------|-------------|
| Check Distribution | Check record distribution across name servers |
| Create | Create a DNS record |
| Delete | Delete a DNS record |
| Get | Get DNS record details |
| List | List DNS records in a zone |
| Update | Update a DNS record |

## Compatibility

Tested with:

- n8n Version: 2.2.3
- Node Version: 22.11.0

## Development Notes

### Kill n8n Process

Add this alias to your `~/.zshrc` for quick n8n process termination during development:

```bash
alias kill-n8n="kill -9 \$(lsof -ti tcp:5678 -sTCP:LISTEN)"
```

After adding, reload your shell: `source ~/.zshrc`

### Publish New Release

```
# Bump the version
npm version patch|minor|major
```

```
# push the tag to GitHub
git push origin v1.2.3
```

### Add MCP Server to Zed IDE

"Add custom Server..." -> "Configure Remote" -> "Add Server"

```
{
  /// The name of your remote MCP server
  "n8n-mcp": {
    /// The URL of the remote MCP server
    "url": "http://localhost:5678/mcp-server/http",
    "headers": {
    /// Any headers to send along
    "Authorization": "Bearer <TOKEN>"
    }
  }
}
```
Available Tools:		
- execute_workflow	
- get_workflow_details
- search_workflows

## Resources

- [n8n Website](https://n8n.io/)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [n8n Documentation for LLMs](https://docs.n8n.io/llms.txt)

- [DNSimple Website](https://dnsimple.com/)
- [DNSimple – API Libraries](https://dnsimple.com/api)
- [DNSimple – API Documentation](https://developer.dnsimple.com/)
- [DNSimple – Sandbox Environment](https://developer.dnsimple.com/sandbox/)
- [DNSimple – Logos](https://dnsimple.com/logos)

- [GitHub Repository](https://github.com/hansdoebel/n8n-nodes-dnsimple)
- [@n8n/node-cli README](https://raw.githubusercontent.com/n8n-io/n8n/refs/heads/master/packages/%40n8n/node-cli/README.md)


## Version History

- `0.0.1` - Initial release
