'use client';

import ChatInterface from '@/components/chat-interface';
import isAuth from '@/components/isAuth';

type Params = {
  offerId: string;
};

interface SentOffersChatProps {
  params: Params;
}

const SentOffersChatPage: React.FC<SentOffersChatProps> = ({ params }) => {
  return <ChatInterface offerId={params.offerId} role="seller" />;
};

export default isAuth(SentOffersChatPage);

