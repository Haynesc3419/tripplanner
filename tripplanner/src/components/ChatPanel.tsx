import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Paper, Typography, CircularProgress } from '@mui/material';
import { generateTripPlan } from '../services/geminiService';
import { conversationService } from '../services/conversationService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatPanelProps {
  onItineraryUpdate: (itinerary: any) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ onItineraryUpdate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with conversation history
    const initialMessages = conversationService.getConversationHistory()
      .split('\n')
      .map(line => {
        const [role, ...contentParts] = line.split(': ');
        return {
          role: role as 'user' | 'assistant',
          content: contentParts.join(': '),
          timestamp: Date.now()
        };
      });
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateTripPlan(input);
      
      // Try to extract and update itinerary
      try {
        // Extract the conversational part (everything before JSON_START)
        const conversationalPart = response.split('<!--JSON_START-->')[0].trim();
        
        // Extract the JSON part
        const jsonMatch = response.match(/<!--JSON_START-->([\s\S]*?)<!--JSON_END-->/);
        if (jsonMatch) {
          const itineraryText = jsonMatch[1].trim();
          const itinerary = JSON.parse(itineraryText);
          console.log('Parsed itinerary:', itinerary);
          onItineraryUpdate(itinerary);
        } else {
          console.log('No JSON found in response');
        }

        // Update messages with just the conversational part
        const assistantMessage: Message = {
          role: 'assistant',
          content: conversationalPart,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } catch (e) {
        console.log('Error parsing response:', e);
        // If parsing fails, show the full response
        const assistantMessage: Message = {
          role: 'assistant',
          content: response,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      p: 2,
      gap: 2,
      bgcolor: 'background.paper'
    }}>
      <Paper 
        elevation={0} 
        sx={{ 
          flex: 1, 
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          bgcolor: 'background.default',
          borderRadius: 2
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%'
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 2,
                bgcolor: message.role === 'user' ? 'primary.main' : 'background.paper',
                color: message.role === 'user' ? 'white' : 'text.primary',
                borderRadius: 2
              }}
            >
              <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                {message.content}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Paper>
      
      <Box sx={{ 
        display: 'flex', 
        gap: 1,
        p: 1,
        bgcolor: 'background.paper',
        borderRadius: 2
      }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          sx={{
            borderRadius: 2,
            minWidth: '80px'
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Send'}
        </Button>
      </Box>
    </Box>
  );
}; 