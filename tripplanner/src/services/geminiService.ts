import { GoogleGenerativeAI } from '@google/generative-ai';
import { conversationService } from './conversationService';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');

const TRIP_PLANNING_PROMPT = `You are an AI trip planning assistant. Your goal is to help users plan their perfect trip.
You should:
1. Extract key information about their trip (destination, dates, budget, preferences)
2. Create and update a detailed itinerary based on their inputs
3. Provide relevant suggestions and recommendations
4. Keep track of the conversation context and previous decisions
5. When appropriate, present specific choices to the user (e.g., hotel options, transportation methods)
6. Its important that you are concise and ask questions one at a time. Start with bigger decisions
like where to stay and how to get there. then narrow down to activities and eating.
7. Also you should assume the user knows very little about the destination. Dont ask too many open ended questions. 
give them options and also give them the option to leave it open ended.

Format your response as a JSON object with the following structure:
{
  "conversation": "Your friendly, conversational reply to the user",
  "itinerary": {
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
  },
  "choices": [
    {
      "type": "hotel" | "transportation" | "activity" | "restaurant",
      "question": "Please select your preferred option for [specific choice]:",
      "options": [
        {
          "id": "option1",
          "name": "Option 1 Name",
          "description": "Detailed description of this option",
          "price": "Price information if available",
          "location": "Location if relevant"
        },
        {
          "id": "option2",
          "name": "Option 2 Name",
          "description": "Detailed description of this option",
          "price": "Price information if available",
          "location": "Location if relevant"
        }
      ]
    }
  ]
}

IMPORTANT: Only include choices when you need the user to make a specific selection. Each choice should:
1. Have a clear, specific question (e.g., "Please select your hotel for May 15-17 in Paris:")
2. Include 2-4 distinct options with clear differences
3. Each option should have a unique ID, name, and description
4. Include price and location information when relevant

Current context:`;

export const generateTripPlan = async (userInput: string): Promise<{
  conversation: string;
  itinerary: any;
  choices: Array<{
    type: string;
    question: string;
    options: Array<{
      id: string;
      name: string;
      description: string;
      price?: string;
      location?: string;
    }>;
  }>;
}> => {
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
2. Suggests next steps in the planning process. Please make your responses concise and ask questions one at a time.
3. Provides a structured itinerary update if relevant
4. Includes specific choices when appropriate`;

    console.log('Sending prompt to Gemini:', prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response text by removing markdown formatting
    const cleanedText = text
      .replace(/```json\n?/g, '')  // Remove opening ```json
      .replace(/```\n?/g, '')      // Remove closing ```
      .trim();
    
    // Parse the JSON response
    const parsedResponse = JSON.parse(cleanedText);
    
    // Add assistant's response to conversation history
    conversationService.addMessage('assistant', parsedResponse.conversation);
    
    // Try to extract and update context from the response
    try {
      const contextUpdate = JSON.parse(text.split('Context Update:')[1]?.trim() || '{}');
      conversationService.updateContext(contextUpdate);
    } catch (e) {
      console.log('No context update found in response');
    }
    
    return parsedResponse;
  } catch (error) {
    console.error('Error generating trip plan:', error);
    throw error;
  }
}; 