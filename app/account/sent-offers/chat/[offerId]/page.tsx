'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendIcon, Loader2, ChevronDown } from 'lucide-react';
import pb from '@/app/pocketbase';
import { RecordModel } from 'pocketbase';
import { toast } from '@/hooks/use-toast';
import isAuth from '@/components/isAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';

type Params = {
  offerId: string;
};

interface SentOffersChatProps {
  params: Params;
}

const SentOffersChatPage: React.FC<SentOffersChatProps> = ({ params }: { params: { offerId: string } }) => {
  const offerId = params.offerId;
  const [messages, setMessages] = useState<RecordModel[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [receiverId, setReceiverId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    if (!offerId) return;
  
    const fetchOfferDetails = async () => {
      try {
        const offer = await pb.collection('offers').getOne(offerId);
        setReceiverId(offer.receiver);
      } catch (error) {
        console.error('Error fetching offer details:', error);
      }
    };
  
    fetchOfferDetails();
  }, [offerId]);
    
  useEffect(() => {
    if (offerId) {
      pb.collection('messages').subscribe('*', function (e) {
        if (e.record.offer !== offerId) return;
        setMessages(prevMessages => [...prevMessages, e.record]);
      });

      fetchMessages(offerId);
    }

    return () => {
      pb.collection('messages').unsubscribe("*");
    };
  }, [offerId]);

  const fetchMessages = async (offerId: string) => {
    setIsLoading(true);
    try {
      const messagesList = await pb.collection('messages').getList(1, 50, {
        filter: `offer="${offerId}"`,
        sort: '+created',
        expand: 'sender,receiver',
      });
      setMessages(messagesList.items);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 20);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !offerId) return;

    try {
      await pb.collection('messages').create({
        offer: offerId,
        sender: pb.authStore.model?.id,
        content: newMessage,
        receiver: receiverId,
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'There was an error sending your message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(90vh-2rem)]">
      <header className="bg-primary dark:bg-gray-700 text-primary-foreground dark:text-gray-100 px-6 py-3 shadow-md">
        <h2 className="text-xl font-semibold">Chat with Seller</h2>
      </header>
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-3"
        onScroll={handleScroll}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex mb-4 ${
                  message.sender === pb.authStore.model?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender !== pb.authStore.model?.id && (
                  <Avatar className="mr-2">
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.expand?.sender?.name || 'S'}`} />
                    <AvatarFallback>{message.expand?.sender?.name?.[0] || 'S'}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[70%] ${
                  message.sender === pb.authStore.model?.id 
                    ? 'bg-primary dark:bg-blue-600 text-primary-foreground dark:text-white' 
                    : 'bg-secondary dark:bg-gray-600 text-secondary-foreground dark:text-gray-100'
                } rounded-lg py-2 px-4 shadow`}>
                  <p className="break-words">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {format(new Date(message.created), 'HH:mm')}
                  </p>
                </div>
                {message.sender === pb.authStore.model?.id && (
                  <Avatar className="ml-2">
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${pb.authStore.model?.name || 'Y'}`} />
                    <AvatarFallback>{pb.authStore.model?.name?.[0] || 'Y'}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      {showScrollButton && (
        <Button
          className="fixed bottom-32 right-8 rounded-full shadow-lg"
          size="icon"
          onClick={scrollToBottom}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
      <div className="bg-background dark:bg-gray-800 px-6 py-3 border-t dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-grow max-h-32 resize-none dark:bg-gray-700 dark:text-gray-100"
            rows={2}
          />
          <Button onClick={sendMessage} size="icon" className="h-full aspect-square">
            <SendIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default isAuth(SentOffersChatPage);

