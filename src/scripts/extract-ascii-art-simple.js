import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { loadEnv } from 'vite';

// Load environment variables using Vite's loadEnv
const env = loadEnv('production', process.cwd(), '');

const CONTRACT_ADDRESS = env.VITE_CONTRACT_ADDRESS;
const CHAIN = env.VITE_CHAIN || 'ethereum';
const DEMO_MODE = process.argv.includes('--demo');

// Validate required environment variables
if (!CONTRACT_ADDRESS && !DEMO_MODE) {
  console.error('Error: Missing VITE_CONTRACT_ADDRESS in .env file.');
  console.error('Tip: Use --demo flag to test with sample ASCII art');
  process.exit(1);
}

// Chain ID mappings for Etherscan V2 API
const CHAIN_IDS = {
  ethereum: 1,
  mainnet: 1,
  base: 8453,
  polygon: 137,
  optimism: 10,
  arbitrum: 42161,
  sepolia: 11155111,
  goerli: 5,
  bsc: 56,
  avalanche: 43114
};

function getChainId(chain) {
  const chainId = CHAIN_IDS[chain.toLowerCase()];
  if (!chainId) {
    console.warn(`⚠️ Unknown chain: ${chain}. Defaulting to Ethereum (chainId: 1)`);
    return 1;
  }
  return chainId;
}

async function fetchContractSource(contractAddress, chain) {
  const chainId = getChainId(chain);
  const apiKey = env.ETHERSCAN_API_KEY || 'YourApiKeyToken';

  const url = `https://api.etherscan.io/v2/api?chainid=${chainId}&module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const result = response.data.result[0];

    if (!result.SourceCode) {
      throw new Error('No source code found for this contract');
    }

    return result.SourceCode;
  } catch (error) {
    console.error('Error fetching contract source:', error.message);
    throw error;
  }
}

function extractAsciiArtSimple(sourceCode, contractName) {
  console.log(`🔍 Looking for ASCII art in ${contractName}.sol...`);

  // Parse multi-file format if needed
  let parsedSources;
  if (sourceCode.startsWith('{{')) {
    const jsonStr = sourceCode.slice(1, -1);
    const parsed = JSON.parse(jsonStr);
    parsedSources = parsed.sources || parsed; // Handle different structures
  } else {
    // Single file format
    parsedSources = { [`contracts/${contractName}.sol`]: { content: sourceCode } };
  }

  // Find the main contract file - try different possible names
  const possibleNames = [
    `contracts/${contractName}.sol`,
    `${contractName}.sol`,
    `contracts/manifold/${contractName}.sol`
  ];

  let mainFile = null;
  let actualFileName = '';

  for (const fileName of possibleNames) {
    if (parsedSources[fileName]) {
      mainFile = parsedSources[fileName];
      actualFileName = fileName;
      break;
    }
  }

  // If not found, try to find any .sol file with the contract name
  if (!mainFile) {
    const matchingFiles = Object.keys(parsedSources).filter(name =>
      name.includes(contractName) && name.endsWith('.sol')
    );
    if (matchingFiles.length > 0) {
      actualFileName = matchingFiles[0];
      mainFile = parsedSources[actualFileName];
    }
  }

  if (!mainFile) {
    console.error(`❌ Could not find main contract file. Tried: ${possibleNames.join(', ')}`);
    return null;
  }

  const fileContent = mainFile.content;
  console.log(`📄 Found ${actualFileName} (${fileContent.length} chars)`);

  // Find ASCII art between import and contract markers

  // Find ASCII art between the two markers - try multiple possible import statements
  const possibleImports = [
    'import "./manifold/ERC721Creator.sol";',
    'import "./ERC1155Creator.sol";',
    'import "./ERC721Creator.sol";',
    'import "@manifold-xyz/creator-core-solidity/contracts/ERC721Creator.sol";'
  ];

  const contractMarker = /^contract\s+/m;

  let importIndex = -1;
  let foundImport = '';

  for (const importStatement of possibleImports) {
    importIndex = fileContent.indexOf(importStatement);
    if (importIndex !== -1) {
      foundImport = importStatement;
      break;
    }
  }

  if (importIndex === -1) {
    console.error(`❌ Could not find any import marker. Tried: ${possibleImports.join(', ')}`);
    return null;
  }

  console.log(`✅ Found import marker: ${foundImport}`);

  const contractMatch = fileContent.match(contractMarker);
  if (!contractMatch) {
    console.error(`❌ Could not find contract declaration`);
    return null;
  }

  const contractIndex = contractMatch.index;

  // Extract the section between markers
  const startPos = importIndex + foundImport.length;
  const endPos = contractIndex;
  const section = fileContent.slice(startPos, endPos);

  console.log(`📍 Extracted section between markers (${section.length} chars)`);

  // Find comment blocks in this section
  const commentBlocks = section.match(/(?:\/\/[^\n]*\n)+/g);

  if (!commentBlocks || commentBlocks.length === 0) {
    console.log(`ℹ️ No comment blocks found in the target section`);
    return null;
  }

  console.log(`💬 Found ${commentBlocks.length} comment block(s)`);

  // Find the largest comment block (most likely to be ASCII art)
  let bestBlock = '';
  for (const block of commentBlocks) {
    const cleaned = block.trim();
    const lineCount = cleaned.split('\n').length;

    console.log(`  📝 Block: ${lineCount} lines, ${cleaned.length} chars`);

    // Keep the block if it's longer than our current best
    if (cleaned.length > bestBlock.length) {
      bestBlock = cleaned;
    }
  }

  if (!bestBlock) {
    console.log(`❌ No suitable ASCII art found`);
    return null;
  }

  console.log(`✨ Selected best block: ${bestBlock.split('\n').length} lines, ${bestBlock.length} chars`);

  // The ASCII art likely includes // as part of the border, so keep them
  return bestBlock;
}

function updateReactComponents(asciiArt) {
  console.log(`📝 Updating React components with ASCII art...`);

  const landingPagePath = path.join(process.cwd(), 'src/components/landing-page.tsx');
  const homePagePath = path.join(process.cwd(), 'src/components/home-page.tsx');

  // Format ASCII art for JSX
  const formattedArt = asciiArt
    .replace(/\\/g, '\\\\')  // Escape backslashes
    .replace(/`/g, '\\`')    // Escape backticks
    .replace(/\$/g, '\\$');  // Escape dollar signs

  const asciiComponent = `            {/* ASCII Art from Contract */}
            <div className="mb-8">
              <pre className="text-xs text-muted-foreground font-mono text-center max-w-full overflow-x-auto whitespace-pre">
                {${JSON.stringify(formattedArt)}}
              </pre>
            </div>`;

  // Update landing page
  if (fs.existsSync(landingPagePath)) {
    let content = fs.readFileSync(landingPagePath, 'utf8');

    // Remove existing ASCII art section
    content = content.replace(/\s*{\/\* ASCII Art from Contract \*\/}[\s\S]*?<\/div>/g, '');

    // Insert new ASCII art before the marketplace links
    const insertPoint = content.indexOf('<div className="flex items-center justify-center gap-4 pt-4">');
    if (insertPoint !== -1) {
      content = content.slice(0, insertPoint) + asciiComponent + '\n            ' + content.slice(insertPoint);
    }

    fs.writeFileSync(landingPagePath, content);
    console.log(`✅ Updated landing-page.tsx`);
  }

  // Update home page (gallery page)
  if (fs.existsSync(homePagePath)) {
    let content = fs.readFileSync(homePagePath, 'utf8');

    // Remove existing ASCII art section
    content = content.replace(/\s*{\/\* ASCII Art from Contract \*\/}[\s\S]*?<\/div>/g, '');

    // Insert new ASCII art before NFTGallery
    const insertPoint = content.indexOf('<NFTGallery />');
    if (insertPoint !== -1) {
      const homeAsciiComponent = `        {/* ASCII Art from Contract */}
        <div className="mb-8">
          <pre className="text-xs text-muted-foreground font-mono text-center max-w-full overflow-x-auto whitespace-pre">
            {${JSON.stringify(formattedArt)}}
          </pre>
        </div>

        `;
      content = content.slice(0, insertPoint) + homeAsciiComponent + content.slice(insertPoint);
    }

    fs.writeFileSync(homePagePath, content);
    console.log(`✅ Updated home-page.tsx`);
  }
}

