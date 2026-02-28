<h1 align="center">
  <br>
  n8n-nodes-dnsimple
  <br>
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/n8n-nodes-dnsimple"><img src="https://img.shields.io/npm/v/n8n-nodes-dnsimple.svg" alt="NPM Version"></a>
  <a href="https://github.com/hansdoebel/n8n-nodes-dnsimple/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/hansdoebel/n8n-nodes-dnsimple" alt="GitHub License"></a>
  <a href="https://www.npmjs.com/package/n8n-nodes-dnsimple"><img src="https://img.shields.io/npm/dt/n8n-nodes-dnsimple.svg" alt="NPM Downloads"></a>
  <a href="https://www.npmjs.com/package/n8n-nodes-dnsimple"><img src="https://img.shields.io/npm/last-update/n8n-nodes-dnsimple" alt="NPM Last Update"></a>
  <img src="https://img.shields.io/badge/n8n-2.9.4-blue" alt="n8n 2.9.4">
</p>

<p align="center">
  <a href="#installation">Installation</a> |
  <a href="#credentials">Credentials</a> |
  <a href="#resources">Resources</a> |
  <a href="#development">Development</a> |
  <a href="#license">License</a>
</p>

---

An n8n community node for integrating [DNSimple](https://dnsimple.com) DNS and domain management with your workflows.

## Installation

1. Make a new workflow or open an existing one
2. Open the nodes panel by selecting **+** or pressing **Tab**
3. Search for **DNSimple**
4. Select **Install** to install the node for your instance

## Credentials

1. Log in to your [DNSimple](https://dnsimple.com) account
2. Go to **Account** > **Access Tokens**
3. Click **New access token** (User or Account token)
4. Copy the generated token
5. In n8n, create a new **DNSimple API** credential
6. Select the **Environment** (Production or Sandbox)
7. Paste your API token and save

**Token Types:**
- **Account tokens** -- access to a single account's resources (recommended)
- **User tokens** -- access to all accounts the user has access to

**Environments:**
- **Production** -- `https://api.dnsimple.com`
- **Sandbox** -- `https://api.sandbox.dnsimple.com` (for testing)

## Resources

<details>
<summary><strong>Account</strong></summary>

| Operation | Description |
| --------- | ----------- |
| List | List all accounts accessible with the current token |

</details>

<details>
<summary><strong>Certificate</strong></summary>

| Operation | Description |
| --------- | ----------- |
| Download | Download a certificate |
| Get | Get certificate details |
| Get Private Key | Get certificate private key |
| Issue | Issue a pending certificate |
| List | List certificates for a domain |
| Order | Order a new Let's Encrypt certificate |
| Renew | Renew an existing certificate |

</details>

<details>
<summary><strong>Contact</strong></summary>

| Operation | Description |
| --------- | ----------- |
| Create | Create a new contact |
| Delete | Delete a contact |
| Get | Get contact details |
| List | List all contacts |
| Update | Update a contact |

</details>

<details>
<summary><strong>DNS Analytics</strong></summary>

| Operation | Description |
| --------- | ----------- |
| Query | Query DNS analytics data |

</details>

<details>
<summary><strong>DNSSEC</strong></summary>

| Operation | Description |
| --------- | ----------- |
| Create DS Record | Create a delegation signer record |
| Delete DS Record | Delete a delegation signer record |
| Disable | Disable DNSSEC for a domain |
| Enable | Enable DNSSEC for a domain |
| Get DS Record | Get a delegation signer record |
| Get Status | Get DNSSEC status for a domain |
| List DS Records | List delegation signer records |

</details>

<details>
<summary><strong>Domain</strong></summary>

| Operation | Description |
| --------- | ----------- |
| Create | Add a domain to an account |
| Delete | Delete a domain |
| Get | Get domain details |
| List | List all domains |

</details>

<details>
<summary><strong>Domain Push</strong></summary>

| Operation | Description |
| --------- | ----------- |
| Accept | Accept a domain push |
| Initiate | Initiate a domain push to another account |
| List | List pending domain pushes |
| Reject | Reject a domain push |

</details>

<details>
<summary><strong>Email Forward</strong></summary>

| Operation | Description |
| --------- | ----------- |
| Create | Create an email forward |
| Delete | Delete an email forward |
| Get | Get email forward details |
| List | List email forwards for a domain |

</details>

<details>
<summary><strong>Registrar</strong></summary>

| Operation | Description |
| --------- | ----------- |
| Check Availability | Check domain availability |
| Get Prices | Get domain registration prices |
| Register | Register a new domain |
| Renew | Renew a domain registration |
| Transfer | Transfer a domain to DNSimple |

</details>

<details>
<summary><strong>Service</strong></summary>

| Operation | Description |
| --------- | ----------- |
| Apply | Apply a one-click service to a domain |
| List | List all available one-click services |
| List Applied | List services applied to a domain |
| Unapply | Remove a one-click service from a domain |

</details>

<details>
<summary><strong>Template</strong></summary>

| Operation | Description |
| --------- | ----------- |
| Apply to Domain | Apply a template to a domain |
| Create | Create a new template |
| Delete | Delete a template |
| Get | Get template details |
| List | List all templates |
| Update | Update a template |

</details>

<details>
<summary><strong>Template Record</strong></summary>

| Operation | Description |
| --------- | ----------- |
| Create | Create a record in a template |
| Delete | Delete a record from a template |
| Get | Get template record details |
| List | List records in a template |

</details>

<details>
<summary><strong>TLD</strong></summary>

| Operation | Description |
| --------- | ----------- |
| Get | Get TLD details |
| List | List all supported TLDs |

</details>

<details>
<summary><strong>Vanity Name Server</strong></summary>

| Operation | Description |
| --------- | ----------- |
| Disable | Disable vanity name servers for a domain |
| Enable | Enable vanity name servers for a domain |

</details>

<details>
<summary><strong>Webhook</strong></summary>

| Operation | Description |
| --------- | ----------- |
| Create | Create a webhook |
| Delete | Delete a webhook |
| Get | Get webhook details |
| List | List all webhooks |

</details>

<details>
<summary><strong>Zone</strong></summary>

| Operation | Description |
| --------- | ----------- |
| Activate | Activate DNS resolution for a zone |
| Check Distribution | Check zone distribution across DNSimple name servers |
| Deactivate | Deactivate DNS resolution for a zone |
| Download File | Download zone file |
| Get | Get zone details |
| List | List all zones |

</details>

<details>
<summary><strong>Zone Record</strong></summary>

| Operation | Description |
| --------- | ----------- |
| Check Distribution | Check record distribution across name servers |
| Create | Create a DNS record |
| Delete | Delete a DNS record |
| Get | Get DNS record details |
| List | List DNS records in a zone |
| Update | Update a DNS record |

</details>

## Development

```bash
git clone https://github.com/hansdoebel/n8n-nodes-dnsimple.git
cd n8n-nodes-dnsimple
npm install
npm run build
npm run lint
```

## License

[MIT](LICENSE.md)

<p align="center">
  <a href="https://github.com/hansdoebel/n8n-nodes-dnsimple">GitHub</a> |
  <a href="https://github.com/hansdoebel/n8n-nodes-dnsimple/issues">Issues</a> |
  <a href="https://developer.dnsimple.com">DNSimple API Docs</a>
</p>
