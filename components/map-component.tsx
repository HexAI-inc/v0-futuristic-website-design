'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
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
  const isGlass = theme === "glass-morphism"

  // Gambia center coordinates
  const gambiaCenter: [number, number] = [-15.5, 13.45]

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

    if (!token || token === 'your_mapbox_access_token_here') {
      console.warn('Mapbox access token not configured. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env.local file.')
      return
    }

    mapboxgl.accessToken = token

    if (map.current) return // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: theme === 'midnight-jungle'
        ? 'mapbox://styles/mapbox/dark-v11'
        : 'mapbox://styles/mapbox/light-v11',
      center: gambiaCenter,
      zoom: 7.6,
      attributionControl: false
    })

    map.current.on('load', () => {
      setMapLoaded(true)
    })

    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Add attribution control
    map.current.addControl(new mapboxgl.AttributionControl({
      compact: true
    }), 'bottom-right')

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

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add new markers
    filteredAreas.forEach((area) => {
      const el = document.createElement('div')
      el.className = `cursor-pointer`

      // Create marker element with icon
      const markerElement = document.createElement('div')
      markerElement.className = `flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg ${
        getMarkerColor(area.type)
      }`

      const iconElement = document.createElement('div')
      iconElement.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${getIconPath(area.type)}</svg>`

      markerElement.appendChild(iconElement)
      el.appendChild(markerElement)

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: 'custom-popup'
      }).setHTML(`
        <div class="p-3 bg-background border border-border rounded-lg shadow-lg max-w-xs">
          <h3 class="font-semibold text-sm mb-1">${area.name}</h3>
          <p class="text-xs text-muted-foreground mb-2">${area.type.replace('-', ' ').toUpperCase()}</p>
          <p class="text-xs">${area.description}</p>
          <p class="text-xs font-medium mt-1">Size: ${area.size}</p>
        </div>
      `)

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat(area.coordinates)
        .setPopup(popup)
        .addTo(map.current!)

      // Add click handler
      el.addEventListener('click', () => {
        onAreaClick(area)
        // Center map on clicked marker
        map.current!.flyTo({
          center: area.coordinates,
          zoom: 9,
          duration: 1000
        })
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

  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN === 'your_mapbox_access_token_here') {
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
            NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
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
      {!mapLoaded && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}