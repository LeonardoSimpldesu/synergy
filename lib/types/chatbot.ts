export interface ChatbotOption {
  id: number;
  question: string;
  answer: string;
  options?: Record<string, ChatbotOption>;
  icon?: string;
}

export interface ChatbotState {
  currentAnswer: string;
  currentOptions: ChatbotOption[];
  history: string[];
}

export interface ChatbotData {
  data: {
    answer: string;
    options: Record<string, ChatbotOption>;
    finalDecision?: {
      message: string;
      options: Array<{ message: string }>;
    };
  };
} 