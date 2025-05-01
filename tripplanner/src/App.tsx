import React, { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ChatPanel } from './components/ChatPanel';
import { MapPanel } from './components/MapPanel';
import { OptionsPanel } from './components/OptionsPanel';
import { ItineraryDrawer } from './components/ItineraryDrawer';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  const [itinerary, setItinerary] = useState<{ days?: Array<{
    day: number;
    date: string;
    activities: Array<{
      time: string;
      description: string;
      location?: string;
    }>;
  }>}>({ days: [] });
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
        position: 'relative',
        bgcolor: 'background.default'
      }}>
        {/* Left Panel - Chat */}
        <Box sx={{ 
          width: '30%', 
          height: '100%',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper'
        }}>
          <ChatPanel 
            onItineraryUpdate={setItinerary}
          />
        </Box>

        {/* Right Panel - Map */}
        <Box sx={{ 
          width: '70%', 
          height: '70%',
          position: 'relative',
          bgcolor: 'background.paper'
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
          bgcolor: 'background.paper',
          borderTop: '1px solid rgba(0, 0, 0, 0.12)',
          zIndex: 1000,
          boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column'
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
        />
      </Box>
    </ThemeProvider>
  );
}

export default App; 