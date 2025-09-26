import { useParams, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import WayfinerImage from "./wayfinder-image"
import { ArrowLeft, ExternalLink } from "lucide-react"
import collectionMetadata from "@/data/collection_metadata.json"
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

export function NFTDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id || !collectionMetadata[id as keyof typeof collectionMetadata]) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">NFT Not Found</h1>
          <Button onClick={() => navigate("/gallery")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Button>
        </div>
      </div>
    )
  }

  const nftData = collectionMetadata[id as keyof typeof collectionMetadata]
  const nft: NFT = {
    id,
    index: parseInt(id) - 1,
    name: nftData.name,
    created_by: nftData.created_by,
    description: nftData.description,
    image: nftData.image,
    image_url: nftData.image_url,
    image_details: nftData.image_details,
    attributes: nftData.attributes
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/gallery")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image section */}
          <div className="aspect-square bg-black rounded-lg overflow-hidden">
            <WayfinerImage
              src={nft.image_url.replace(/https:\/\/arweave\.net\//g, '')}
              alt={nft.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Details section */}
          <div className="flex flex-col space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2">{nft.name}</h1>
              <div className="text-xl font-medium text-muted-foreground mb-4">by {nft.created_by}</div>
              <hr className="my-4" />
            </div>

            {/* About section */}
            <div>
              <h4 className="text-lg font-medium mb-3">About this artwork</h4>
              <p className="text-muted-foreground leading-relaxed">
                {nft.description}
              </p>
            </div>

            {/* Artwork Details */}
            <div>
              <h4 className="text-lg font-medium mb-3">Info</h4>
              <div className="space-y-4 bg-muted/40 rounded-md p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                  <span className="text-muted-foreground">Contract</span>
                  <span className="font-medium break-all">{import.meta.env.VITE_CONTRACT_ADDRESS}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Chain</span>
                  <span className="font-medium">Base</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Token ID</span>
                  <span className="font-medium">{`#${nft.id}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Token Standard</span>
                  <span className="font-medium">ERC-721</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dimensions</span>
                  <span className="font-medium">{nft.image_details.width} × {nft.image_details.height}</span>
                </div>
              </div>
            </div>

            {/* Artwork Attributes */}
            <div>
              <h4 className="text-lg font-medium mb-3">Attributes</h4>
              <div className="space-y-4 bg-muted/40 rounded-md p-4">
                {nft.attributes.map((attribute, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                    <span className="text-muted-foreground break-words">{attribute.trait_type}</span>
                    <span className="font-medium break-words">{attribute.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Perma Link */}
            <div>
              <h4 className="text-lg font-medium mb-3">Permanent Link</h4>
              <div className="flex justify-center mb-6">
                <Button asChild size="lg">
                  <a href={`/${nft.id}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Perma Link
                  </a>
                </Button>
              </div>
            </div>

            {/* Marketplace Links */}
            <div>
              <h4 className="text-lg font-medium mb-3">View on Marketplaces</h4>
              <div className="flex justify-center space-x-8 items-center">
                <a href={`https://opensea.io/item/base/${import.meta.env.VITE_CONTRACT_ADDRESS}/${nft.id}`} target="_blank" rel="noopener noreferrer" aria-label="OpenSea">
                  <img src={OpenseaLogo} alt="OpenSea Logo" className="h-8 w-auto hover:opacity-80 transition-opacity" />
                </a>
                <a href={`https://magiceden.io/item-details/base/${import.meta.env.VITE_CONTRACT_ADDRESS}/${nft.id}`} target="_blank" rel="noopener noreferrer" aria-label="Magic Eden">
                  <img src={MagicEdenLogo} alt="Magic Eden Logo" className="h-8 w-auto hover:opacity-80 transition-opacity" />
                </a>
                <a href={`https://rarible.com/token/base/${import.meta.env.VITE_CONTRACT_ADDRESS}:${nft.id}`} target="_blank" rel="noopener noreferrer" aria-label="Rarible">
                  <img src={RaribleLogo} alt="Rarible Logo" className="h-8 w-auto hover:opacity-80 transition-opacity" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}