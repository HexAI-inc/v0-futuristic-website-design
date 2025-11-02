'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@/styles/mapbox-optimized.css'
import { TreePine, Users, Globe } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

interface ProtectedArea {
  id: string
  name: string
  type: "national-park" | "icca" | "biosphere"
  coordinates: [number, number]
  size: string
  description: string
}

interface MapComponentProps {
  filteredAreas: ProtectedArea[]
  selectedArea: ProtectedArea | null
  theme: import('@/lib/theme-context').Theme
  onAreaClick: (area: ProtectedArea) => void
}

export default function MapComponent({ filteredAreas, selectedArea, theme, onAreaClick }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isGlass = theme === "glass-morphism"

  // Gambia center coordinates
  const gambiaCenter: [number, number] = [-15.5, 13.45]

  useEffect(() => {
    const token = process.env._ACCESS_TOKEN

    if (!token || token === 'your_mapbox_access_token_here') {
      const errorMsg = 'Mapbox access token not configured. Please add NEXT_PUBLIC_MAPBOX to your .env.local file.'
      console.error(errorMsg)
      setError(errorMsg)
      setIsLoading(false)
      return
    }

    mapboxgl.accessToken = token

    if (map.current) return // initialize map only once

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: theme === 'midnight-jungle'
          ? 'mapbox://styles/mapbox/dark-v11'
          : 'mapbox://styles/mapbox/light-v11',
        center: gambiaCenter,
        zoom: 7.6,
        attributionControl: false,
        // Performance optimizations
        antialias: false,
        fadeDuration: 300,
        preserveDrawingBuffer: false,
        // Reduce render frequency for better performance
        renderWorldCopies: false,
        // Optimize for performance
        trackResize: true
      })

      // Add error handling
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e)
        setError('Failed to load map. Please check your internet connection and try again.')
        setIsLoading(false)
      })

      map.current.on('load', () => {
        console.log('Map loaded successfully')
        setMapLoaded(true)
        setIsLoading(false)
      })

      // Add style loading handler
      map.current.on('styledata', () => {
        console.log('Map style loaded')
      })

      // Add data loading handler  
      map.current.on('data', (e) => {
        if (e.dataType === 'source' && e.isSourceLoaded) {
          console.log('Map data loaded')
        }
      })

      // Add navigation control
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

      // Add attribution control
      map.current.addControl(new mapboxgl.AttributionControl({
        compact: true
      }), 'bottom-right')

    } catch (error) {
      console.error('Failed to initialize map:', error)
      setError('Failed to initialize map. Please refresh the page and try again.')
      setIsLoading(false)
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [theme])

  // Update map style when theme changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    const newStyle = theme === 'midnight-jungle'
      ? 'mapbox://styles/mapbox/dark-v11'
      : 'mapbox://styles/mapbox/light-v11'

    map.current.setStyle(newStyle)
  }, [theme, mapLoaded])

  // Update markers when filteredAreas or selectedArea changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    // Clear existing markers and popups
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Batch marker creation for better performance
    const fragment = document.createDocumentFragment()
    
    // Add new markers
    filteredAreas.forEach((area) => {
      const el = document.createElement('div')
      el.className = `cursor-pointer transition-all duration-200`

      // Create marker element with icon - optimized for performance
      const markerElement = document.createElement('div')
      markerElement.className = `flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg ${
        getMarkerColor(area.type)
      } transition-all duration-200`

      // Use innerHTML for better performance than creating nested elements
      markerElement.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${getIconPath(area.type)}</svg>`

      el.appendChild(markerElement)

      // Create hover tooltip popup
      const hoverPopup = new mapboxgl.Popup({
        offset: 15,
        closeButton: false,
        className: 'hover-popup',
        maxWidth: '240px',
        anchor: 'bottom'
      }).setHTML(`
        <div class="p-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg">
          <h3 class="font-semibold text-sm mb-1">${area.name}</h3>
          <p class="text-xs text-muted-foreground mb-1">${area.type.replace('-', ' ').toUpperCase()}</p>
          <p class="text-xs text-muted-foreground">Click for details</p>
        </div>
      `)

      // Create marker without auto-popup
      const marker = new mapboxgl.Marker(el)
        .setLngLat(area.coordinates)
        .addTo(map.current!)

      // Add hover events for tooltip and visual feedback
      el.addEventListener('mouseenter', () => {
        hoverPopup.setLngLat(area.coordinates).addTo(map.current!)
        // Add subtle visual feedback without movement
        markerElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
        markerElement.style.borderWidth = '3px'
      })

      el.addEventListener('mouseleave', () => {
        hoverPopup.remove()
        // Reset visual state
        markerElement.style.boxShadow = ''
        markerElement.style.borderWidth = '2px'
      })

      // Add click handler for sheet/drawer
      let clickTimeout: NodeJS.Timeout | null = null
      el.addEventListener('click', (e) => {
        e.stopPropagation() // Prevent map click
        if (clickTimeout) return // Prevent rapid clicks
        
        // Remove hover tooltip on click
        hoverPopup.remove()
        
        clickTimeout = setTimeout(() => {
          onAreaClick(area)
          // Smooth center map on clicked marker
          map.current!.flyTo({
            center: area.coordinates,
            zoom: 9,
            duration: 800,
            essential: true
          })
          clickTimeout = null
        }, 100)
      })

      markersRef.current.push(marker)
    })
  }, [filteredAreas, selectedArea, mapLoaded, onAreaClick])

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'national-park': return 'bg-green-500'
      case 'icca': return 'bg-blue-500'
      case 'biosphere': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getIconPath = (type: string) => {
    switch (type) {
      case 'national-park':
        return '<path d="M17 14h.01"/><path d="M7 14h.01"/><path d="M15.4 6.5a4 4 0 0 0-5.8 0l-1.2 2.4A4 4 0 0 0 6.5 12.2l-1.2 2.4A1 1 0 0 0 7 16h10a1 1 0 0 0 .9-1.4l-1.2-2.4a4 4 0 0 0-2.9-2.9l-1.2-2.4Z"/>'
      case 'icca':
        return '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 2l-5 5"/><path d="M17 2l5 5"/>'
      case 'biosphere':
        return '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>'
      default:
        return '<path d="M17 14h.01"/><path d="M7 14h.01"/><path d="M15.4 6.5a4 4 0 0 0-5.8 0l-1.2 2.4A4 4 0 0 0 6.5 12.2l-1.2 2.4A1 1 0 0 0 7 16h10a1 1 0 0 0 .9-1.4l-1.2-2.4a4 4 0 0 0-2.9-2.9l-1.2-2.4Z"/>'
    }
  }

  // Error state
  if (error) {
    return (
      <div className={`w-full h-full ${isGlass ? "glass-card" : "bg-card"} rounded-lg flex items-center justify-center p-6`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
            <Globe className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Map Loading Error</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Check for missing token
  if (!process.env.NEXT_PUBLIC_MAPBOX || process.env.NEXT_PUBLIC_MAPBOX === 'your_mapbox_access_token_here') {
    return (
      <div className={`w-full h-full ${isGlass ? "glass-card" : "bg-card"} rounded-lg flex items-center justify-center p-6`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <TreePine className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Mapbox Integration Required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please add your Mapbox access token to the .env.local file to enable the interactive map.
          </p>
          <div className="text-xs bg-muted p-3 rounded-lg font-mono">
            NEXT_PUBLIC_MAPBOX=your_token_here
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full h-full ${isGlass ? "glass-card" : "bg-card"} rounded-lg overflow-hidden relative`}>
      <div ref={mapContainer} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border shadow-lg">
        <div className="text-xs font-medium mb-2 text-foreground">Legend</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-foreground">National Parks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-foreground">ICCAs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-xs text-foreground">Biosphere Reserves</span>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Initializing Mapbox...</p>
            <p className="text-xs text-muted-foreground/70 mt-1">This may take a moment</p>
          </div>
        </div>
      )}
    </div>
  )
}