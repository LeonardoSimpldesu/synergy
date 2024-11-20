'use client'

import { Button } from '@/components/ui/button';
import { ChatbotManager } from '@/lib/chatbot';
import { useState } from 'react';

export function ChatBot() {
  const [chatbot] = useState(() => new ChatbotManager());
  const [state, setState] = useState(() => chatbot.getCurrentState());

  const handleOptionClick = (optionPath: string[]) => {
    chatbot.selectOption(optionPath);
    setState(chatbot.getCurrentState());
  };

  const handleBack = () => {
    if (chatbot.goBack()) {
      setState(chatbot.getCurrentState());
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-screen w-screen gap-16">
      <div className="">
        {state.currentAnswer}
      </div>
      
      <div className="flex flex-col mx-auto gap-4 w-1/2">
        {state.currentOptions.map((option, index) => (
          <Button 
            key={index}
            onClick={() => handleOptionClick([...state.history, (index + 1).toString()])}
          >
            {option.question}
          </Button>
        ))}
        {state.history.length > 0 && (
          <Button onClick={handleBack}>Voltar</Button>
        )}
      </div>
    </div>
  );
} 