import React from 'react';
import { Drawer, Box, Typography, IconButton, List, ListItem, ListItemText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ItineraryDrawerProps {
  open: boolean;
  onClose: () => void;
  itinerary: any;
  onItineraryUpdate: (itinerary: any) => void;
}

const ItineraryDrawer: React.FC<ItineraryDrawerProps> = ({
  open,
  onClose,
  itinerary,
  onItineraryUpdate,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ width: '40%' }}
    >
      <Box sx={{ width: '100%', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Trip Itinerary</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {itinerary ? (
          <List>
            {itinerary.days?.map((day: any, index: number) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={`Day ${index + 1}`}
                  secondary={
                    <Box>
                      <Typography variant="body2">Location: {day.location}</Typography>
                      <Typography variant="body2">Accommodation: {day.accommodation}</Typography>
                      <Typography variant="body2">Activities: {day.activities?.join(', ')}</Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No itinerary created yet. Start planning your trip in the chat!
          </Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default ItineraryDrawer; 