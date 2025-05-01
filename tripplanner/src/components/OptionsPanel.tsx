import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ListIcon from '@mui/icons-material/List';

interface OptionsPanelProps {
  itinerary: any;
  onItineraryUpdate: (itinerary: any) => void;
  onDrawerToggle: () => void;
}

const OptionsPanel: React.FC<OptionsPanelProps> = ({ 
  itinerary, 
  onItineraryUpdate,
  onDrawerToggle 
}) => {
  return (
    <Box sx={{ height: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Trip Options</Typography>
        <Button
          variant="contained"
          startIcon={<ListIcon />}
          onClick={onDrawerToggle}
        >
          View Itinerary
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, overflow: 'auto' }}>
        {/* Sample options - these would be populated based on the current context */}
        <Paper sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle1">Accommodation</Typography>
          <Typography variant="body2">Select your preferred hotels</Typography>
        </Paper>

        <Paper sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle1">Transportation</Typography>
          <Typography variant="body2">Choose how to get around</Typography>
        </Paper>

        <Paper sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle1">Activities</Typography>
          <Typography variant="body2">Pick things to do</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default OptionsPanel; 