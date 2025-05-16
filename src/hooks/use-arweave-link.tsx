import { useState, useEffect } from 'react'
import { wayfinder } from "../lib/wayfinder"

export function useArUrl(arLink: string) {
  const [url, setUrl] = useState<URL | null>(null)
  const [verified, setVerified] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    const onPassed = () => setVerified(true)
    const onFailed = () => setVerified(false)

    wayfinder.emitter.on('verification-passed', onPassed)
    wayfinder.emitter.on('verification-failed', onFailed)

     wayfinder
        .request(arLink, {
          mode: 'cors',
          redirect: 'follow',
        })
        .then(async (res) => {
          if (!cancelled) {
            // TODO: check content-type for image/html
            setUrl(URL.createObjectURL(await res.blob()));
          }
        })
        .catch(err => {
          console.error('Wayfinder failed to resolve', err)
        })

    return () => {
      cancelled = true
      // consider revoking/removing the local blob - URL.revokeObjectURL(url);
      wayfinder.emitter.off('verification-passed', onPassed)
      wayfinder.emitter.off('verification-failed', onFailed)
    }
  }, [arLink])

  return { url, verified }
}

