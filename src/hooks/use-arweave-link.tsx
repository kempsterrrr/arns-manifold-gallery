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
      .resolveUrl({ originalUrl: arLink })
      .then(u => {
        if (!cancelled) {
          setUrl(u)
        }
      })
      .catch(err => {
        console.error('Wayfinder failed to resolve', err)
      })

    return () => {
      cancelled = true
      wayfinder.emitter.off('verification-passed', onPassed)
      wayfinder.emitter.off('verification-failed', onFailed)
    }
  }, [arLink])

  return { url, verified }
}
