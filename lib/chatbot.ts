import chatbotData from '../app/chatbot.json';
import { ChatbotData, ChatbotState, ChatbotOption } from './types/chatbot';

export class ChatbotManager {
  private data: ChatbotData;
  private state: ChatbotState;

  constructor() {
    this.data = chatbotData as ChatbotData;
    this.state = {
      currentAnswer: this.data.data.answer,
      currentOptions: Object.values(this.data.data.options),
      history: []
    };
  }

  public getCurrentState(): ChatbotState {
    return this.state;
  }

  public selectOption(optionPath: string[]): void {
    let currentLevel = this.data.data.options;
    let selectedOption: ChatbotOption | undefined;
    
    for (const path of optionPath) {
      selectedOption = currentLevel[path];
      if (!selectedOption) {
        throw new Error(`Invalid option path: ${optionPath.join('.')}`);
      }
      currentLevel = selectedOption.options || {};
    }

    if (!selectedOption) {
      throw new Error('No option selected');
    }

    const isFinalOption = !selectedOption.options || Object.keys(selectedOption.options).length === 0;

    this.state = {
      currentAnswer: selectedOption.answer,
      currentOptions: isFinalOption ? [] : Object.values(selectedOption.options || {}),
      history: optionPath
    };
  }

  public goBack(): boolean {
    if (this.state.history.length === 0) {
      return false;
    }

    const newHistory = this.state.history.slice(0, -1);
    
    if (newHistory.length === 0) {
      this.state = {
        currentAnswer: this.data.data.answer,
        currentOptions: Object.values(this.data.data.options),
        history: []
      };
    } else {
      let currentLevel = this.data.data.options;
      let selectedOption: ChatbotOption | undefined;

      for (const path of newHistory) {
        selectedOption = currentLevel[path];
        currentLevel = selectedOption?.options || {};
      }

      if (!selectedOption) {
        throw new Error('Invalid path in history');
      }

      this.state = {
        currentAnswer: selectedOption.answer,
        currentOptions: selectedOption.options ? Object.values(selectedOption.options) : [],
        history: newHistory
      };
    }

    return true;
  }

  public reset(): void {
    this.state = {
      currentAnswer: this.data.data.answer,
      currentOptions: Object.values(this.data.data.options),
      history: []
    };
  }

  public finalState(): ChatbotData {
    return this.data;
  }

  public getFinalDecision(): { message: string, options: Array<{ message: string }> } | null {
    return this.data.data.finalDecision || null;
  }
}