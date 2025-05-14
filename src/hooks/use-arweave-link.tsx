import { useState, useEffect } from 'react'
import { wayfinder } from "../lib/wayfinder"

export function useArUrl(arLink: string) {
  const [url, setUrl] = useState<URL | null>(null)
  const [verified, setVerified] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    const onPassed = () => {
      setVerified(true)
      console.log('verification-passed')
    }
    const onFailed = () => {
      setVerified(false)
      console.log('verification-failed')
    }

    // Store handlers so we can remove them
    const handlers: Record<string, (event: unknown) => void> = {}

    const eventNames = [
      'verification-passed',
      'verification-failed',
      'verification-progress',
      'routing-started',
      'routing-succeeded',
      'routing-failed',
      'identified-transaction-id',
      'verification-skipped'
    ] as const;

    wayfinder.emitter.setMaxListeners(Infinity)
    wayfinder.emitter.on('verification-passed', onPassed)
    wayfinder.emitter.on('verification-failed', onFailed)
    eventNames.forEach(name => {
      handlers[name] = (event) => {
        console.log(`[wayfinder event] ${name}:`, event)
      }
      wayfinder.emitter.on(name, handlers[name])
    })

    console.log("Listeners registered for wayfinder events");

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
      eventNames.forEach(name => {
        wayfinder.emitter.off(name, handlers[name])
      })
    }
  }, [arLink])

  return { url, verified }
}

