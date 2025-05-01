import { GoogleGenerativeAI } from '@google/generative-ai';
import { conversationService } from './conversationService';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');

const TRIP_PLANNING_PROMPT = `You are an AI trip planning assistant. Your goal is to help users plan their perfect trip.
You should:
1. Extract key information about their trip (destination, dates, budget, preferences)
2. Create and update a detailed itinerary based on their inputs
3. Provide relevant suggestions and recommendations
4. Keep track of the conversation context and previous decisions

Format your response in two parts:

1. First, provide a friendly, conversational reply to the user.

2. Then, include the itinerary update in JSON format between these markers:
<!--JSON_START-->
{
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "time": "HH:MM",
          "description": "Activity description",
          "location": "Location name"
        }
      ]
    }
  ]
}
<!--JSON_END-->

Current context:
`;

export const generateTripPlan = async (userInput: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: process.env.REACT_APP_GEMINI_API_MODEL || 'gemini-1.5-flash-001' });
    
    // Add user message to conversation history
    conversationService.addMessage('user', userInput);
    
    // Get conversation history and context
    const history = conversationService.getConversationHistory();
    const context = conversationService.getContext();
    
    // Create the prompt with history and context
    const prompt = `${TRIP_PLANNING_PROMPT}
${JSON.stringify(context, null, 2)}

Conversation History:
${history}

Please analyze the conversation and provide a helpful response that:
1. Updates the trip context if new information is provided
2. Suggests next steps in the planning process
3. Provides a structured itinerary update if relevant`;

    console.log('Sending prompt to Gemini:', prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Add assistant's response to conversation history
    conversationService.addMessage('assistant', text);
    
    // Try to extract and update context from the response
    try {
      const contextUpdate = JSON.parse(text.split('Context Update:')[1]?.trim() || '{}');
      conversationService.updateContext(contextUpdate);
    } catch (e) {
      console.log('No context update found in response');
    }
    
    return text;
  } catch (error) {
    console.error('Error generating trip plan:', error);
    throw error;
  }
}; 