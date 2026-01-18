import { Map, Marker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Satellite, Map as MapIcon, Navigation, MapPinned } from 'lucide-react';

interface MapReport {
  _id?: string;
  id?: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  status: string;
  priority?: string;
  location?: string;
}

interface GoogleInteractiveMapProps {
  reports?: MapReport[];
  onReportClick?: (reportId: string) => void;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  selectedLocation?: { lat: number; lng: number } | null;
  showLocationPicker?: boolean;
}

// Component to handle map controls
function MapControls({ mapType, onMyLocationClick }: { mapType: string; onMyLocationClick: () => void }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    // Enable all controls with proper positioning and POI labels
    map.setOptions({
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER,
      },
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
      },
      streetViewControl: false,
      mapTypeControl: false,
      gestureHandling: 'greedy',
      clickableIcons: true,
      // Enable all POI (Points of Interest) and place labels
      styles: [], // Clear any styles to show all default labels
    });

    // Add custom "My Location" button
    const locationButton = document.createElement("button");
    locationButton.textContent = "📍";
    locationButton.classList.add("custom-map-control-button");
    locationButton.style.cssText = `
      background-color: #fff;
      border: 0;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      color: rgb(25,25,25);
      cursor: pointer;
      font-family: Roboto,Arial,sans-serif;
      font-size: 20px;
      line-height: 38px;
      margin: 8px 0 22px;
      padding: 0 8px;
      text-align: center;
      height: 40px;
      width: 40px;
    `;
    locationButton.title = "Go to my location";
    locationButton.type = "button";
    
    locationButton.addEventListener("click", onMyLocationClick);
    
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);
    
    return () => {
      const index = map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].getArray().indexOf(locationButton);
      if (index > -1) {
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].removeAt(index);
      }
    };
  }, [map, mapType, onMyLocationClick]);
  
  return null;
}

export function GoogleInteractiveMap({ 
  reports = [], 
  onReportClick,
  onLocationSelect,
  selectedLocation,
  showLocationPicker = false
}: GoogleInteractiveMapProps) {
  const [selectedReport, setSelectedReport] = useState<MapReport | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 40.7128, lng: -74.0060 });

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setMapCenter(location);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  const getMarkerColor = (status: string, priority?: string) => {
    switch (status) {
      case 'resolved':
        return '#10b981'; // green
      case 'in_progress':
        return '#fbbf24'; // yellow/amber
      case 'closed':
        return '#6b7280'; // gray
      case 'open':
        // Color based on priority for open reports
        if (priority === 'critical' || priority === 'high') {
          return '#ef4444'; // red
        } else {
          return '#FF6500'; // orange
        }
      default:
        return '#FF6500'; // accent-orange
    }
  };

  const handleMapClick = (e: any) => {
    if (showLocationPicker && e.latLng && onLocationSelect) {
      const location = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      onLocationSelect(location);
      console.log('Location selected:', location);
    }
  };

  const handleMyLocationClick = () => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setMapCenter(location);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Please enable location access.');
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  };

  return (
    <div className="relative h-[600px] w-full rounded-xl overflow-hidden shadow-xl">
      {/* Map Type Toggle - Positioned to avoid overlap with fullscreen */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMapType('roadmap')}
            className={`px-3 py-2 rounded-lg backdrop-blur-xl shadow-lg font-semibold flex items-center space-x-1.5 text-sm ${
              mapType === 'roadmap'
                ? 'bg-civic-teal text-white'
                : 'bg-white/95 text-slate-700 hover:bg-white'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Map</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMapType('satellite')}
            className={`px-3 py-2 rounded-lg backdrop-blur-xl shadow-lg font-semibold flex items-center space-x-1.5 text-sm ${
              mapType === 'satellite'
                ? 'bg-civic-teal text-white'
                : 'bg-white/95 text-slate-700 hover:bg-white'
            }`}
          >
            <Satellite className="w-4 h-4" />
            <span>Satellite</span>
          </motion.button>
        </div>
      </div>

      {/* Location Indicator */}
      {isLoadingLocation && (
        <div className="absolute top-20 left-4 z-10 px-4 py-2 bg-white/95 backdrop-blur-xl rounded-lg shadow-lg border-2 border-civic-teal">
          <div className="flex items-center space-x-2 text-sm text-slate-700">
            <div className="w-4 h-4 border-2 border-civic-teal border-t-transparent rounded-full animate-spin" />
            <span>Getting location...</span>
          </div>
        </div>
      )}

      <Map
        defaultCenter={mapCenter}
        defaultZoom={13}
        mapTypeId={mapType}
        disableDefaultUI={false}
        gestureHandling="greedy"
        clickableIcons={true}
        onClick={handleMapClick}
        style={{ width: '100%', height: '100%', cursor: showLocationPicker ? 'crosshair' : 'default' }}
        reuseMaps={true}
        controlSize={28}
        zoomControl={true}
        fullscreenControl={true}
      >
        <MapControls mapType={mapType} onMyLocationClick={handleMyLocationClick} />
        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#3b82f6',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            }}
            title="Your Location"
          />
        )}

        {/* Selected Location Marker (for report form) - Large visible pin */}
        {showLocationPicker && selectedLocation && (
          <>
            {/* Main Pin Marker */}
            <Marker
              position={selectedLocation}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF6500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3" fill="#FF6500"></circle>
                  </svg>
                `),
                scaledSize: new google.maps.Size(48, 48),
                anchor: new google.maps.Point(24, 48),
              }}
              title="Selected Report Location"
              animation={google.maps.Animation.DROP}
            />
            {/* Pulsing circle underneath */}
            <Marker
              position={selectedLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 20,
                fillColor: '#FF6500',
                fillOpacity: 0.15,
                strokeColor: '#FF6500',
                strokeWeight: 2,
                strokeOpacity: 0.4,
              }}
            />
          </>
        )}

        {/* Report Markers */}
        {reports.map((report) => (
          <Marker
            key={report._id || report.id}
            position={{ lat: report.latitude, lng: report.longitude }}
            onClick={() => setSelectedReport(report)}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: getMarkerColor(report.status, report.priority),
              fillOpacity: 0.9,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
            label={{
              text: report.description.substring(0, 20) + (report.description.length > 20 ? '...' : ''),
              color: mapType === 'satellite' ? '#ffffff' : '#000000',
              fontSize: '11px',
              fontWeight: 'bold',
            }}
          />
        ))}

        {/* Info Window */}
        {selectedReport && (
          <InfoWindow
            position={{ lat: selectedReport.latitude, lng: selectedReport.longitude }}
            onCloseClick={() => setSelectedReport(null)}
          >
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-slate-900 mb-1">{selectedReport.description}</h3>
              {selectedReport.location && (
                <p className="text-xs text-slate-600 mb-2">{selectedReport.location}</p>
              )}
              <div className="flex items-center space-x-2 mb-2">
                <span
                  className="px-2 py-1 text-xs font-semibold rounded-full"
                  style={{
                    backgroundColor: `${getMarkerColor(selectedReport.status, selectedReport.priority)}20`,
                    color: getMarkerColor(selectedReport.status, selectedReport.priority),
                  }}
                >
                  {selectedReport.status.toUpperCase()}
                </span>
                <span className="px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full">
                  {selectedReport.category}
                </span>
              </div>
              {onReportClick && (
                <button
                  onClick={() => onReportClick(selectedReport._id || selectedReport.id || '')}
                  className="mt-2 w-full px-3 py-1 bg-civic-teal text-white text-sm font-medium rounded hover:bg-civic-teal/90 transition-colors"
                >
                  View Details →
                </button>
              )}
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
}
