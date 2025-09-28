import fs from 'fs';
import axios from 'axios';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const CHAIN = process.env.VITE_CHAIN || 'ethereum';

// Validate required environment variables
if (!CONTRACT_ADDRESS) {
  console.error('Error: Missing CONTRACT_ADDRESS in .env file.');
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
  const apiKey = process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken';

  try {
    console.log(`🔍 Fetching contract source code from ${chain}...`);

    const response = await axios.get('https://api.etherscan.io/v2/api', {
      params: {
        chainid: chainId,
        module: 'contract',
        action: 'getsourcecode',
        address: contractAddress,
        apikey: apiKey
      },
      timeout: 30000
    });

    if (response.data.status !== '1') {
      throw new Error(`Etherscan API error: ${response.data.message || 'Unknown error'}`);
    }

    const sourceData = response.data.result[0];
    if (!sourceData || !sourceData.SourceCode) {
      throw new Error('No source code found for this contract');
    }

    console.log(`✅ Contract source retrieved: ${sourceData.ContractName}`);

    // Parse multi-file format
    let parsedSources = {};
    let sourceCode = sourceData.SourceCode;

    if (sourceCode.startsWith('{{') && sourceCode.endsWith('}}')) {
      const parsed = JSON.parse(sourceCode.slice(1, -1));
      parsedSources = parsed.sources || {};
      console.log(`📦 Multi-file contract (${Object.keys(parsedSources).length} files)`);
    } else {
      // Single file format
      parsedSources[`contracts/${sourceData.ContractName}.sol`] = { content: sourceCode };
    }

    return {
      contractName: sourceData.ContractName,
      parsedSources: parsedSources
    };
  } catch (error) {
    console.error(`❌ Failed to fetch contract source: ${error.message}`);
    throw error;
  }
}

function extractAsciiArt(parsedSources, contractName) {
  console.log('🎨 Extracting ASCII art...');

  // Find the main contract file
  let mainFile = null;
  const possibleNames = [
    `contracts/${contractName}.sol`,
    `${contractName}.sol`
  ];

  for (const fileName of possibleNames) {
    if (parsedSources[fileName]) {
      mainFile = parsedSources[fileName];
      console.log(`📄 Found main contract: ${fileName}`);
      break;
    }
  }

  if (!mainFile) {
    // Fallback: find any .sol file with the contract name
    const matchingFiles = Object.keys(parsedSources).filter(name =>
      name.includes(contractName) && name.endsWith('.sol')
    );
    if (matchingFiles.length > 0) {
      mainFile = parsedSources[matchingFiles[0]];
      console.log(`📄 Found fallback contract: ${matchingFiles[0]}`);
    }
  }

  if (!mainFile) {
    throw new Error(`Could not find contract file for ${contractName}`);
  }

  const fileContent = mainFile.content;

  // Look for comment blocks (simple patterns)
  const commentBlocks = fileContent.match(/(?:\/\/[^\n]*\n){5,}/g);

  if (!commentBlocks || commentBlocks.length === 0) {
    throw new Error('No comment blocks found in contract');
  }

  console.log(`💬 Found ${commentBlocks.length} comment block(s)`);

  // Find the largest comment block (most likely ASCII art)
  let bestBlock = '';
  for (const block of commentBlocks) {
    const cleaned = block.trim();
    if (cleaned.length > bestBlock.length) {
      bestBlock = cleaned;
    }
  }

  if (!bestBlock) {
    throw new Error('No suitable ASCII art found');
  }

  // Check if // characters should be preserved (part of the art)
  const lines = bestBlock.split('\n');
  const hasConsistentSlashes = lines.filter(line => line.trim().startsWith('//')).length > lines.length * 0.8;

  let asciiArt = bestBlock;
  if (!hasConsistentSlashes) {
    // Remove // comment markers if they're not part of the art
    asciiArt = bestBlock.replace(/^(\s*)\/\/(.*)$/gm, '$1$2');
  }

  console.log(`✨ Extracted ASCII art (${asciiArt.length} chars, ${asciiArt.split('\n').length} lines)`);
  return asciiArt;
}

