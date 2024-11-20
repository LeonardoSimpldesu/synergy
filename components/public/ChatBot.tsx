'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send } from 'lucide-react'
import { ChatbotManager } from '@/lib/chatbot'

export default function ChatBot() {
  const [chatbot] = useState(() => new ChatbotManager());
  const [state, setState] = useState(() => chatbot.getCurrentState());
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: state.currentAnswer,
      options: state.currentOptions.map(opt => ({
        id: opt.id,
        text: opt.question,
        path: opt.id.toString()
      })),
      answered: false,
    }
  ]);

  const handleOptionClick = (optionText: string) => {
    if (optionText === 'Voltar') {
      setMessages(prev => [...prev, {
        type: 'user',
        text: 'Voltar',
        options: [],
        answered: false
      }]);

      setMessages(prev => prev.map((msg, i) => 
        i === prev.length - 2 ? { ...msg, answered: true } : msg
      ));

      setTimeout(() => {
        chatbot.goBack();
        const newState = chatbot.getCurrentState();
        setState(newState);
        
        setMessages(prev => [...prev, {
          type: 'bot',
          text: newState.currentAnswer,
          options: newState.currentOptions.map(opt => ({
            id: opt.id,
            text: opt.question,
            path: opt.id.toString()
          })),
          answered: false,
        }]);
      }, 500);
      return;
    }

    // Check if this is a final decision option
    const finalDecision = chatbot.getFinalDecision();
    if (finalDecision) {
      const finalOption = finalDecision.options.find(opt => opt.message === optionText);
      if (finalOption) {
        setMessages(prev => [...prev, {
          type: 'user',
          text: optionText,
          options: [],
          answered: false
        }]);

        // If user chose to review options (message contains "review" or similar)
        if (finalOption.message.includes('revisar')) {
          setTimeout(() => {
            chatbot.reset();
            const newState = chatbot.getCurrentState();
            setState(newState);
            
            setMessages([{
              type: 'bot',
              text: newState.currentAnswer,
              options: newState.currentOptions.map(opt => ({
                id: opt.id,
                text: opt.question,
                path: opt.id.toString()
              })),
              answered: false,
            }]);
          }, 500);
        }
        return;
      }
    }

    // Find the option path based on the clicked text
    const selectedOption = state.currentOptions.find(opt => opt.question === optionText);
    if (!selectedOption?.id) return;

    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      text: optionText,
      options: [],
      answered: false
    }]);
    
    // Mark previous bot message as answered
    setMessages(prev => prev.map((msg, i) => 
      i === prev.length - 2 ? { ...msg, answered: true } : msg
    ));

    // Update chatbot state and add new bot message
    setTimeout(() => {
      const newPath = [...state.history, selectedOption.id.toString()];
      chatbot.selectOption(newPath);
      const newState = chatbot.getCurrentState();
      setState(newState);
      
      setMessages(prev => [...prev, {
        type: 'bot',
        text: newState.currentAnswer,
        options: newState.currentOptions.map(opt => ({
          id: opt.id,
          text: opt.question,
          path: opt.id.toString()
        })),
        answered: false,
      }]);

      if (newState.currentOptions.length === 0) {
        const finalDecision = chatbot.getFinalDecision();
        if (finalDecision) {
          setTimeout(() => {
            setMessages(prev => [...prev, {
              type: 'bot',
              text: finalDecision.message,
              options: finalDecision.options.map((opt, index) => ({
                id: index,
                text: opt.message,
                path: index.toString()
              })),
              answered: false,
            }]);
          }, 1000);
        }
      }
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex-1">
        <ScrollArea className="h-[calc(100vh-80px)] p-4">
          <div className="flex flex-col">
            {messages.map((message, index) => (
              message.type === 'bot' ? (
                <BotMessage 
                  key={index}
                  text={message.text}
                  showOptions={message.options?.length > 0}
                  answered={message.answered}
                  onOptionClick={handleOptionClick}
                  options={message.options}
                  showBackButton={state.history.length > 0}
                />
              ) : (
                <UserMessage 
                  key={index}
                  text={message.text}
                />
              )
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="bg-background p-4 flex items-center h-[80px]">
        <Input
          disabled
          type="text"
          placeholder="Digite sua mensagem..."
          className="flex-1 mr-2 bg-gray-200"
        />
        <Button size="icon" disabled>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function BotMessage({ 
  text, 
  showOptions = false, 
  answered = false,
  onOptionClick,
  options = [],
  showBackButton = true
}: { 
  text: string, 
  showOptions?: boolean, 
  answered?: boolean,
  onOptionClick?: (option: string) => void,
  options?: Array<{id: number, text: string, path: string}>,
  showBackButton?: boolean
}) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className='flex justify-start gap-2 mb-4 max-w-[60%]'>
      <Avatar className="h-10 w-10 mr-3">
        <AvatarImage
          src="/placeholder-avatar.jpg"
          alt="Suporte Condelivery"
        />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-4">
        <div className="rounded-lg p-3 bg-primary text-primary-foreground">
          {text.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
          <p className="text-xs mt-1 opacity-75">
            {formatTime(new Date())}
          </p>
        </div>
        {showOptions && !answered && (
          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <Button 
                key={option.id} 
                onClick={() => onOptionClick?.(option.text)}
                variant="secondary"
                className="text-left"
              >
                {option.text}
              </Button>
            ))}
            {showBackButton && (
              <Button 
                onClick={() => onOptionClick?.('Voltar')}
                variant="outline"
                className="text-left"
              >
                Voltar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function UserMessage({ text }: { text: string }) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return(
    <div
    className='flex flex-row-reverse gap-2 justify-start ml-auto mb-4 max-w-[60%]'
  >
    <Avatar className="h-10 w-10 mr-3 bg-gray-700">
      <AvatarImage
        src="/placeholder-avatar.jpg"
        alt="Suporte Condelivery"
      />
      <AvatarFallback >SC</AvatarFallback>
    </Avatar>
    <div className="flex flex-col gap-4">
      <div
        className='rounded-lg p-3 bg-secondary text-black'
      >
        <p>{text}</p>
        <p className="text-xs mt-1 opacity-75">
          {formatTime(new Date())}
        </p>
      </div>
    </div>
  </div>
  )
}