# Arweave Name System (ArNS) Manifold Gallery Template

> **Ready to create your own permanent NFT gallery?** Fork this repository and follow the Quick Start guide below. Questions? [DM on X](https://x.com/kempsterrrr) or join the [AR.IO Discord](https://discord.com/invite/HGG52EtTc2).

A production-ready React template for creating permanent, decentralized galleries for [Manifold.xyz](https://manifold.xyz) NFT collections. **Fork this repo**, customize it for your collection, and deploy once to Arweave for permanent, censorship-resistant access through AR.IO's decentralized network.

## Features

- ⚛️ React 19 + TypeScript + Vite 6
- 🎨 Modern responsive UI with Tailwind CSS and shadcn/ui
- 💾 Permanent, immutable storage on Arweave
- 🌐 Decentralized smart domains via [Arweave Name System (ArNS)](https://ar.io/arns)
- 🔗 Individual ArNS subdomains for each artwork (e.g., `1.your-gallery.ar`, `2.your-gallery.ar`)
- 🌍 Decentralized access through 400+ gateways in the [AR.IO Network](https://ar.io)
- 🎭 Optional ASCII art extraction from contract source code
- 🚀 CI/CD ready with GitHub Actions workflow

## How It Works

This template combines several technologies to create a fully decentralized NFT gallery:

### 1. Arweave Permanent Storage
Your gallery is deployed to Arweave, a decentralized storage network that permanently stores data. Unlike traditional hosting, once deployed, your gallery exists forever without recurring hosting fees.

### 2. AR.IO Network & Gateways
The [AR.IO Network](https://ar.io) consists of 400+ decentralized gateways that:
- Serve Arweave data via transaction IDs (e.g., `arweave.net/TxID`)
- Resolve ArNS domains as subdomains (e.g., `your-gallery.arweave.net`)
- Provide redundant, censorship-resistant access to your content

### 3. Arweave Name System (ArNS)
ArNS provides human-readable domains for Arweave content. Instead of sharing complex transaction IDs, you get memorable domains like `my-gallery.ar`. These domains:
- Can be leased or purchased permanently
- Are fully controlled by you (non-custodial)
- Work across all AR.IO gateways automatically
- Support subdomains (undernames) for individual artworks

### 4. Wayfinder Protocol
This gallery uses the `ar://` Wayfinder protocol for decentralized content resolution:

```tsx
// Instead of hardcoding gateway URLs:
<img src="https://arweave.net/TxID" />

// Use the ar:// protocol:
<WayfinderImage src="ar://TxID" />
```

Wayfinder automatically:
- Routes requests to healthy gateways in the AR.IO network
- Implements fallback mechanisms if a gateway fails
- Caches gateway lists locally for performance
- Eliminates single points of failure

### Architecture Flow

1. **Metadata Fetching**: Scripts fetch NFT metadata from your Manifold contract on-chain
2. **Build Process**: Vite builds a static React application with all metadata embedded
3. **Deployment**: The built site is uploaded to Arweave and gets a permanent transaction ID
4. **ArNS Assignment**: Your ArNS domain points to this transaction ID
5. **Subdomain Creation**: Each artwork gets its own subdomain (1, 2, 3, etc.)
6. **Access**: Users visit `your-gallery.ar` through any AR.IO gateway and Wayfinder handles routing

## Technical Implementation

### Wayfinder Integration

The gallery uses AR.IO's Wayfinder protocol throughout:

**App Setup** ([src/App.tsx](src/App.tsx)):
```tsx
<WayfinderProvider gatewaysProvider={new LocalStorageGatewaysProvider({
  ttlSeconds: 3600, // Cache gateways for 1 hour
  gatewaysProvider: new NetworkGatewaysProvider({
    ario: ARIO.mainnet(),
    limit: 10, // Target top 10 gateways by operator stake
    sortBy: 'operatorStake',
    sortOrder: 'desc',
  }),
})}>
  {/* Your app */}
</WayfinderProvider>
```

**Custom Components**:
- `WayfinderImage`: Handles Arweave image loading with `ar://` protocol and fallbacks
- `WayfinderLink`: Creates links to ArNS subdomains for individual artworks
- `ArweaveRedirect`: Routes subdomain traffic to the correct artwork pages

### Data Management

**NFT Metadata** ([src/data/collection_metadata.json](src/data/collection_metadata.json)):
- Fetched from blockchain via `pnpm run get-metadata`
- Structured as `{ "tokenId": { name, description, image, attributes, ... } }`
- Embedded in the build for offline functionality

**ASCII Art** (optional):
- Extracted from contract source code via `pnpm run extract-ascii`
- Stored in [src/assets/contract-ascii-art.txt](src/assets/contract-ascii-art.txt)
- Displayed on landing page for artistic flair

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18+ LTS recommended) - [Download](https://nodejs.org/)
- **pnpm** (v10.10.0+) - Install with `npm install -g pnpm`
- **Arweave Wallet** - Create one at [arweave.app](https://arweave.app) and fund it with AR tokens
- **ArNS Domain** - Lease or purchase from [ArNS](https://arns.app) ([video tutorial](https://x.com/ar_io_network/status/1920456149754917127))
- **Manifold Collection** - A deployed Manifold.xyz NFT collection contract address
- **RPC Access** - A blockchain RPC URL for the chain your collection is on (e.g., Alchemy, Infura, or public RPC)
- **Etherscan API Key** (optional) - For ASCII art extraction ([get one free](https://docs.etherscan.io/getting-an-api-key))

## Quick Start

### 1. Fork and Clone

**Fork this repository** to create your own gallery:

1. Click the **Fork** button at the top right of this repository
2. Clone your forked repository:

```bash
git clone https://github.com/YOUR-USERNAME/arns-manifold-gallery.git
cd arns-manifold-gallery
pnpm install
```

This gives you full control over your gallery's code and allows you to customize it however you like.

### 2. Configure Environment

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Required: Your ArNS domain name (without .ar extension)
ARNS_NAME=my-gallery

# Optional: Subdomain to deploy to (leave empty to deploy to root domain)
UNDER_NAME=

# Required: Base64-encoded Arweave wallet JSON for deployment
# Generate with: base64 -i wallet.json (or base64 -w 0 wallet.json on Linux)
DEPLOY_KEY=eyJ...

# Required: RPC endpoint for your NFT's blockchain
# Examples:
#   Ethereum: https://eth-mainnet.g.alchemy.com/v2/YOUR-KEY
#   Base: https://mainnet.base.org
RPC_URL=https://your-rpc-endpoint

# Required: Your Manifold collection contract address
VITE_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678

# Required: Blockchain network name (used for marketplace links)
# Supported: ethereum, base, polygon, optimism, arbitrum
VITE_CHAIN=base

# Optional: Etherscan API key for ASCII art extraction
ETHERSCAN_API_KEY=ABC123XYZ
```

> **Security Note**: Never commit `.env` or `wallet.json` to version control. They're already in `.gitignore`.

### 3. Fetch NFT Metadata

This script reads your Manifold contract on-chain and downloads all NFT metadata:

```bash
pnpm run get-metadata
```

This creates [src/data/collection_metadata.json](src/data/collection_metadata.json) containing all token information.

### 4. Extract ASCII Art (Optional)

If your contract source code contains ASCII art, extract it for display on your landing page:

```bash
pnpm run extract-ascii
```

### 5. Run Locally

Start the development server:

```bash
pnpm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to preview your gallery. The template includes a pre-built design that you can customize.

### 6. Set Up ArNS Subdomains

**Important**: Each artwork needs its own ArNS subdomain (called "undernames") for decentralized linking.

You must manually create these subdomains through the AR.IO interface:

1. Go to [arns.app](https://arns.app) and connect your wallet
2. Select your ArNS domain
3. Create numeric undernames for each token (e.g., `1`, `2`, `3`, etc.)
4. Point each undername to your main gallery's transaction ID

> **Note**: This step is currently manual. Future versions may automate undername creation.

---

**You're now ready to deploy!** Continue to the [Deployment](#deployment) section below.

## Deployment

### Option 1: Command Line (Recommended)

Build and deploy in one command:

```bash
pnpm run build
npx permaweb-deploy --arns-name $ARNS_NAME --deploy-key "$DEPLOY_KEY"
```

Or deploy to a subdomain:
```bash
npx permaweb-deploy --arns-name $ARNS_NAME --undername $UNDER_NAME --deploy-key "$DEPLOY_KEY"
```

Or use the convenience script:
```bash
pnpm run deploy:arns
```

### Option 2: GitHub Actions (CI/CD)

Your forked repository includes a GitHub Actions workflow for automated deployment.

#### Setup:

1. In your forked repository, go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following **Repository secrets**:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `ARNS_NAME` | Your ArNS domain name | `my-gallery` |
| `UNDER_NAME` | Optional subdomain | `v1` or leave empty |
| `DEPLOY_KEY` | Base64-encoded wallet JSON | `eyJrd...` |
| `RPC_URL` | Blockchain RPC endpoint | `https://mainnet.base.org` |
| `VITE_CONTRACT_ADDRESS` | Manifold contract address | `0x1234...` |
| `VITE_CHAIN` | Blockchain name | `base` |
| `ETHERSCAN_API_KEY` | Optional for ASCII extraction | `ABC123...` |

#### Trigger Deployment:

The workflow automatically runs on:
- Every push to the `main` branch
- Manual trigger via **Actions** tab → **publish** → **Run workflow**

The workflow will:
1. Install dependencies
2. Fetch latest NFT metadata from blockchain
3. Extract ASCII art (if configured)
4. Build the application
5. Deploy to Arweave with your ArNS domain

### Post-Deployment

After deployment:
1. Note the transaction ID from the deployment output
2. Update your ArNS undernames to point to this transaction ID
3. Wait 20-30 minutes for Arweave confirmation and gateway propagation
4. Access your gallery at `https://your-domain.arweave.net` or through any AR.IO gateway

## Customization

This is **your gallery**—customize it however you like! Since you forked the repository, you have complete control over the code.

### Styling
- The template uses Tailwind CSS and shadcn/ui components
- Modify [src/components/](src/components/) to customize the UI
- Update [tailwind.config.js](tailwind.config.js) for theme changes
- Add your own branding, colors, fonts, and layouts

### Gallery Layout
- Main gallery grid: [src/components/nft-gallery.page.tsx](src/components/nft-gallery.page.tsx)
- Individual artwork pages: [src/components/nft-detail-page.tsx](src/components/nft-detail-page.tsx)
- Landing page: [src/components/landing-page.tsx](src/components/landing-page.tsx)

### Metadata Refresh
To update your gallery with new mints, re-run the metadata script and redeploy:

```bash
pnpm run get-metadata
pnpm run build
npx permaweb-deploy --arns-name $ARNS_NAME --deploy-key "$DEPLOY_KEY"
```

> **Tip**: Commit your customizations to your fork so you can easily update and redeploy as your collection grows!

## Project Structure

```
arns-manifold-gallery/
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui base components
│   │   ├── landing-page.tsx
│   │   ├── nft-gallery.page.tsx
│   │   └── wayfinder-*.tsx  # Wayfinder protocol components
│   ├── data/
│   │   └── collection_metadata.json  # Generated NFT metadata
│   ├── assets/              # Static assets and extracted ASCII art
│   ├── scripts/             # Metadata fetching and deployment scripts
│   └── App.tsx              # Main app with Wayfinder setup
├── .github/
│   └── workflows/
│       └── permaweb-deploy.yml  # CI/CD workflow
├── .env.example             # Environment variables template
├── vite.config.ts           # Vite configuration with Node polyfills
└── package.json
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start development server |
| `pnpm run build` | Build for production |
| `pnpm run preview` | Preview production build locally |
| `pnpm run lint` | Run ESLint |
| `pnpm run get-metadata` | Fetch NFT metadata from blockchain |
| `pnpm run extract-ascii` | Extract ASCII art from contract source |
| `pnpm run deploy:arns` | Deploy to ArNS using environment variables |

## Troubleshooting

### Build Errors

**"process is not defined"**
- This was fixed in recent commits. Pull the latest changes and rebuild.

**TypeScript errors**
- Run `pnpm install` to ensure all types are installed
- Check that `node_modules/@types` contains necessary type definitions

### Deployment Issues

**"Invalid deploy key"**
- Ensure your `DEPLOY_KEY` is properly base64-encoded: `base64 -i wallet.json`
- On Linux, use `-w 0` flag: `base64 -w 0 wallet.json`
- Check that you have sufficient AR tokens in your wallet

**"ArNS name not found"**
- Verify you own the ArNS domain at [arns.app](https://arns.app)
- Ensure the wallet you're deploying with is the same one that owns the ArNS domain

### Metadata Fetching

**"No tokens found in the collection"**
- Verify your `VITE_CONTRACT_ADDRESS` is correct
- Check that `RPC_URL` is for the correct network
- Ensure the contract is an ERC721 with `totalSupply()` or has minted tokens

**"Failed to fetch metadata"**
- Check your RPC endpoint is working and has sufficient rate limits
- Verify the contract follows standard Manifold metadata patterns
- Try using a different RPC provider (Alchemy, Infura, public RPC)

## Learn More

- [AR.IO Documentation](https://docs.ar.io)
- [ArNS Guide](https://docs.ar.io/arns)
- [Wayfinder Protocol](https://docs.ar.io/wayfinder)
- [Permaweb Deploy Guide](https://docs.ar.io/guides/permaweb-deploy)
- [Manifold.xyz](https://manifold.xyz)

## Showcase Your Gallery

Built a gallery with this template? We'd love to see it! Share your deployed gallery in:
- The [AR.IO Discord](https://discord.com/invite/HGG52EtTc2) #showcase channel
- Tag [@kempsterrrr](https://x.com/kempsterrrr) on X with your gallery link

## Contributing

Found a bug or have an improvement idea for the template itself? Contributions to the base template are welcome:
- Open issues for bugs or feature requests
- Submit pull requests with improvements
- Help improve documentation

## Support

Need help setting up your gallery?
- DM on X: [@kempsterrrr](https://x.com/kempsterrrr)
- AR.IO Discord: [Join here](https://discord.com/invite/HGG52EtTc2)

## License

MIT License - feel free to use this template for your own galleries!
