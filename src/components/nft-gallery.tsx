import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import collectionMetadata from "@/data/collection_metadata.json"
import { Button } from "./ui/button"
import WayfinerImage from "./wayfinder-image"
import WayfinderLink from "./wayfinder-link"
import { ExternalLink } from "lucide-react"
// import { sanitizeUndername } from "@/lib/utils"
import OpenseaLogo from "@/assets/opensea-logo.svg"
import MagicEdenLogo from "@/assets/magic-eden-logo.svg"
import RaribleLogo from "@/assets/rarible-logo.svg"

type NFT = {
  id: string
  index: number
  name: string
  created_by: string
  description: string
  image: string
  image_url: string
  attributes: {
    trait_type: string
    value: string
    display_type: string
  }[]
  image_details: {
    width: number
    height: number
    format: string
  }
}

const nfts: NFT[] = Object.entries(collectionMetadata)
.sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
.map(([id, data], index) => ({
  id,
  index,
  name: data.name,
  created_by: data.created_by,
  description: data.description,
  image: data.image,
  image_url: data.image_url,
  image_details: data.image_details,
  attributes: data.attributes
}))

function NFTDialog({ nft, open, onOpenChange }: { nft: NFT, open: boolean, onOpenChange: (open: boolean) => void }) {
  // Use the sanitization function from utils
  // const sanitizedUndername = sanitizeUndername(nft.name)
  const nftNumber = nft.index + 1
  const arnsUrl = `${nftNumber.toString()}_anoncast-x-manifold`
  
  // console.log('🏷️  Constructing ArNS name for NFT:', nft.name, '→', sanitizedUndername, '→', arnsUrl)
  console.log('🔢  NFT ID:', nft.id, 'Is First Item:', nft.id === '1')
  
  // Add timing information to see if there's a difference in when first vs other items resolve
  const dialogOpenTime = Date.now()
  console.log('⏰  Dialog opened at:', dialogOpenTime, 'for NFT:', nft.name)

  console.log(`arns ULR is ${arnsUrl}`)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[95vh] p-0 overflow-hidden">
        <div className="flex flex-col md:grid md:grid-cols-2 max-h-[95vh]">
          {/* Image section */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-black flex-shrink-0">
            <WayfinerImage
              src={nft.image_url.replace(/https:\/\/arweave\.net\//g, '')}
              alt={nft.name}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Details section */}
          <div className="flex flex-col p-4 md:p-6 overflow-y-auto flex-1 min-h-0">
            {/* Header */}
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-2xl md:text-3xl font-bold leading-tight">{nft.name}</DialogTitle>
              <div className="text-base md:text-lg font-medium text-muted-foreground mb-4">by {nft.created_by}</div>
              <hr className="my-2" />
            </DialogHeader>
            {/* About section */}
            <div className="py-4 md:py-6 flex-shrink-0">
              <h4 className="text-sm font-medium mb-3">About this artwork</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {nft.description}
              </p>
            </div>
            {/* Artwork Details */}
            <div className="pt-4 border-t flex-shrink-0">
              <h4 className="text-sm font-medium mb-3">Info</h4>
              <div className="space-y-3 bg-muted/40 rounded-md p-3 md:p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                  <span className="text-muted-foreground text-xs sm:text-sm break-all">{import.meta.env.VITE_CONTRACT_ADDRESS}</span>
                  {/* <span className="font-medium">Contract</span> */}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base</span>
                  {/* <span className="font-medium">Chain</span> */}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{`#${nft.id}`}</span>
                  {/* <span className="font-medium">ID</span> */}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ERC-721</span>
                  {/* <span className="font-medium">Token Spec</span> */}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{nft.image_details.width} × {nft.image_details.height}</span>
                  {/* <span className="font-medium">Dimensions</span> */}
                </div>
              </div>
            </div>
            {/* Artwork Attributes */}
            <div className="pt-4 border-t flex-shrink-0">
              <h4 className="text-sm font-medium mb-3">Attributes</h4>
              <div className="space-y-3 bg-muted/40 rounded-md p-3 md:p-4">
                {nft.attributes.map((attribute, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                    <span className="text-muted-foreground break-words">{attribute.trait_type}</span>
                    <span className="font-medium break-words">{attribute.value}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Action row */}
            <div className="flex flex-col md:flex-row justify-around gap-4 pt-4 mt-auto flex-shrink-0">
              <div className="flex justify-center">
                <Button variant="default" className="cursor-pointer w-full sm:w-auto" size="lg">
                  <WayfinderLink href={arnsUrl} target="_blank" rel="noopener noreferrer">
                    <span className="flex items-center">
                      Perma Link <ExternalLink className="ml-2 h-4 w-4" />
                    </span>
                  </WayfinderLink>
                </Button>
              </div>
              <div className="flex justify-center space-x-6 items-center">
                <a href={`https://opensea.io/item/base/${import.meta.env.VITE_CONTRACT_ADDRESS}/${nft.id}`} target="_blank" rel="noopener noreferrer" aria-label="OpenSea">
                  <img src={OpenseaLogo} alt="OpenSea Logo" className="h-6 w-auto" />
                </a>
                <a href={`https://magiceden.io/item-details/base/${import.meta.env.VITE_CONTRACT_ADDRESS}/${nft.id}`} target="_blank" rel="noopener noreferrer" aria-label="Magic Eden">
                  <img src={MagicEdenLogo} alt="Magic Eden Logo" className="h-6 w-auto" />
                </a>
                <a href={`https://rarible.com/token/base/${import.meta.env.VITE_CONTRACT_ADDRESS}:${nft.id}`} target="_blank" rel="noopener noreferrer" aria-label="Rarible">
                  <img src={RaribleLogo} alt="Rarible Logo" className="h-6 w-auto" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function NFTGallery() {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft) => (
          <div
            key={nft.id}
            className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-primary/5"
            onClick={() => setSelectedNFT(nft)}
          >
            <div 
              className="overflow-hidden rounded-t-lg"
              style={{
                aspectRatio: `${nft.image_details.width} / ${nft.image_details.height}`
              }}
            >
              <WayfinerImage
                src={nft.image_url.replace(/https:\/\/arweave\.net\//g, '')}
                alt={nft.name}
                width={nft.image_details.width}
                height={nft.image_details.height}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="bg-background p-4 rounded-b-lg border-t">
              <h3 className="font-medium text-xl text-foreground">{nft.name}</h3>
              <p className="text-sm text-muted-foreground">{nft.created_by}</p>
            </div>
            <button className="absolute inset-0 cursor-pointer" aria-label={`View details for ${nft.name}`} />
          </div>
        ))}
      </div>
      {/* Dialog for selected NFT */}
      {selectedNFT && (
        <NFTDialog nft={selectedNFT} open={!!selectedNFT} onOpenChange={(open) => !open && setSelectedNFT(null)} />
      )}
    </>
  )
}
