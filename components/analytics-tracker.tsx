"use client"

import { useEffect, useCallback } from "react"
import { usePathname, useSearchParams } from "next/navigation"

// Simple session ID generator
const getSessionId = () => {
  if (typeof window === 'undefined') return null
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  let sessionId = sessionStorage.getItem('nbsap_session_id')
  
  // If session ID exists but is not a valid UUID, clear it
  if (sessionId && !uuidRegex.test(sessionId)) {
    sessionId = null
  }

  if (!sessionId) {
    // Generate a valid UUID v4
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      sessionId = crypto.randomUUID()
    } else {
      // Fallback for older browsers
      sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }
    sessionStorage.setItem('nbsap_session_id', sessionId)
  }
  return sessionId
}

export const trackEvent = async (eventName: string, eventData?: any) => {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'event',
        event_name: eventName,
        event_data: eventData,
        path: window.location.pathname,
        session_id: getSessionId()
      }),
    })
  } catch (err) {
    console.error('Failed to track event:', err)
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    console.log('[Analytics] Tracker mounted')
  }, [])

  const trackPageView = useCallback(async () => {
    // Don't track admin pages
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return
    }

    try {
      console.log(`[Analytics] Tracking page view: ${pathname}`)
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: pathname,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          session_id: getSessionId()
        }),
      })
      if (!response.ok) {
        console.error(`[Analytics] Tracking failed with status: ${response.status}`)
      } else {
        console.log(`[Analytics] Successfully tracked: ${pathname}`)
      }
    } catch (err) {
      console.error('Failed to track page view:', err)
    }
  }, [pathname])

  useEffect(() => {
    trackPageView()

    // Track external link clicks and downloads
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')
      
      if (anchor && anchor.href) {
        const url = new URL(anchor.href)
        const isExternal = url.hostname !== window.location.hostname
        const isDownload = anchor.hasAttribute('download') || 
                          url.pathname.match(/\.(pdf|zip|docx|xlsx)$/)

        if (isExternal) {
          trackEvent('external_link_click', { 
            url: anchor.href,
            text: anchor.innerText.trim() 
          })
        } else if (isDownload) {
          trackEvent('file_download', { 
            url: url.pathname,
            filename: url.pathname.split('/').pop() 
          })
        }
      }
    }

    document.addEventListener('click', handleGlobalClick)
    return () => document.removeEventListener('click', handleGlobalClick)
  }, [trackPageView, searchParams])

  return null
}
