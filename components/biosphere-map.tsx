"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@/styles/mapbox-optimized.css'
import { Shield, Sprout, Users, Info } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BiosphereZone } from '@/lib/database'

// Niumi Biosphere Reserve approximate boundaries and center
const NIUMI_CENTER: [number, number] = [-16.48, 13.52]

// Helper to create circular polygon coordinates
const createCircle = (center: [number, number], radiusInKm: number, points: number = 64) => {
  const coords = [];
  const distanceX = radiusInKm / (111.32 * Math.cos(center[1] * Math.PI / 180));
  const distanceY = radiusInKm / 110.574;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([center[0] + x, center[1] + y]);
  }
  coords.push(coords[0]); // Close the polygon
  return coords;
};

interface BiosphereMapProps {
  zones: BiosphereZone[]
}

export function BiosphereMap({ zones }: BiosphereMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [selectedZone, setSelectedZone] = useState<any | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Process zones to include polygon coordinates
  const processedZones = zones.map(zone => {
    let center: [number, number] = NIUMI_CENTER;
    if (zone.coordinates) {
      const [lng, lat] = zone.coordinates.split(',').map(c => parseFloat(c.trim()));
      if (!isNaN(lng) && !isNaN(lat)) {
        center = [lng, lat];
      }
    }

    const radius = zone.radius || (zone.zone_type === 'core' ? 5 : zone.zone_type === 'buffer' ? 10 : 18);
    const polygonCoords = createCircle(center, radius);

    return {
      ...zone,
      center,
      radius,
      polygonCoords,
      color: zone.zone_type === 'core' ? '#00f0a8' : zone.zone_type === 'buffer' ? '#00b4d8' : '#ffc107'
    };
  });

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX
    if (!token || !mapContainer.current) return

    mapboxgl.accessToken = token

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: NIUMI_CENTER,
      zoom: 10,
      attributionControl: false
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    map.current.on('load', () => {
      setMapLoaded(true)
      
      // Add Zone Polygons
      processedZones.slice().reverse().forEach((zone) => {
        map.current?.addSource(zone.id, {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'geometry': {
              'type': 'Polygon',
              'coordinates': [zone.polygonCoords]
            },
            'properties': {}
          }
        });

        map.current?.addLayer({
          'id': `${zone.id}-fill`,
          'type': 'fill',
          'source': zone.id,
          'layout': {},
          'paint': {
            'fill-color': zone.color,
            'fill-opacity': zone.zone_type === 'core' ? 0.5 : zone.zone_type === 'buffer' ? 0.3 : 0.15
          }
        });

        map.current?.addLayer({
          'id': `${zone.id}-outline`,
          'type': 'line',
          'source': zone.id,
          'layout': {},
          'paint': {
            'line-color': zone.color,
            'line-width': 2,
            'line-dasharray': zone.zone_type === 'transition' ? [2, 2] : [1]
          }
        });

        // Click event for polygons
        map.current?.on('click', `${zone.id}-fill`, () => {
          setSelectedZone(zone);
        });

        // Change cursor on hover
        map.current?.on('mouseenter', `${zone.id}-fill`, () => {
          map.current!.getCanvas().style.cursor = 'pointer';
        });
        map.current?.on('mouseleave', `${zone.id}-fill`, () => {
          map.current!.getCanvas().style.cursor = '';
        });
      });
    })

    return () => map.current?.remove()
  }, [zones])

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Interactive <span className="text-chart-3">Zonation Map</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the spatial organization of the Niumi Biosphere Reserve. Click on the zones to understand how different areas are managed for conservation and development.
          </p>
        </div>

        <div className="relative h-[600px] rounded-3xl overflow-hidden border shadow-2xl bg-muted">
          <div ref={mapContainer} className="w-full h-full" />
          
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-chart-3 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium text-muted-foreground">Loading Biosphere Map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Legend & Details Section */}
        <div className="mt-12">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {processedZones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => {
                  setSelectedZone(zone)
                  // Calculate bounds for the polygon
                  const lats = zone.polygonCoords.map(c => c[1]);
                  const lngs = zone.polygonCoords.map(c => c[0]);
                  const bounds = [
                    [Math.min(...lngs), Math.min(...lats)],
                    [Math.max(...lngs), Math.max(...lats)]
                  ] as [number, number, number, number];
                  
                  map.current?.fitBounds(bounds, { padding: 50 });
                }}
                className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all ${
                  selectedZone?.id === zone.id 
                    ? 'bg-background border-chart-3 shadow-lg scale-105' 
                    : 'bg-muted/50 border-transparent hover:bg-muted hover:scale-105'
                }`}
              >
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: zone.color }} />
                <span className="font-bold">{zone.name}</span>
              </button>
            ))}
          </div>

          {/* Zone Details (Appears only when selected) */}
          {selectedZone && (
            <Card className="p-8 border-2 animate-in fade-in slide-in-from-top-4 duration-500" style={{ borderColor: selectedZone.color + '40' }}>
              <div className="grid md:grid-cols-[1fr_2fr] gap-8 items-start">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedZone.color }} />
                    <h3 className="text-2xl font-bold">{selectedZone.name}</h3>
                  </div>
                  <Badge variant="secondary" className="mb-6">
                    {selectedZone.zone_type === 'core' ? 'Strict Protection' : selectedZone.zone_type === 'buffer' ? 'Managed Resource' : 'Sustainable Development'}
                  </Badge>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex justify-between border-b pb-2">
                      <span>Size:</span>
                      <span className="font-medium text-foreground">{selectedZone.size}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Radius:</span>
                      <span className="font-medium text-foreground">{selectedZone.radius} km</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-chart-3" />
                    Management Objectives
                  </h4>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {selectedZone.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedZone(null)}
                  >
                    Deselect Zone
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
