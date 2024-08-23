import { useChat } from '@/hooks/useChat';
import React, { useState, useEffect } from 'react';

enum MessageStatus {
  Pending,
  Sending,
  Sent,
  Failed,
}

interface ChatBubbleMessageProps {
  messageString: string;
  messageStatus: MessageStatus;
}

interface Message {
  sender_type: 'USER' | 'SYSTEM';
  message: string;
  timestamp: Date;
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

interface UserChatBubbleProps extends ChatBubbleMessageProps {
  onSystemMessage: (message: Message) => void;
}

const UserChatBubble: React.FC<UserChatBubbleProps> = ({
  messageString,
  messageStatus,
  onSystemMessage,
}) => {
  const [currentMessageStatus, setCurrentMessageStatus] =
    useState<MessageStatus>(messageStatus);
  const { sendMessageRequest: sendChatMessageRequest } = useChat();

  useEffect(() => {
    currentMessageStatus === MessageStatus.Pending && sendMessage();
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
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <p className="text-white">{messageString}</p>
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
      onSystemMessage={onSystemMessage}
    />
  ) : (
    <SystemChatBubble
      messageString={message}
      messageStatus={MessageStatus.Sent}
    />
  );
};

export default ChatBubble;
export type { Message };
export { MessageStatus };
