export interface ChatbotOption {
  id: number;
  question: string;
  answer: string;
  icon?: string;
  options?: Record<string, ChatbotOption>;
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
    finalDecision: {message: string}
  };
} 