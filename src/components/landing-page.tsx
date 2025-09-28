import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import collectionMetadata from "@/data/collection_metadata.json"
import RaribleLogo from "/rarible-logo.svg"
import PoweredByARIO from "/powered-by-ario.svg"
import MagicEdenLogo from "/magic-eden-logo.svg"
import BaseLogo from "@/assets/base-logo.svg"
import EthereumLogo from "@/assets/ethereum-logo.svg"
import { AsciiArtDisplay } from "@/components/ascii-art-display"

function getChainInfo(chain: string) {
  const chainMap: Record<string, { logo: string; name: string; explorer: string }> = {
    'base': { logo: BaseLogo, name: 'Base', explorer: 'basescan.org' },
    'ethereum': { logo: EthereumLogo, name: 'Ethereum', explorer: 'etherscan.io' },
    'optimism': { logo: EthereumLogo, name: 'Polygon', explorer: 'polygonscan.com' },
    'shape': { logo: EthereumLogo, name: 'Arbitrum', explorer: 'arbiscan.io' },
    'polygon': { logo: EthereumLogo, name: 'Optimism', explorer: 'optimistic.etherscan.io' },
    'sepolia': { logo: EthereumLogo, name: 'Optimism', explorer: 'optimistic.etherscan.io' }
  };

  return chainMap[chain] || chainMap['ethereum']; // fallback to ethereum
}

export function LandingPage() {
  const chainInfo = getChainInfo(import.meta.env.VITE_CHAIN);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Anoncast X Manifold - Hosted on ArNS</title>
        <meta name="description" content={collectionMetadata[1].description} />
        <meta name="author" content={collectionMetadata[1].created_by} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="og:image" content="https://hio4ba6do34s7f4xmaffjf5tsergykh3gszg45r5vbjf5qzecbbq.arweave.net/Oh3Ag8N2-S-Xl2AKVJezkSJsKPs0sm52PahSXsMkEEM" />
      </Helmet>

      <main className="flex-1 flex items-center justify-center">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 sm:gap-6 text-center">
            <h1 className="text-2xl font-bold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl lg:leading-[1.1]">
              {collectionMetadata[1].created_by}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm py-2">
              <span className="flex items-center gap-1">
                <span className="font-medium">{Object.keys(collectionMetadata).length}</span> works
              </span>
              <span className="flex items-center gap-1">
                <a href={`https://${chainInfo.explorer}/address/${import.meta.env.VITE_CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  <img src={chainInfo.logo} alt={`${chainInfo.name} Logo`} className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="font-medium">{chainInfo.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m5-3h3m0 0v3m0-3L10 14"/></svg>
                </a>
              </span>
            </div>

            {/* <p className="max-w-[46rem] text-lg text-muted-foreground sm:text-xl">
              {collectionMetadata[1].description}
            </p> */}
            {/* ASCII Art from Contract */}
            <AsciiArtDisplay asciiArt={"///////////////////////////////////////////////////\n//                                               //\n//                                               //\n//    ++++++++++++++++++++++++++++++++++         //\n//     ++++++++++++++++++++++++++++++++++        //\n//       ++++++++++++++++++++++++++++++++++      //\n//                                   ++++++++    //\n//                                  ++++++++     //\n//                                +++++++        //\n//               ++++++++       +++++++          //\n//                 ++++++++   +++++++            //\n//                   +++++++++                   //\n//                     ++++++++                  //\n//                                               //\n//                                               //\n///////////////////////////////////////////////////"} />
            {/* <div className="flex items-center justify-center gap-4">
              <a href={`https://rarible.com/collection/${import.meta.env.VITE_CHAIN}/${import.meta.env.VITE_CONTRACT_ADDRESS}/items`} target="_blank" rel="noopener noreferrer" aria-label="Rarible">
                <img src={RaribleLogo} alt="Rarible Logo" className="h-12 w-auto hover:opacity-80 transition-opacity" />
              </a>
              <a href={`https://magiceden.io/collections/${import.meta.env.VITE_CHAIN}/${import.meta.env.VITE_CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" aria-label="MagicEden">
                <img src={MagicEdenLogo} alt="MagicEden Logo" className="h-12 w-auto hover:opacity-80 transition-opacity" />
              </a>
            </div> */}
            <div className="flex items-center justify-center gap-4 pt-4 sm:pt-6">
            <Link to="/gallery">
                <button className="font-mono text-xs sm:text-sm bg-black text-white border-2 border-white px-4 py-2 sm:px-6 sm:py-3 hover:bg-white hover:text-black transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black">
                  <pre className="whitespace-pre">
{`┌─────────────┐
│    ENTER    │
└─────────────┘`}
                  </pre>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="mt-auto border-t py-6 md:py-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="https://manifold.xyz" className="font-medium underline underline-offset-4 hover:text-foreground">
              Manifold
            </a>
          </div>
          <a href="https://ar.io" target="_blank" rel="noopener noreferrer" className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            <img src={PoweredByARIO} alt="Powered by AR.IO Network" className="h-12 w-auto" />
          </a>
        </div>
      </footer>
    </div>
  )
}