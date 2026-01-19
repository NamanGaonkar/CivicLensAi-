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
    
    // Enable proper map interaction
    map.setOptions({
      gestureHandling: 'greedy',
      clickableIcons: false,
      disableDoubleClickZoom: false,
      scrollwheel: true,
      // Enable all POI (Points of Interest) and place labels
      styles: [], // Clear any styles to show all default labels
    });

    // Create control container
    const controlDiv = document.createElement("div");
    controlDiv.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 10px;
    `;

    // Zoom In Button
    const zoomInButton = document.createElement("button");
    zoomInButton.textContent = "+";
    zoomInButton.style.cssText = `
      background-color: #fff;
      border: 0;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      color: rgb(25,25,25);
      cursor: pointer;
      font-family: Roboto,Arial,sans-serif;
      font-size: 24px;
      font-weight: bold;
      line-height: 38px;
      padding: 0;
      text-align: center;
      height: 40px;
      width: 40px;
    `;
    zoomInButton.title = "Zoom in";
    zoomInButton.type = "button";
    zoomInButton.addEventListener("click", () => {
      const currentZoom = map.getZoom() || 13;
      map.setZoom(currentZoom + 1);
    });

    // Zoom Out Button
    const zoomOutButton = document.createElement("button");
    zoomOutButton.textContent = "−";
    zoomOutButton.style.cssText = `
      background-color: #fff;
      border: 0;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      color: rgb(25,25,25);
      cursor: pointer;
      font-family: Roboto,Arial,sans-serif;
      font-size: 24px;
      font-weight: bold;
      line-height: 38px;
      padding: 0;
      text-align: center;
      height: 40px;
      width: 40px;
    `;
    zoomOutButton.title = "Zoom out";
    zoomOutButton.type = "button";
    zoomOutButton.addEventListener("click", () => {
      const currentZoom = map.getZoom() || 13;
      map.setZoom(currentZoom - 1);
    });

    // My Location Button
    const locationButton = document.createElement("button");
    locationButton.textContent = "📍";
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
      padding: 0;
      text-align: center;
      height: 40px;
      width: 40px;
    `;
    locationButton.title = "Go to my location";
    locationButton.type = "button";
    locationButton.addEventListener("click", onMyLocationClick);
    
    // Add buttons to container
    controlDiv.appendChild(zoomInButton);
    controlDiv.appendChild(zoomOutButton);
    controlDiv.appendChild(locationButton);
    
    // Add to map
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
    
    return () => {
      const index = map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].getArray().indexOf(controlDiv);
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
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    selectedLocation || { lat: 15.4909, lng: 73.8278 } // Default to Goa
  );
  const map = useMap();

  // Update map center when selectedLocation changes (for location picker mode)
  useEffect(() => {
    if (showLocationPicker && selectedLocation && map) {
      map.panTo(selectedLocation);
      setMapCenter(selectedLocation);
    }
  }, [selectedLocation, showLocationPicker, map]);

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
    console.log('Map clicked:', e);
    if (showLocationPicker && onLocationSelect) {
      // Try multiple ways to access lat/lng from the click event
      let location;
      
      if (e.detail && e.detail.latLng) {
        // vis.gl/react-google-maps event structure
        location = {
          lat: e.detail.latLng.lat,
          lng: e.detail.latLng.lng,
        };
      } else if (e.latLng) {
        // Traditional Google Maps event structure
        location = {
          lat: typeof e.latLng.lat === 'function' ? e.latLng.lat() : e.latLng.lat,
          lng: typeof e.latLng.lng === 'function' ? e.latLng.lng() : e.latLng.lng,
        };
      }
      
      if (location) {
        onLocationSelect(location);
        console.log('Location selected:', location);
      } else {
        console.error('Could not extract location from click event');
      }
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
    <div className="relative h-full w-full rounded-xl overflow-hidden shadow-xl">
      {/* Pin Placement Mode Indicator - Top center */}
      {showLocationPicker && (
        <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-10 px-2 sm:px-4 py-1 sm:py-2 bg-accent-orange text-white rounded-lg shadow-lg font-semibold text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2">
          <MapPinned className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Click map to place pin</span>
        </div>
      )}

      {/* Map Type Toggle - Bottom left */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-2 sm:left-4 z-10">
        <div className="flex gap-1 sm:gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMapType('roadmap')}
            className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg backdrop-blur-xl shadow-lg font-semibold flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm ${
              mapType === 'roadmap'
                ? 'bg-civic-teal text-white'
                : 'bg-white/95 text-slate-700 hover:bg-white'
            }`}
          >
            <MapIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Map</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMapType('satellite')}
            className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg backdrop-blur-xl shadow-lg font-semibold flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm ${
              mapType === 'satellite'
                ? 'bg-civic-teal text-white'
                : 'bg-white/95 text-slate-700 hover:bg-white'
            }`}
          >
            <Satellite className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Satellite</span>
          </motion.button>
        </div>
      </div>

      {/* Location Loading Indicator - Top left */}
      {isLoadingLocation && (
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10 px-2 sm:px-4 py-1 sm:py-2 bg-white/95 backdrop-blur-xl rounded-lg shadow-lg border-2 border-civic-teal">
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-slate-700">
            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-civic-teal border-t-transparent rounded-full animate-spin" />
            <span className="hidden sm:inline">Getting location...</span>
          </div>
        </div>
      )}

      <Map
        defaultCenter={mapCenter}
        defaultZoom={13}
        mapTypeId={mapType}
        disableDefaultUI={true}
        gestureHandling="greedy"
        clickableIcons={false}
        onClick={handleMapClick}
        style={{ width: '100%', height: '100%', cursor: showLocationPicker ? 'crosshair' : 'default' }}
        reuseMaps={true}
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
