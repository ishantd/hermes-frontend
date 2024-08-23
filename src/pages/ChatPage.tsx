import ChatBubble, { Message } from '@/components/Chat/ChatBubble';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { PaperAirplaneIcon } from '@heroicons/react/16/solid';
import React, { useEffect, useRef, useState } from 'react';
import { createContext } from 'react';

const ChatContext = createContext("0");

const MessageBar: React.FC<{
  onMessageSend: (messageText: string) => void;
}> = ({ onMessageSend }) => {
  const [messageInput, setMessageInput] = useState('');

  const handleMessageSend = () => {
    if (messageInput && messageInput.length) {
      onMessageSend(messageInput);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleMessageSend();
    }
  };

  return (
    <div className="flex items-center">
      <Input
        type="text"
        onChange={(e) => setMessageInput(e.target.value)}
        value={messageInput}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
      />
      <Button
        onClick={handleMessageSend}
        className="ml-4 p-2 gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        Send
        <PaperAirplaneIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

const ChatPage: React.FC = () => {
  const { whoami, user, logout } = useAuth();
  const { getChatHistory, getUserMessage, getContexts } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [contexts, setContexts] = useState<any[]>([]);
  const [selectedContext, setSelectedContext] = useState("0");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    whoami();
    fetchChatHistory();
    fetchContexts();
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChatHistory = async () => {
    const messages = await getChatHistory();
    messages && setMessages(messages);
  };

  const fetchContexts = async () => {
    const contextData = await getContexts();
    if (contextData) {
      setContexts([{ id: "0", title: 'Default' }, ...contextData]);
    }
  };

  const sendUserMessage = (messageText: string) => {
    const userMessage = getUserMessage(messageText);
    setMessages([...messages, userMessage]);
  };

  const onSystemMessage = (message: Message) => {
    setMessages([...messages, message]);
  };

  const handleMessageDelete = (messageId: number) => {
    const updatedMessages = messages.filter(
      (message) => message.id !== messageId
    );
    setMessages(updatedMessages);
  };

  return (
    <ChatContext.Provider value={selectedContext}>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">Hermes Chat</h3>
            <p className="text-sm">
              Wraps on top of GPT, sends back generated text.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select
              value={selectedContext}
              onValueChange={(value) => setSelectedContext(value)}
            >
              <SelectTrigger className="bg-white text-black rounded-lg">
                <SelectValue placeholder="Select Context" />
              </SelectTrigger>
              <SelectContent>
                {contexts.map((context) => (
                  <SelectItem key={context.id} value={String(context.id)}>
                    {context.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={logout}
              className="bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              Logout
            </Button>
          </div>
        </div>
        <div
          ref={chatContainerRef}
          className="p-4 space-y-4 h-[calc(100vh-256px)] overflow-y-auto"
        >
          {messages.map((message, index) => (
            <ChatBubble
              key={index}
              {...message}
              avatarSeed={user?.email || 'user'}
              onSystemMessage={onSystemMessage}
              onDelete={handleMessageDelete}
            />
          ))}
        </div>
        <div className="p-4 border-t">
          <MessageBar onMessageSend={sendUserMessage} />
        </div>
      </div>
    </div>
    </ChatContext.Provider>
  );

};

export default ChatPage;
export { ChatContext };