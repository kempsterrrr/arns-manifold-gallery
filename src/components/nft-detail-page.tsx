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
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/gallery")}
          className="mb-6 text-white hover:text-gray-300 hover:bg-gray-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image section */}
          <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden">
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
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2 text-white">{nft.name}</h1>
              <div className="text-xl font-medium text-gray-400 mb-4">by {nft.created_by}</div>
            </div>

            {/* About section */}
            <div>
              <h4 className="text-lg font-medium mb-3 text-white">About this artwork</h4>
              <p className="text-gray-300 leading-relaxed">
                {nft.description}
              </p>
            </div>

            {/* Info section */}
            <div>
              <h4 className="text-lg font-medium mb-3 text-white">Info</h4>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="text-gray-400 break-all">{import.meta.env.VITE_CONTRACT_ADDRESS}</div>
                <div className="text-gray-400">Base</div>
                <div className="text-gray-400">{`#${nft.id}`}</div>
                <div className="text-gray-400">ERC-721</div>
                <div className="text-gray-400">{nft.image_details.width} × {nft.image_details.height}</div>
              </div>
            </div>

            {/* Perma Link */}
            <div className="flex gap-3">
              <Button asChild className="bg-white text-black hover:bg-gray-200">
                <a href={`/${nft.id}`} target="_blank" rel="noopener noreferrer">
                  Perma Link
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <a href={`https://opensea.io/item/base/${import.meta.env.VITE_CONTRACT_ADDRESS}/${nft.id}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700">
                <img src={OpenseaLogo} alt="OpenSea" className="h-6 w-6" />
              </a>
              <a href={`https://magiceden.io/item-details/base/${import.meta.env.VITE_CONTRACT_ADDRESS}/${nft.id}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center hover:bg-purple-700">
                <img src={MagicEdenLogo} alt="Magic Eden" className="h-6 w-6" />
              </a>
              <a href={`https://rarible.com/token/base/${import.meta.env.VITE_CONTRACT_ADDRESS}:${nft.id}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-yellow-600 rounded flex items-center justify-center hover:bg-yellow-700">
                <img src={RaribleLogo} alt="Rarible" className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Attributes section - full width below */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Attributes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {nft.attributes.map((attribute, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  {attribute.trait_type}
                </div>
                <div className="text-white font-medium">
                  {attribute.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}