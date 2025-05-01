import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');

export const generateTripPlan = async (prompt: string) => {
  try {
    console.log('Generating trip plan with prompt:', prompt);
    console.log('API Key present:', !!process.env.REACT_APP_GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({model: process.env.REACT_APP_GEMINI_API_MODEL || 'gemini-1.5-flash-001'});

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Received response:', text);
    return text;
  } catch (error) {
    console.error('Detailed error in generateTripPlan:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate trip plan: ${error.message}`);
    }
    throw new Error('Failed to generate trip plan: Unknown error');
  }
}; 