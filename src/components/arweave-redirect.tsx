import { useEffect } from "react"
import { useParams } from "react-router-dom"
import collectionMetadata from "@/data/collection_metadata.json"

export function ArweaveRedirect() {
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (!id || !collectionMetadata[id as keyof typeof collectionMetadata]) {
      // If ID doesn't exist, redirect to gallery
      window.location.href = "/gallery"
      return
    }

    // Based on your example, the format should be:
    // https://arweave.net/pxXh5jruvVqXe6MEyA77Wt8LIC-tou0KRaNrqRT_Whw/{id}
    const arweaveMetadataUrl = `https://arweave.net/pxXh5jruvVqXe6MEyA77Wt8LIC-tou0KRaNrqRT_Whw/${id}`

    // Redirect to the Arweave metadata URL
    window.location.href = arweaveMetadataUrl
  }, [id])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to Arweave metadata...</p>
      </div>
    </div>
  )
}