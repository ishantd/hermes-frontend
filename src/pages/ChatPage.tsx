import { useAuth } from '@/hooks/useAuth';
import React, { useEffect } from 'react';

const ChatPage: React.FC = () => {
  const { user, whoami } = useAuth();

  useEffect(() => {
    whoami();
  }, []);

  return (
    <div>
      <h1>Chat</h1>
    </div>
  );
};

export default ChatPage;
