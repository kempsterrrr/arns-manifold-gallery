# Quick Start Guide: Deploy Your Own NFT Gallery

This guide will help you create your own permanent NFT gallery on Arweave using GitHub Actions - no coding or local setup required!

## What You'll Need

1. A GitHub account (free at [github.com](https://github.com))
2. A Manifold NFT collection contract address
3. An Arweave wallet with AR tokens (for deployment costs)
4. An ArNS domain name (purchased from [ar.io](https://ar.io))

## Step 1: Fork This Repository

1. Go to this project's GitHub page
2. Click the **"Fork"** button in the top-right corner
3. Select your GitHub account as the destination
4. Wait for GitHub to create your personal copy

## Step 2: Prepare Your Arweave Wallet

You'll need to convert your Arweave wallet to a special format:

1. Open your Arweave wallet JSON file in a text editor
2. Copy the entire contents
3. Go to a base64 encoder website (like [base64encode.org](https://www.base64encode.org))
4. Paste your wallet JSON and encode it
5. Copy the encoded result - you'll need this in the next step

## Step 3: Configure GitHub Secrets

GitHub Secrets store your sensitive information securely. In your forked repository:

1. Click **"Settings"** (top menu)
2. Click **"Secrets and variables"** → **"Actions"** (left sidebar)
3. Click **"New repository secret"** and add each of these:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `DEPLOY_KEY` | Your base64-encoded Arweave wallet | (the long encoded string from Step 2) |
| `ARNS_NAME` | Your ArNS domain name (without .ar) | `my-art-gallery` |
| `RPC_URL` | Blockchain RPC endpoint | Get free key from [alchemy.com](https://www.alchemy.com) |
| `VITE_CONTRACT_ADDRESS` | Your Manifold contract address | `0x1234...` |
| `VITE_CHAIN` | Blockchain network name | `ethereum`, `base`, `polygon`, etc. |
| `ETHERSCAN_API_KEY` | (Optional) For ASCII art extraction | Get from [etherscan.io](https://etherscan.io/apis) |
| `UNDER_NAME` | (Optional) ArNS subdomain | Leave empty unless using undernames |

### Getting an RPC URL

The RPC URL lets the app read your NFT collection from the blockchain:

1. Sign up for free at [Alchemy](https://www.alchemy.com) or [Infura](https://infura.io)
2. Create a new app for your blockchain network (Ethereum, Base, etc.)
3. Copy the HTTPS URL and save it as the `RPC_URL` secret

## Step 4: Deploy Your Gallery

Once your secrets are configured, deployment is automatic:

### Option A: Deploy Now
1. Go to the **"Actions"** tab in your repository
2. Click **"publish"** in the left sidebar
3. Click **"Run workflow"** button
4. Click the green **"Run workflow"** button to start

### Option B: Deploy on Every Update
Just push any changes to the `main` branch, and GitHub Actions will automatically:
- Fetch your NFT collection metadata
- Extract any ASCII art from your contract
- Build the gallery
- Deploy to your ArNS domain

## Step 5: Monitor Deployment

1. Go to the **"Actions"** tab to watch the deployment progress
2. The workflow takes 2-5 minutes to complete
3. If successful, you'll see a green checkmark ✓
4. If it fails, click on the failed run to see error details

## Step 6: View Your Live Gallery

After deployment completes (allow 10-30 minutes for Arweave propagation):

- Visit: `https://your-gallery-name.ar-io.dev`
- Or: `https://your-gallery-name.ar` (once DNS propagates fully)

If you used an undername: `https://undername_your-gallery-name.ar-io.dev`

## Updating Your Gallery

Whenever you want to update your gallery:

1. Go to **"Actions"** tab
2. Click **"publish"** workflow
3. Click **"Run workflow"** → **"Run workflow"**

Or simply push any change to your `main` branch to trigger automatic deployment.

Each deployment creates a new permanent version on Arweave and updates your ArNS domain to point to it.

## Customization (Optional)

If you want to customize the gallery appearance or content:

1. Edit files directly on GitHub:
   - Click on the file you want to edit
   - Click the pencil icon (✏️) to edit
   - Make your changes
   - Click **"Commit changes"**
2. The gallery will automatically redeploy with your changes

## Troubleshooting

**Deployment fails with "Insufficient funds"**
- Add more AR tokens to your Arweave wallet

**"Invalid DEPLOY_KEY" error**
- Make sure you base64-encoded your entire wallet JSON
- Check there are no extra spaces or line breaks in the secret

**NFTs not showing up**
- Verify your `VITE_CONTRACT_ADDRESS` is correct
- Check that your `RPC_URL` is valid and for the correct network
- Ensure `VITE_CHAIN` matches your contract's blockchain

**"Unauthorized" or ArNS errors**
- Verify your ArNS domain exists and your wallet owns it
- Check that your `ARNS_NAME` is correct (without .ar suffix)

**Workflow fails on "Fetch NFT metadata"**
- Your RPC URL may be invalid or rate-limited
- Try using a different RPC provider

## Cost Estimate

- **ArNS domain**: ~10-100 AR (one-time purchase)
- **Each deployment**: ~0.1-0.5 AR
- **Total storage**: Permanent - no recurring hosting fees!

## Getting Help

- Check the main [README.md](README.md) for technical details
- Open an issue on the GitHub repository
- Visit [ar.io/docs](https://ar.io/docs) for ArNS documentation
- Check [docs.manifold.xyz](https://docs.manifold.xyz) for Manifold contract info

## Next Steps

Once your gallery is live:
- Share your permanent `https://your-name.ar` URL
- Add new NFTs to your collection (they'll appear on the next deployment)
- Customize the gallery styling by editing the source files
- Set up custom undernames for individual artworks

Congratulations on creating your permanent, decentralized NFT gallery! 🎨
