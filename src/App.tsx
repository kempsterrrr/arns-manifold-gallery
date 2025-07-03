import { WayfinderProvider, LocalStorageGatewaysProvider } from '@ar.io/wayfinder-react';
import { NetworkGatewaysProvider } from '@ar.io/wayfinder-core';
import { ARIO } from '@ar.io/sdk';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { NFTGallery } from "@/components/nft-gallery"
import collectionMetadata from "@/data/collection_metadata.json"  
import OpenseaLogo from "/opensea-logo.svg"
import RaribleLogo from "/rarible-logo.svg"
import PoweredByARIO from "/powered-by-ario.svg"
import MagicEdenLogo from "/magic-eden-logo.svg"
import ManifoldLogo from "@/assets/manifold-logo.svg"
import AnoncastLogo from "@/assets/anon-logo.png"
import BaseLogo from "@/assets/base-logo.svg"

function App() {
  
  return (
    <WayfinderProvider gatewaysProvider={new LocalStorageGatewaysProvider({ 
      ttlSeconds: 3600, // cache the gateways locally for 1 hour to avoid unnecessary network requests
      gatewaysProvider: new NetworkGatewaysProvider({ 
         ario: ARIO.mainnet(), 
         limit: 10, // target the top 3 gateways
         sortBy: 'operatorStake',
         sortOrder: 'desc',
       }), 
     })}>
    {/* <WayfinderProvider gatewaysProvider={new LocalStorageGatewaysProvider({ 
      ttlSeconds: 3600,
      gatewaysProvider: new NetworkGatewaysProvider({ 
         ario: ARIO.mainnet(), 
         limit: 3, // target the top 3 gateways
         sortBy: 'operatorStake',
         sortOrder: 'desc',
       }), 
     })}> */}
     <HelmetProvider>
      <Helmet>
        <title>Anoncast X Manifold - Hosted on ArNS</title>
        <meta name="description" content="First NFT from @anoncast_ on manifold.xyz for commemorating first anonymous NFT released!" />
        <meta name="keywords" content="Anoncast, Manifold, NFT, Anonymous, First NFT" />
        <meta name="author" content="Anoncast" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="og:image" content="https://hio4ba6do34s7f4xmaffjf5tsergykh3gszg45r5vbjf5qzecbbq.arweave.net/Oh3Ag8N2-S-Xl2AKVJezkSJsKPs0sm52PahSXsMkEEM" />
      </Helmet>
        <div className="min-h-screen">
          <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between py-4">
              <a href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tighter">{collectionMetadata[1].created_by}</span>
              </a>
              <div className="flex items-center gap-4">
                <a href="https://manifold.xyz/" target="_blank" rel="noopener noreferrer" aria-label="Manifold">
                  <img src={ManifoldLogo} alt="Manifold Logo" className="h-8 w-auto rounded" />
                </a>
                <a href="https://anoncast.org/" target="_blank" rel="noopener noreferrer" aria-label="Manifold">
                  <img src={AnoncastLogo} alt="Manifold Logo" className="h-8 w-auto rounded" />
                </a>
              </div>
            </div>
          </header>
          <main className="flex-1">
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 lg:py-32">
              <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
                <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
                  Anoncast X Manifold
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm py-2">
                  <span className="flex items-center gap-1">
                    <span className="font-medium">{Object.keys(collectionMetadata).length}</span> works
                  </span>
                  <span className="flex items-center gap-1">
                    <a href={`https://basescan.org/address/${import.meta.env.VITE_CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      <img src={BaseLogo} alt="Base Logo" className="h-4 w-4 mr-1" />
                      <span className="font-medium">Base</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m5-3h3m0 0v3m0-3L10 14"/></svg>
                    </a>
                  </span>
                  {/* <span className="flex items-center gap-1">
                    <span className="font-mono text-xs sm:text-sm break-all">{import.meta.env.VITE_CONTRACT_ADDRESS}</span>
                    <button
                      className="ml-1 p-1 hover:bg-muted rounded"
                      title="Copy address"
                      onClick={() => {
                        navigator.clipboard.writeText(import.meta.env.VITE_CONTRACT_ADDRESS);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2"/><rect x="3" y="3" width="13" height="13" rx="2" strokeWidth="2"/></svg>
                    </button>
                    <a
                      href={`https://basescan.org/address/${import.meta.env.VITE_CONTRACT_ADDRESS}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 p-1 hover:bg-muted rounded"
                      title="View on explorer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m5-3h3m0 0v3m0-3L10 14"/></svg>
                    </a>
                  </span> */}
                </div>
                <p className="max-w-[46rem] text-lg text-muted-foreground sm:text-xl">
                First NFT from @anoncast_ on manifold.xyz for commemorating first anonymous NFT released!
                </p>
                <div className="flex items-center justify-center gap-4 pt-4">
                  <a href={`https://rarible.com/collection/base/${import.meta.env.VITE_CONTRACT_ADDRESS}/items`} target="_blank" rel="noopener noreferrer" aria-label="Rarible">
                    <img src={RaribleLogo} alt="Rarible Logo" className="h-12 w-auto" />
                  </a>
                  <a href={`https://magiceden.io/collections/base/${import.meta.env.VITE_CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" aria-label="MagicEden">
                    <img src={MagicEdenLogo} alt="MagicEden Logo" className="h-12 w-auto" />
                  </a>
                  <a href="https://opensea.io/collection/anonworld" target="_blank" rel="noopener noreferrer" aria-label="OpenSea">
                    <img src={OpenseaLogo} alt="OpenSea Logo" className="h-12 w-auto rounded" />
                  </a>
                </div>
              </div>
            </section>
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
              <NFTGallery />
            </section>
          </main>
          <footer className="border-t py-6 md:py-0">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <a href="https://anoncast.org/" className="font-medium underline underline-offset-4 hover:text-foreground">
                  Anoncast
                </a>
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
      </HelmetProvider>
    </WayfinderProvider>
  )
}

export default App
