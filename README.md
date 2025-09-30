# Arweave Name System (ArNS) Manifold.xyz Gallery Template

> This repo is in active development howver the main branch should work. Feel free to [DM on X](https://x.com/kempsterrrr) or the [ARIO discord](https://discord.com/invite/HGG52EtTc2) with feedback or questions.

This template provides a modern, decentralised solution for creating and hosting Manifold Art Galleries on Arweave Name System (ArNS).

## Features

- ⚛️ React (Typescript) + Vite
- 🎨 Modern response UI with Tailwind and Shadcn
- 💾 Permanent storage on Arweave
- 🌐 Hosted on Decentralised smart domains via [Arweave Name System (ArNS)](https://ar.io/arns)
- 🦄 Unique ArNS subdomains for each artwork in your collection.
- ⊹ Decentralised unruggable access via > 400 Gateways in [AR.IO Network](https://ar.io)

## How does this work?

AR.IO Network is a decentralised network of Arweave Gateways with over 400 active gateways. The gateways perform two roles:

1. Serve data stored on Arweave by requesting an Arweave transaction ID like so - gatewayurl/TxID (e.g. arweave.net/TxID).
2. Serve Arweave Name System (ArNS) domains as subdomains.

ArNS domains are simply Arweave transactions ID's associated with a human readable domain name which you can permissionlessly lease or purchase permannetly and retain full control over via the ARIO protocol.

This means as a Manifold creator, you can purchase decentralisd domain which only you control and access this as a subdomain of any of the 100s of gateways in the network, creating the first fully decentralised hosting solution for an Manifold NFT Gallery.

This solutions goes even further by using the ar://wayfinder protocol.

Wayfinder allows you to simple use ar://TxID || ar://arnsname in your app when requesting data from Arwewave (e.g. `<img scr="ar://TxID" />) and will route these request to gateways in the network, decentralising access by removing the need to hard code gateway URLs.

### Using Wayfinder
---

This application implements the Wayfinder protocol from AR.IO Network to provide decentralized access to Arweave content. Here's how it works:

#### Implementation Details

1. **WayfinderProvider**
   - The app uses a `WayfinderProvider` component that wraps the entire application
   - Configurable options include:
     - Network selection (mainnet/testnet)
     - Gateway configuration
     - Priority routing options
     - Verification settings
     - Cache settings
     - HTTP client options

2. **WayfinderImage Component**
   - A custom `WayfinderImage` component that handles Arweave content loading
   - Automatically converts Arweave URLs to the `ar://` protocol
   - Includes fallback handling for failed loads
   - Supports lazy loading and async decoding

3. **URL Resolution**
   - Uses the `useWayfinderUrl` hook to resolve Arweave content URLs
   - Automatically handles gateway routing and verification
   - Provides error handling and fallback mechanisms

#### Usage Example

```tsx
// Using the WayfinderImage component
<WayfinderImage
  src="ar://TxID"  // or "ar://arnsname"
  alt="Description"
  width={800}
  height={600}
  fallbackSrc="/placeholder.svg"
/>
```

#### Benefits

- **Decentralized Access**: Content is served through multiple gateways in the AR.IO Network
- **Automatic Routing**: No need to hardcode gateway URLs
- **Verification**: Optional content verification to ensure data integrity
- **Caching**: Built-in caching for improved performance
- **Error Handling**: Graceful fallbacks for failed content loads

#### Configuration

The Wayfinder implementation can be customized through the `WayfinderProvider` options:

```tsx
<WayfinderProvider
  options={{
    network: 'mainnet',
    usePriorityRouter: true,
    priorityOptions: {
      sortBy: 'operatorStake',
      sortOrder: 'desc',
      limit: 2
    },
    verification: {
      enabled: true,
      timeout: 5000,
      maxRetries: 3
    },
    cache: {
      enabled: true,
      ttl: 3600,
      maxSize: 1000
    }
  }}
>
  {/* Your app content */}
</WayfinderProvider>
```

## Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (v10.10.0 or later)
- Basic understanding of React and TypeScript
- An Arweave wallet
- An Arweave Name System Domain (ArNS) + (check out [this video from Patrick Skinner](https://x.com/ar_io_network/status/1920456149754917127) on how to get yours)
- A Manifold collection contract address

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/arns-manifold-gallery.git
cd arns-manifold-gallery
```

2. Install dependencies:

```bash
pnpm install
```

3. Run `cp .env.example .env` to create your local `.env` file and update the values following the comments in the `.env.example` file.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# RPC URL for fetching NFT metadata, should be specific to the chain your NFT collection was created on
RPC_URL=https://your-ethereum-rpc-url

# Your Manifold NFT contract address (prefixed with VITE_ for frontend access)
VITE_CONTRACT_ADDRESS=0x...

# Your ArNS domain name (e.g., mygallery.ar)
ARNS_NAME=your-arns-name

# Arweave wallet keyfile (base64 encoded)
# You can generate this by running: base64 -i wallet.json
DEPLOY_KEY=your-base64-encoded-wallet
```

> Note: Make sure to keep your `DEPLOY_KEY` secure and never commit it to version control.

4. Run `pnpm run get-metadata` to download the Arweave metadata for your Manifold Collection.

5. Run `pnpm run create-and-assign-undernames` to assign each NFT in your collection a unique subdomian.

6. Run `pnpm run dev` to run your gallery locally http://localhost:5173/

The template has a pre-existing design but feel free to edit this to suit your taste 💅

## Deploy your Manifold Gallery on Arweave Name System (ArNS)

The easiest way to deploy your collection is for the command line:

1. Create a local build of your project

```
pnpm run build
```

2. Uplodate the project to Arweave and assign it your ArNS name using permaweb deploy

_Replace [your-arns-name] with your arns name before running this command._

```
DEPLOY_KEY=$(base64 -i wallet.json) npx permaweb-deploy --arns-name [your-arns-name]
```

It is also possible to deploy this using Github actions. The GH Action is written in `./github/workflows`, it has not been tested yet but should work if you follow the guide here in our docs: https://docs.ar.io/guides/permaweb-deploy.
