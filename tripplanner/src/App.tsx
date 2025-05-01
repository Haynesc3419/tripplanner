import React, { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ChatPanel from './components/ChatPanel';
import MapPanel from './components/MapPanel';
import OptionsPanel from './components/OptionsPanel';
import ItineraryDrawer from './components/ItineraryDrawer';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [itinerary, setItinerary] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        height: '100vh', 
        width: '100vw',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Left Panel - Chat */}
        <Box sx={{ 
          width: '30%', 
          height: '100%',
          borderRight: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <ChatPanel 
            onItineraryUpdate={setItinerary}
            onLocationUpdate={setCurrentLocation}
          />
        </Box>

        {/* Right Panel - Map */}
        <Box sx={{ 
          width: '70%', 
          height: '100%',
          position: 'relative'
        }}>
          <MapPanel 
            currentLocation={currentLocation}
            itinerary={itinerary}
          />
        </Box>

        {/* Bottom Panel - Options */}
        <Box sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: '30%', 
          right: 0, 
          height: '30%',
          backgroundColor: 'white',
          borderTop: '1px solid #e0e0e0',
          zIndex: 1000
        }}>
          <OptionsPanel 
            itinerary={itinerary}
            onItineraryUpdate={setItinerary}
            onDrawerToggle={() => setIsDrawerOpen(true)}
          />
        </Box>

        {/* Itinerary Drawer */}
        <ItineraryDrawer 
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          itinerary={itinerary}
          onItineraryUpdate={setItinerary}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App; 