async function main() {
  if (DEMO_MODE) {
    console.log(`🎭 Running in DEMO mode with sample ASCII art...`);
    const demoArt = `///////////////////////////////////////////////////
//                                               //
//                DEMO ASCII ART                 //
//            ┌─────────────────────┐             //
//            │   NFT Collection    │             //
//            └─────────────────────┘             //
//                                               //
///////////////////////////////////////////////////`;

    console.log(`🎨 Demo ASCII art:\n${demoArt}`);

    // Save to file
    const outputPath = path.join(process.cwd(), 'src/assets/contract-ascii-art.txt');
    fs.writeFileSync(outputPath, demoArt);
    console.log(`💾 Saved demo ASCII art to: ${outputPath}`);

    // Update components
    updateReactComponents(demoArt);
    console.log(`🎉 Demo completed!`);
    return;
  }

  console.log(`🚀 Starting simplified ASCII art extraction for contract ${CONTRACT_ADDRESS} on ${CHAIN}...`);

  try {
    // Fetch contract source
    console.log(`🔍 Fetching contract source code...`);
    const sourceCode = await fetchContractSource(CONTRACT_ADDRESS, CHAIN);

    // Extract contract name from address (simplified - using environment or default)
    const contractName = env.CONTRACT_NAME || 'Anonworld';
    console.log(`📝 Contract name: ${contractName}`);

    // Extract ASCII art
    const asciiArt = extractAsciiArtSimple(sourceCode, contractName);

    if (!asciiArt) {
      console.error(`❌ No ASCII art found in contract`);
      process.exit(1);
    }

    console.log(`🎨 Found ASCII art:\n${asciiArt}`);

    // Save to file
    const outputPath = path.join(process.cwd(), 'src/assets/contract-ascii-art.txt');
    fs.writeFileSync(outputPath, asciiArt);
    console.log(`💾 Saved ASCII art to: ${outputPath}`);

    // Update React components
    updateReactComponents(asciiArt);

    console.log(`🎉 ASCII art extraction completed successfully!`);

  } catch (error) {
    console.error(`❌ Error during extraction:`, error.message);
    process.exit(1);
  }
}

main();