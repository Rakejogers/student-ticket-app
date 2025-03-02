'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendIcon, Loader2, ChevronDown, X } from 'lucide-react';
import pb from '@/app/pocketbase';
import { RecordModel } from 'pocketbase';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { RegExpMatcher, TextCensor, englishDataset, englishRecommendedTransformers } from 'obscenity';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ChatInterfaceProps {
  offerId: string;
  role: 'buyer' | 'seller';
  onBack?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ offerId, role, onBack }) => {
  const router = useRouter();
  const [messages, setMessages] = useState<RecordModel[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [receiverId, setReceiverId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [partnerName, setPartnerName] = useState<string>('');

  const matcher = new RegExpMatcher({
    ...englishDataset.build(), ...englishRecommendedTransformers
  });
  const censor = new TextCensor();

  useEffect(() => {
    if (!offerId) return;
  
    const fetchOfferDetails = async () => {
      try {
        const offer = await pb.collection('offers').getOne(offerId);
        // Set receiver ID based on role
        if (role === 'buyer') {
          setReceiverId(offer.receiver);
        } else {
          setReceiverId(offer.sender);
        }
        
        // Fetch partner name
        const partnerId = role === 'buyer' ? offer.receiver : offer.sender;
        try {
          const partner = await pb.collection('users').getOne(partnerId);
          setPartnerName(partner.name);
        } catch (error) {
          console.error('Error fetching partner details:', error);
        }
      } catch (error) {
        console.error('Error fetching offer details:', error);
      }
    };
  
    fetchOfferDetails();
  }, [offerId, role]);
    
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
    
    const censoredMessage = censor.applyTo(newMessage, matcher.getAllMatches(newMessage));

    try {
      await pb.collection('messages').create({
        offer: offerId,
        sender: pb.authStore.model?.id,
        content: censoredMessage,
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

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="flex flex-col h-[calc(90vh-2rem)] bg-background">
      <header className="bg-primary/10 dark:bg-gray-800 px-6 py-4 shadow-sm flex items-center gap-3 border-b">
        <Button variant="ghost" size="icon" onClick={handleBack} className="mr-1">
          <X className="h-4 w-4" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${partnerName || (role === 'buyer' ? 'S' : 'B')}`} />
          <AvatarFallback>{partnerName?.[0] || (role === 'buyer' ? 'S' : 'B')}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-medium">
            {partnerName || `Chat with ${role === 'buyer' ? 'Seller' : 'Buyer'}`}
          </h2>
          <p className="text-xs text-muted-foreground">
            {messages.length > 0 ? `${messages.length} messages` : 'Start chatting'}
          </p>
        </div>
      </header>
      
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        onScroll={handleScroll}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <div className="bg-primary/10 dark:bg-gray-800 p-4 rounded-full mb-4">
              <SendIcon className="h-6 w-6" />
            </div>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm max-w-xs">
              Start the conversation with {role === 'buyer' ? 'the seller' : 'the buyer'} about this ticket
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {messages.map((message, index) => {
                const isCurrentUser = message.sender === pb.authStore.model?.id;
                const showAvatar = index === 0 || 
                  messages[index - 1]?.sender !== message.sender;
                const isLastInGroup = index === messages.length - 1 || 
                  messages[index + 1]?.sender !== message.sender;
                
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-2",
                      isCurrentUser ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isCurrentUser && showAvatar ? (
                      <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.expand?.sender?.name || 'S'}`} />
                        <AvatarFallback>{message.expand?.sender?.name?.[0] || 'S'}</AvatarFallback>
                      </Avatar>
                    ) : !isCurrentUser ? (
                      <div className="w-8 flex-shrink-0" />
                    ) : null}
                    
                    <div className={cn(
                      "max-w-[75%] px-4 py-2 rounded-2xl",
                      isCurrentUser 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-muted rounded-tl-none",
                      !isLastInGroup && "mb-1"
                    )}>
                      <p className="break-words">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70 text-right">
                        {format(new Date(message.created), 'HH:mm')}
                      </p>
                    </div>
                    
                    {isCurrentUser && showAvatar ? (
                      <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${pb.authStore.model?.name || 'Y'}`} />
                        <AvatarFallback>{pb.authStore.model?.name?.[0] || 'Y'}</AvatarFallback>
                      </Avatar>
                    ) : isCurrentUser ? (
                      <div className="w-8 flex-shrink-0" />
                    ) : null}
                  </div>
                );
              })}
            </div>
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {showScrollButton && (
        <Button
          className="fixed bottom-32 right-8 rounded-full shadow-lg"
          size="icon"
          variant="secondary"
          onClick={scrollToBottom}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
      
      <div className="bg-background dark:bg-gray-800 px-4 py-4 border-t">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
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
            className="flex-grow max-h-48 min-h-[50px] resize-none rounded-full px-6 py-3 text-base"
            rows={2}
            />
          <Button 
            onClick={sendMessage} 
            size="icon" 
            className="h-10 w-10 rounded-full flex-shrink-0"
            disabled={!newMessage.trim()}
          >
            <SendIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 