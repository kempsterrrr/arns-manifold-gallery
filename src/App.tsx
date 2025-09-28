import { WayfinderProvider, LocalStorageGatewaysProvider } from '@ar.io/wayfinder-react';
import { NetworkGatewaysProvider } from '@ar.io/wayfinder-core';
import { ARIO } from '@ar.io/sdk';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from "@/components/landing-page"
import { GalleryPage } from "@/components/nft-gallery.page"
import NFTDetailPage from "@/components/nft-detail-page"
import { ArweaveRedirect } from "@/components/arweave-redirect"

function App() {
  return (
    <WayfinderProvider gatewaysProvider={new LocalStorageGatewaysProvider({
      ttlSeconds: 3600, // cache the gateways locally for 1 hour to avoid unnecessary network requests
      gatewaysProvider: new NetworkGatewaysProvider({
        ario: ARIO.mainnet(),
        limit: 10, // target the top 10 gateways
        sortBy: 'operatorStake',
        sortOrder: 'desc',
      }),
    })}>
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/gallery/:id" element={<NFTDetailPage />} />
            <Route path="/:id" element={<ArweaveRedirect />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </WayfinderProvider>
  )
}

export default App