function saveAsciiArtToFile(asciiArt) {
  console.log('💾 Saving ASCII art to file...');

  const assetsDir = path.join(process.cwd(), 'src', 'assets');
  const asciiFilePath = path.join(assetsDir, 'contract-ascii-art.txt');

  // Ensure assets directory exists
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  fs.writeFileSync(asciiFilePath, asciiArt, 'utf8');
  console.log(`✅ ASCII art saved to ${asciiFilePath}`);
  return asciiFilePath;
}

function updateLandingPageWithAsciiArt(asciiArt) {
  console.log('📝 Updating landing page component...');

  const landingPagePath = path.join(process.cwd(), 'src', 'components', 'landing-page.tsx');

  if (!fs.existsSync(landingPagePath)) {
    throw new Error('landing-page.tsx not found');
  }

  let content = fs.readFileSync(landingPagePath, 'utf8');

  // Format ASCII art for JSX
  const formattedArt = asciiArt
    .replace(/\\/g, '\\\\')  // Escape backslashes
    .replace(/`/g, '\\`')    // Escape backticks
    .replace(/\$/g, '\\$');  // Escape dollar signs

  let existingPreClasses = 'text-[4px] xs:text-[5px] sm:text-[6px] md:text-[4px] lg:text-[5px] xl:text-[6px] font-mono text-white whitespace-pre leading-[0.8] overflow-hidden max-w-full max-h-[400px] inline-block mx-auto';

  // Check if ASCII art already exists and extract existing styling
  if (content.includes('ASCII Art from Contract')) {
    const startMarker = '{/* ASCII Art from Contract */}';
    const startIndex = content.indexOf(startMarker);

    if (startIndex !== -1) {
      // Extract existing <pre> className
      const preMatch = content.slice(startIndex).match(/<pre className="([^"]+)"/);
      if (preMatch) {
        existingPreClasses = preMatch[1];
        console.log(`📎 Preserving existing styling: ${existingPreClasses}`);
      }

      // Find the end of the ASCII art div
      let bracketCount = 0;
      let endIndex = startIndex;
      let foundStart = false;

      for (let i = startIndex; i < content.length; i++) {
        if (content.substring(i, i + 5) === '<div ') {
          bracketCount++;
          foundStart = true;
        } else if (content.substring(i, i + 6) === '</div>') {
          bracketCount--;
          if (foundStart && bracketCount === 0) {
            endIndex = i + 6;
            break;
          }
        }
      }

      const asciiComponent = `            {/* ASCII Art from Contract */}
            <div className="mb-8">
              <pre className="${existingPreClasses}">
                {${JSON.stringify(formattedArt)}}
              </pre>
            </div>`;

      content = content.slice(0, startIndex) + asciiComponent + content.slice(endIndex);
    }
  } else {
    // Insert new ASCII art before marketplace links
    const asciiComponent = `            {/* ASCII Art from Contract */}
            <div className="mb-8">
              <pre className="${existingPreClasses}">
                {${JSON.stringify(formattedArt)}}
              </pre>
            </div>`;

    const insertionPoint = content.indexOf('<div className="flex items-center justify-center gap-4 pt-4">');
    if (insertionPoint !== -1) {
      content = content.slice(0, insertionPoint) + asciiComponent + '\n            ' + content.slice(insertionPoint);
    } else {
      throw new Error('Could not find insertion point in landing-page.tsx');
    }
  }

  fs.writeFileSync(landingPagePath, content);
  console.log('✅ Successfully updated landing-page.tsx');
}

// Main execution
(async () => {
  try {
    console.log(`🚀 Starting ASCII art extraction for contract ${CONTRACT_ADDRESS} on ${CHAIN}...`);

    // Fetch contract source code
    const { contractName, parsedSources } = await fetchContractSource(CONTRACT_ADDRESS, CHAIN);

    // Extract ASCII art
    const asciiArt = extractAsciiArt(parsedSources, contractName);

    console.log('🎨 ASCII art extracted successfully:');
    console.log('─'.repeat(50));
    console.log(asciiArt.substring(0, 300) + (asciiArt.length > 300 ? '...' : ''));
    console.log('─'.repeat(50));

    // Save ASCII art to file
    const savedPath = saveAsciiArtToFile(asciiArt);

    // Update landing page component
    updateLandingPageWithAsciiArt(asciiArt);

    console.log('🎉 ASCII art extraction and integration completed!');
    console.log(`📄 ASCII art saved to: ${savedPath}`);

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
})();