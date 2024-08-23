import ChatBubble, { Message } from '@/components/Chat/ChatBubble';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import React, { useEffect } from 'react';

const MessageBar: React.FC<{
  onMessageSend: (messageText: string) => void;
}> = ({ onMessageSend }) => {
  const [messageInput, setMessageInput] = React.useState('');

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
    <div className="flex items-center p-4 bg-gray-100 rounded-lg shadow-inner">
      <input
        type="text"
        onChange={(e) => setMessageInput(e.target.value)}
        value={messageInput}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <button
        onClick={handleMessageSend}
        className="ml-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        Send
      </button>
    </div>
  );
};

const ChatPage: React.FC = () => {
  const { whoami, user } = useAuth();
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 bg-blue-600 text-white">
          <h1 className="text-2xl font-bold">Hermes Chat</h1>
          <p className="text-sm">This is a chat bot</p>
        </div>
        <div className="p-4 space-y-4 h-[calc(100vh-200px)] overflow-y-auto">
          {messages.map((message, index) => {
            const avatarUrl =
              message.sender_type === 'USER'
                ? `https://api.dicebear.com/9.x/lorelei/svg?seed=${user?.email}`
                : `https://api.dicebear.com/9.x/lorelei/svg?seed=bot`;

            return (
              <div
                key={index}
                className={`flex items-end space-x-4 ${message.sender_type === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender_type === 'USER' ? null : (
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-2 border-gray-300"
                  />
                )}
                <ChatBubble
                  key={index}
                  {...message}
                  onSystemMessage={onSystemMessage}
                />
                {message.sender_type === 'USER' && (
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-2 border-gray-300"
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="p-4 border-t">
          <MessageBar onMessageSend={sendUserMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;