# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an ArNS (Arweave Name System) Manifold NFT Gallery - a React TypeScript application that creates decentralized galleries for Manifold art collections. The app is built with Vite and deployed permanently on Arweave using ArNS domains.

## Key Architecture

### Wayfinder Integration
The application uses AR.IO's Wayfinder protocol for decentralized Arweave content access:
- `WayfinderProvider` wraps the entire app with gateway configuration
- `WayfinderImage` component handles Arweave image loading with ar:// protocol
- `WayfinderLink` component creates decentralized links to ArNS subdomains
- Uses `LocalStorageGatewaysProvider` with `NetworkGatewaysProvider` for gateway caching and routing

### Data Flow
1. NFT metadata is fetched from Ethereum RPC and stored in `src/data/collection_metadata.json`
2. Each NFT gets assigned a unique ArNS subdomain (e.g., "1_anoncast-x-manifold.ar")
3. The gallery renders using metadata and displays images via Wayfinder protocol
4. Each artwork links to its permanent ArNS subdomain

### Core Components
- `App.tsx`: Main application with WayfinderProvider setup and collection overview
- `NFTGallery`: Grid display of NFTs with modal dialogs
- `WayfinderImage`: Custom image component for Arweave content with fallbacks
- `WayfinderLink`: Custom link component for ArNS subdomains

## Essential Commands

### Development
```bash
pnpm install          # Install dependencies
pnpm run dev          # Start development server (http://localhost:5173)
pnpm run build        # Build for production (includes TypeScript compilation)
pnpm run preview      # Preview production build
pnpm run lint         # Run ESLint
```

### Collection Setup
```bash
pnpm run get-metadata # Fetch NFT metadata from blockchain
```

Note: ArNS subdomain creation is handled manually through AR.IO tools, not via an npm script.

### Deployment
```bash
pnpm run deploy:arns              # Deploy to ArNS (requires DEPLOY_KEY and ARNS_NAME env vars)
# Or manually:
DEPLOY_KEY=$(base64 -i wallet.json) npx permaweb-deploy --arns-name [your-arns-name]
```

## Environment Variables

Required in `.env`:
- `ARNS_NAME`: Your ArNS domain name (e.g., "mygallery")
- `DEPLOY_KEY`: Base64-encoded Arweave wallet JSON (see AR.IO permaweb-deploy docs)
- `ETH_NODE_URL`: RPC URL for the blockchain network (typically Ethereum/Base)
- `CONTRACT_ADDRESS`: Manifold collection contract address

Build-time variables (prefixed with `VITE_`):
- `VITE_CONTRACT_ADDRESS`: Used in frontend for contract links
- `VITE_CHAIN`: Chain identifier for marketplace links

## Project Structure

- `src/scripts/`: Node.js scripts for blockchain data fetching and ArNS management
- `src/components/`: React components including UI components from shadcn/ui
- `src/data/`: Generated collection metadata JSON file
- `src/assets/`: Static assets including chain and marketplace logos
- `wallet.json`: Arweave wallet file (not in git, required for ArNS operations)

## Key Dependencies

- `@ar.io/sdk`: ArNS domain management
- `@ar.io/wayfinder-core` & `@ar.io/wayfinder-react`: Decentralized Arweave access
- `viem`: Ethereum blockchain interactions
- `axios`: HTTP requests for metadata fetching
- React 19 + Vite 6 + TypeScript
- Tailwind CSS + shadcn/ui components

## Development Notes

- The app uses pnpm as the package manager (v10.10.0+)
- Vite config includes Node.js polyfills for browser compatibility with Arweave SDKs
- TypeScript path aliases: `@/*` maps to `src/*`
- Images are served through Arweave gateways via the Wayfinder protocol
- Each NFT gets a numeric subdomain (1, 2, 3, etc.) rather than name-based ones