import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Paper, Typography, CircularProgress } from '@mui/material';
import { generateTripPlan } from '../services/geminiService';
import { conversationService } from '../services/conversationService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

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

interface ChatPanelProps {
  onItineraryUpdate: (itinerary: any) => void;
  onChoicesUpdate: (choices: Choice[]) => void;
  onAddMessage?: (message: Message) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ 
  onItineraryUpdate, 
  onChoicesUpdate,
  onAddMessage 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to update messages from conversation history
  const updateMessagesFromHistory = () => {
    const history = conversationService.getConversationHistory();
    const newMessages = history
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [role, ...contentParts] = line.split(': ');
        return {
          role: role as 'user' | 'assistant',
          content: contentParts.join(': ').replace(/\\n/g, '\n'), // Handle newlines in content
          timestamp: Date.now()
        };
      });
    setMessages(newMessages);
  };

  // Initialize messages and set up interval to check for updates
  useEffect(() => {
    updateMessagesFromHistory();
    
    // Check for updates every 500ms
    const interval = setInterval(updateMessagesFromHistory, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (message: Message) => {
    console.log('Adding message:', message);
    setMessages(prev => {
      const newMessages = [...prev, message];
      console.log('Updated messages:', newMessages);
      return newMessages;
    });
    if (onAddMessage) {
      onAddMessage(message);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending message to LLM:', input);
      const response = await generateTripPlan(input);
      console.log('Received response from LLM:', response);
      
      // Update itinerary
      if (response.itinerary) {
        onItineraryUpdate(response.itinerary);
      }

      // Update choices
      if (response.choices && response.choices.length > 0) {
        onChoicesUpdate(response.choices);
      }

      // Update messages with the conversational part
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.conversation,
        timestamp: Date.now()
      };
      console.log('Adding assistant message:', assistantMessage);
      addMessage(assistantMessage);
    } catch (error) {
      console.error('Error in chat:', error);
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      });
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
        {messages.map((message, index) => {
          console.log('Rendering message:', message);
          return (
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
          );
        })}
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