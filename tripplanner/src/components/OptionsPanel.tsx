import React, { useState } from 'react';
import { Box, Typography, Button, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, CircularProgress } from '@mui/material';
import ListIcon from '@mui/icons-material/List';

interface Choice {
  type: string;
  question: string;
  options: Array<{
    id: string;
    name: string;
    description: string;
    price?: string;
    location?: string;
  }>;
}

interface OptionsPanelProps {
  itinerary: any;
  onItineraryUpdate: (itinerary: any) => void;
  onDrawerToggle: () => void;
  onChoiceSelect: (choiceId: string) => void;
  choices: Choice[];
  isProcessingChoice: boolean;
}

export const OptionsPanel: React.FC<OptionsPanelProps> = ({ 
  itinerary, 
  onItineraryUpdate,
  onDrawerToggle,
  onChoiceSelect,
  choices,
  isProcessingChoice
}) => {
  return (
    <Box sx={{ 
      height: '100%', 
      width: '100%',
      p: 1,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 1 
      }}>
        <Typography variant="subtitle1">Trip Options</Typography>
        <Button
          variant="contained"
          startIcon={<ListIcon />}
          onClick={onDrawerToggle}
          sx={{ borderRadius: 2 }}
        >
          View Itinerary
        </Button>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}>
        {choices.length > 0 ? (
          choices.map((choice, index) => (
            <Box key={index} sx={{ 
              mb: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="subtitle1" sx={{ 
                mb: 1, 
                color: 'primary.main',
                flexShrink: 0,
                fontSize: '0.9rem'
              }}>
                {choice.question}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 1,
                overflowX: 'auto',
                flex: 1,
                minHeight: 0,
                position: 'relative',
                '&::-webkit-scrollbar': {
                  height: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '4px',
                  '&:hover': {
                    background: 'rgba(0, 0, 0, 0.3)',
                  },
                },
              }}>
                {isProcessingChoice && (
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    zIndex: 1
                  }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
                {choice.options.map((option) => (
                  <Paper
                    key={option.id}
                    elevation={2}
                    onClick={() => onChoiceSelect(option.id)}
                    sx={{
                      p: 1.5,
                      minWidth: '250px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: isProcessingChoice ? 'not-allowed' : 'pointer',
                      opacity: isProcessingChoice ? 0.7 : 1,
                      '&:hover': {
                        bgcolor: isProcessingChoice ? 'inherit' : 'action.hover',
                        transform: isProcessingChoice ? 'none' : 'translateY(-2px)',
                        transition: 'transform 0.2s ease-in-out'
                      }
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ 
                      fontWeight: 'bold',
                      fontSize: '0.85rem'
                    }}>
                      {option.name}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      mt: 0.5,
                      flex: 1,
                      fontSize: '0.8rem',
                      lineHeight: 1.2
                    }}>
                      {option.description}
                    </Typography>
                    <Box sx={{ 
                      mt: 0.5, 
                      display: 'flex', 
                      gap: 1,
                      fontSize: '0.75rem'
                    }}>
                      {option.price && (
                        <Typography variant="caption" color="text.secondary">
                          💰 {option.price}
                        </Typography>
                      )}
                      {option.location && (
                        <Typography variant="caption" color="text.secondary">
                          📍 {option.location}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>
          ))
        ) : (
          <Typography color="text.secondary" sx={{ 
            textAlign: 'center', 
            mt: 2,
            fontSize: '0.9rem'
          }}>
            No choices available. Start chatting to see options!
          </Typography>
        )}
      </Box>
    </Box>
  );
}; 