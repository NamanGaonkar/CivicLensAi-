import { APIProvider } from '@vis.gl/react-google-maps';

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Google Maps API key not found in environment variables!");
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p className="font-semibold">Map Configuration Error</p>
        <p className="text-sm">Google Maps API key is missing. Please add it to .env.local</p>
      </div>
    );
  }

  return <APIProvider apiKey={apiKey}>{children}</APIProvider>;
}
