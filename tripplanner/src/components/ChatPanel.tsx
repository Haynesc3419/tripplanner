import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { generateTripPlan } from '../services/geminiService';

interface ChatPanelProps {
  onItineraryUpdate: (itinerary: any) => void;
  onLocationUpdate: (location: [number, number]) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onItineraryUpdate, onLocationUpdate }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setError(null);
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      console.log('Sending message to Gemini:', userMessage);
      const response = await generateTripPlan(userMessage);
      console.log('Received response from Gemini:', response);
      
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
      
      // TODO: Parse response to extract locations and itinerary
      // For now, just update with a mock location
      onLocationUpdate([-74.006, 40.7128]); // New York City
    } catch (error) {
      console.error('Error in handleSend:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Trip Planning Assistant</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
        {chatHistory.map((msg, index) => (
          <Paper 
            key={index} 
            sx={{ 
              p: 2, 
              mb: 1, 
              backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
              maxWidth: '80%',
              ml: msg.role === 'user' ? 'auto' : 0
            }}
          >
            <Typography>{msg.content}</Typography>
          </Paper>
        ))}
        {isLoading && (
          <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
            Thinking...
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask about your trip..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatPanel; 