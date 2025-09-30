import fs from 'fs';
import axios from 'axios';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import path from 'path';
import { loadEnv } from 'vite';

// Load environment variables using Vite's loadEnv
const env = loadEnv('production', process.cwd(), '');

const RPC_URL = env.RPC_URL || env.ETH_NODE_URL;
const CONTRACT_ADDRESS = env.VITE_CONTRACT_ADDRESS;
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const OUTPUT_FILE = path.join(DATA_DIR, "collection_metadata.json");

// Validate required environment variables
if (!RPC_URL || !CONTRACT_ADDRESS) {
  console.error('Error: Missing required environment variables.');
  console.error('Please ensure RPC_URL (or ETH_NODE_URL) and VITE_CONTRACT_ADDRESS are set in your .env file.');
  process.exit(1);
}

const ERC721_ABI = [
  // Standard ERC721 totalSupply
  { name: 'totalSupply', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  // Alternative totalSupply
  { name: 'totalSupply', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  // ERC721Enumerable totalSupply
  { name: 'totalSupply', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  // tokenURI function
  { name: 'tokenURI', type: 'function', stateMutability: 'view', inputs: [{ name: '_tokenId', type: 'uint256' }], outputs: [{ type: 'string' }] },
  // Alternative tokenURI
  { name: 'tokenURI', type: 'function', stateMutability: 'view', inputs: [{ name: 'tokenId', type: 'uint256' }], outputs: [{ type: 'string' }] },
];

async function findLastTokenId(client, contractAddress) {
  let left = 1n;
  let right = 10000n; // Start with a reasonable upper bound
  let lastValidId = 0n;

  while (left <= right) {
    const mid = (left + right) / 2n;
    try {
      await client.readContract({
        address: contractAddress,
        abi: ERC721_ABI,
        functionName: 'tokenURI',
        args: [mid]
      });
      // If we can read this token, it exists
      lastValidId = mid;
      left = mid + 1n;
    } catch (_error) {
      // If we can't read this token, it doesn't exist
      right = mid - 1n;
    }
  }

  // Double check the next token doesn't exist
  try {
    await client.readContract({
      address: contractAddress,
      abi: ERC721_ABI,
      functionName: 'tokenURI',
      args: [lastValidId + 1n]
    });
    // If we can read the next token, our binary search didn't find the last one
    console.log('Warning: Binary search might not have found the last token. Consider increasing the upper bound.');
  } catch (_error) {
    // This is what we expect - the next token doesn't exist
  }

  return lastValidId;
}

async function fetchAllMetadata(contractAddress) {
  const transport = http(RPC_URL);
  const client = createPublicClient({
    chain: mainnet,
    transport
  });

  let supply;
  try {
    // Try to get supply using different methods
    try {
      supply = await client.readContract({
        address: contractAddress,
        abi: ERC721_ABI,
        functionName: 'totalSupply'
      });
      console.log('Successfully got totalSupply from contract');
    } catch (_error) {
      console.log('Failed to get totalSupply, using binary search to find last token...');
      supply = await findLastTokenId(client, contractAddress);
      console.log(`Found last token ID: ${supply.toString()}`);
    }
  } catch (error) {
    throw new Error(`Could not determine total supply: ${error}`);
  }

  if (supply === 0n) {
    throw new Error('No tokens found in the collection');
  }

  console.log(`Found totalSupply = ${supply.toString()} tokens`);

  const allMetadata = {};
  for (let tokenId = 1n; tokenId <= supply; tokenId++) {
    try {
      let uri = await client.readContract({
        address: contractAddress,
        abi: ERC721_ABI,
        functionName: 'tokenURI',
        args: [tokenId]
      });
      if (uri.startsWith('ipfs://')) uri = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
      const response = await axios.get(uri, { timeout: 10000 });
      allMetadata[tokenId.toString()] = response.data;
      console.log(`Fetched metadata for token ${tokenId.toString()}`);
    } catch (error) {
      console.warn(`⚠️ Skipped token ${tokenId.toString()}: ${error}`);
    }
  }

  return allMetadata;
}

(async () => {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    const metadata = await fetchAllMetadata(CONTRACT_ADDRESS);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(metadata, null, 2));
    console.log(`\n✅ All metadata written to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
})();
