import React, { useState } from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Divider,
  IconButton,
  Paper
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface ItineraryItem {
  day: number;
  date: string;
  activities: Array<{
    time: string;
    description: string;
    location?: string;
  }>;
}

interface ItineraryDrawerProps {
  open: boolean;
  onClose: () => void;
  itinerary: {
    days?: ItineraryItem[];
  };
}

export const ItineraryDrawer: React.FC<ItineraryDrawerProps> = ({ 
  open, 
  onClose,
  itinerary 
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        width: 360,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 360,
          boxSizing: 'border-box',
          p: 2,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Trip Itinerary
        </Typography>
        <IconButton 
          onClick={onClose}
          sx={{ 
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
      
      {!itinerary?.days?.length ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
          No itinerary planned yet. Start chatting to create your trip plan!
        </Typography>
      ) : (
        <List>
          {(itinerary.days || []).map((day, index) => (
            <React.Fragment key={day.day}>
              <Paper elevation={1} sx={{ mb: 2, p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Day {day.day} - {day.date}
                </Typography>
                <List>
                  {day.activities.map((activity, activityIndex) => (
                    <ListItem key={activityIndex} sx={{ pl: 0 }}>
                      <ListItemText
                        primary={activity.time}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {activity.description}
                            </Typography>
                            {activity.location && (
                              <Typography variant="caption" color="text.secondary">
                                Location: {activity.location}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
              {itinerary.days && index < itinerary.days.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Drawer>
  );
}; 