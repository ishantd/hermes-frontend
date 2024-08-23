import ChatBubble, { Message } from '@/components/Chat/ChatBubble';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import React, { useEffect } from 'react';

const MessageBar: React.FC<{
  onMessageSend: (messageText: string) => void;
}> = ({ onMessageSend }) => {
  const [messageInput, setMessageInput] = React.useState('');

  const handleMessageSend = () => {
    messageInput && messageInput.length && onMessageSend(messageInput);
    setMessageInput('');
  };

  return (
    <div className="flex">
      <input
        type="text"
        onChange={(e) => setMessageInput(e.target.value)}
        value={messageInput}
      />
      <button onClick={handleMessageSend}>Send</button>
    </div>
  );
};

const ChatPage: React.FC = () => {
  const { whoami } = useAuth();
  const { getChatHistory, getUserMessage } = useChat();
  const [messages, setMessages] = React.useState<Message[]>([]);

  useEffect(() => {
    whoami();
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    const messages = await getChatHistory();
    messages && setMessages(messages);
  };

  const sendUserMessage = (messageText: string) => {
    const userMessage = getUserMessage(messageText);
    setMessages([...messages, userMessage]);
  };

  const onSystemMessage = (message: Message) => {
    setMessages([...messages, message]);
  };

  return (
    <React.Fragment>
      {messages.map((message, index) => (
        <ChatBubble
          key={index}
          {...message}
          onSystemMessage={onSystemMessage}
        />
      ))}
      <MessageBar onMessageSend={sendUserMessage} />
    </React.Fragment>
  );
};

export default ChatPage;
