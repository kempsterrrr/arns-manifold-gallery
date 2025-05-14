import { useArUrl } from "../hooks/use-arweave-link"

type ArioImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  alt: string
}

export default function ArioImage({ src, alt, ...rest }: ArioImageProps) {
  const { url, verified } = useArUrl(src)
  return (
    <div>
      <img src={url?.toString()} alt={alt} {...rest} />
      {verified === true && <span title="Verified">✅</span>}
      {verified === false && <span title="Verification failed">⚠️</span>} 
    </div>
  )
}