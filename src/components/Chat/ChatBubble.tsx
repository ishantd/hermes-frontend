import React, { useState, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';

enum MessageStatus {
  Pending,
  Sending,
  Sent,
  Failed,
}

interface ChatBubbleMessageProps {
  messageString: string;
  messageStatus: MessageStatus;
  timestamp: number;
}

interface Message {
  sender_type: 'USER' | 'SYSTEM';
  message: string;
  timestamp: number;
  status: MessageStatus;
}

const MessageStatusIndicator: React.FC<{
  status: MessageStatus;
  onClick?: () => void;
}> = ({ status, onClick }) => {
  switch (status) {
    case MessageStatus.Sending:
      return <span>Sending...</span>;
    case MessageStatus.Sent:
      return <span>Sent</span>;
    case MessageStatus.Failed:
      return (
        <span onClick={() => onClick && onClick()}>
          Failed. Click To Resend.
        </span>
      );
  }
};

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

interface UserChatBubbleProps extends ChatBubbleMessageProps {
  onSystemMessage: (message: Message) => void;
}

const UserChatBubble: React.FC<UserChatBubbleProps> = ({
  messageString,
  messageStatus,
  timestamp,
  onSystemMessage,
}) => {
  const [currentMessageStatus, setCurrentMessageStatus] =
    useState<MessageStatus>(messageStatus);
  const { sendMessageRequest: sendChatMessageRequest } = useChat();

  useEffect(() => {
    if (currentMessageStatus === MessageStatus.Pending) {
      sendMessage();
    }
  }, [currentMessageStatus]);

  const sendMessage = async () => {
    setCurrentMessageStatus(MessageStatus.Sending);
    try {
      const response = await sendChatMessageRequest(messageString);
      response && onSystemMessage(response);
      setCurrentMessageStatus(MessageStatus.Sent);
    } catch (error) {
      setCurrentMessageStatus(MessageStatus.Failed);
    }
  };

  const handleMessageReasend = () => {
    if (currentMessageStatus !== MessageStatus.Failed) return;
    setCurrentMessageStatus(MessageStatus.Pending);
  };

  return (
    <React.Fragment>
      <div className="bg-blue-500 p-4 rounded-lg">
        <p className="text-white">{messageString}</p>
        <span className="text-xs text-gray-300">{formatTimestamp(timestamp)}</span>
      </div>
      <MessageStatusIndicator
        status={currentMessageStatus}
        onClick={handleMessageReasend}
      />
    </React.Fragment>
  );
};

const SystemChatBubble: React.FC<ChatBubbleMessageProps> = ({
  messageString,
  timestamp,
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <p className="text-white">{messageString}</p>
      <span className="text-xs text-gray-400">{formatTimestamp(timestamp)}</span>
    </div>
  );
};

interface ChatBubbleProps extends Message {
  onSystemMessage: (message: Message) => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  sender_type,
  message,
  timestamp,
  status = MessageStatus.Sent,
  onSystemMessage = () => {},
}) => {
  return sender_type === 'USER' ? (
    <UserChatBubble
      messageString={message}
      messageStatus={status}
      timestamp={timestamp}
      onSystemMessage={onSystemMessage}
    />
  ) : (
    <SystemChatBubble
      messageString={message}
      timestamp={timestamp}
      messageStatus={MessageStatus.Sent}
    />
  );
};

export default ChatBubble;
export type { Message };
export { MessageStatus };