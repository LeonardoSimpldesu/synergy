import ChatBot from '@/components/public/ChatBot'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Synergy',
  description:
    'Synergy: A maneira mais fácil de reduzir sua pegada de carbono.',
};

export default function ChatPage() {
  return (
    <div className="h-full">
      <ChatBot />
    </div>
  )
}