interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface TripContext {
  destination?: string;
  startDate?: string;
  endDate?: string;
  budget?: string;
  preferences?: string[];
  currentItinerary?: any;
}

class ConversationService {
  private messages: Message[] = [];
  private context: TripContext = {};

  constructor() {
    // Initialize with system message about trip planning
    this.addMessage('assistant', `I'm your AI trip planning assistant. I'll help you plan your perfect trip. 
    Please tell me:
    1. Where would you like to go?
    2. When are you planning to travel?
    3. What's your budget?
    4. Any specific preferences or interests?`);
  }

  addMessage(role: 'user' | 'assistant', content: string) {
    this.messages.push({
      role,
      content,
      timestamp: Date.now()
    });
  }

  getConversationHistory(): string {
    return this.messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
  }

  updateContext(newContext: Partial<TripContext>) {
    this.context = { ...this.context, ...newContext };
  }

  getContext(): TripContext {
    return this.context;
  }

  getLastUserMessage(): string | undefined {
    const userMessages = this.messages.filter(msg => msg.role === 'user');
    return userMessages[userMessages.length - 1]?.content;
  }

  clear() {
    this.messages = [];
    this.context = {};
    // Re-add the initial system message
    this.addMessage('assistant', `I'm your AI trip planning assistant. I'll help you plan your perfect trip. 
    Please tell me:
    1. Where would you like to go?
    2. When are you planning to travel?
    3. What's your budget?
    4. Any specific preferences or interests?`);
  }
}

export const conversationService = new ConversationService(); 