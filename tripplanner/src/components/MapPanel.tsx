import React from 'react';
import { Box, Typography } from '@mui/material';
import { Map, Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapPanelProps {
  currentLocation: [number, number] | null;
  itinerary: any;
}

const DEFAULT_LOCATION: [number, number] = [-74.006, 40.7128]; // New York City coordinates

const MapPanel: React.FC<MapPanelProps> = ({ currentLocation, itinerary }) => {
  const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;
  
  console.log('Mapbox Token:', mapboxToken); // Debug log

  if (!mapboxToken) {
    return (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error">
          Mapbox token is missing. Please set REACT_APP_MAPBOX_TOKEN in your .env file.
          Current value: {mapboxToken || 'undefined'}
        </Typography>
      </Box>
    );
  }

  const location = currentLocation || DEFAULT_LOCATION;

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Map
        initialViewState={{
          longitude: location[0],
          latitude: location[1],
          zoom: 12
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={mapboxToken}
      >
        <Marker
          longitude={location[0]}
          latitude={location[1]}
        />
        <NavigationControl />
      </Map>
    </Box>
  );
};

export default MapPanel; 