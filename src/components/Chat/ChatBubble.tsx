import React, { useState, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { Button } from '../ui/button';
import {
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/16/solid';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '../ui/input';

enum MessageStatus {
  Pending,
  Sending,
  Sent,
  Failed,
  Deleting,
}

interface Message {
  sender_type: 'USER' | 'SYSTEM';
  message: string;
  timestamp: number;
  status: MessageStatus;
  id?: number;
}

interface ChatBubbleProps extends Message {
  avatarSeed: string;
  onSystemMessage: (message: Message) => void;
  onDelete: (messageId: number) => void;
}

const MessageStatusIndicator: React.FC<{
  status: MessageStatus;
  onClick?: () => void;
}> = ({ status, onClick }) => {
  switch (status) {
    case MessageStatus.Sending:
      return <span className="text-gray-600 text-xs">Sending...</span>;
    case MessageStatus.Sent:
      return <span className="text-gray-600 text-xs">Sent</span>;
    case MessageStatus.Deleting:
      return (
        <span
          className="text-red-700 text-xs"
          onClick={() => onClick && onClick()}
        >
          Deleting...
        </span>
      );
    case MessageStatus.Failed:
      return (
        <span
          className="text-red-700 text-xs"
          onClick={() => onClick && onClick()}
        >
          Failed. Click To Resend.
        </span>
      );
  }
};

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

interface UserChatBubbleProps extends ChatBubbleProps {
  onSystemMessage: (message: Message) => void;
  onDelete: (messageId: number) => void;
}

const EditMessageDialog: React.FC<{
  messageText: string;
  disabled: boolean;
  onMessageEdit: (messageString: string) => {};
}> = ({ messageText, disabled, onMessageEdit }) => {
  const [newMessage, setNewMessage] = useState(messageText);

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onMessageEdit(newMessage)}
          disabled={disabled}
        >
          <PencilIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Message Text</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </div>
          <DialogClose asChild>
            <Button
              className="px-3 gap-2"
              onClick={() => onMessageEdit(newMessage)}
            >
              Save
              <CheckCircleIcon className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UserChatBubble: React.FC<UserChatBubbleProps> = ({
  message: messageString,
  status: messageStatus,
  id: messageId,
  timestamp,
  avatarSeed,
  onSystemMessage,
  onDelete = () => {},
}) => {
  const avatarURL = `https://api.dicebear.com/9.x/lorelei/svg?seed=${avatarSeed}`;

  const [currentMessageStatus, setCurrentMessageStatus] =
    useState<MessageStatus>(messageStatus);
  const { sendMessageRequest, deleteMessage, editMessage } = useChat();

  const [message, setMessage] = useState<Message>({
    id: messageId,
    sender_type: 'USER',
    message: messageString,
    timestamp,
    status: currentMessageStatus,
  });

  useEffect(() => {
    if (currentMessageStatus === MessageStatus.Pending) sendMessage();
  }, [currentMessageStatus]);

  const sendMessage = async () => {
    setCurrentMessageStatus(MessageStatus.Sending);
    try {
      const response = await sendMessageRequest(messageString);

      response && onSystemMessage(response.bot_message);
      response && setMessage(response.user_message);

      setCurrentMessageStatus(MessageStatus.Sent);
    } catch (error) {
      setCurrentMessageStatus(MessageStatus.Failed);
    }
  };

  const handleMessageResend = () => {
    if (currentMessageStatus !== MessageStatus.Failed) return;
    setCurrentMessageStatus(MessageStatus.Pending);
  };

  const handleEditMessage = async (
    messageString: string,
    messageId: number
  ) => {
    setCurrentMessageStatus(MessageStatus.Sending);

    try {
      await editMessage(messageString, messageId);
      setMessage({ ...message, message: messageString });

      setCurrentMessageStatus(MessageStatus.Sent);
    } catch (error) {
      setCurrentMessageStatus(MessageStatus.Sent);
    }
  };

  const handleMessageDelete = async () => {
    if (!message || !message.id) return;

    try {
      setCurrentMessageStatus(MessageStatus.Deleting);

      await deleteMessage(message.id);
      onDelete(message.id!);
    } catch (error) {
      setCurrentMessageStatus(MessageStatus.Sent);
    }
  };

  return (
    <React.Fragment>
      <div className={`flex items-end space-x-4 justify-end`}>
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-end space-x-2 justify-end">
            <EditMessageDialog
              messageText={message.message}
              onMessageEdit={(messageString) =>
                handleEditMessage(messageString, message.id!)
              }
              disabled={
                !message.id || currentMessageStatus !== MessageStatus.Sent
              }
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleMessageDelete}
              disabled={
                !message.id || currentMessageStatus !== MessageStatus.Sent
              }
            >
              <TrashIcon className="w-4 h-4 text-red-700" />
            </Button>
            <div
              className={`flex items-end space-x-4 justify-end bg-blue-500 p-4 rounded-lg`}
            >
              <p className="text-white">{message?.message || messageString}</p>
              <span
                className="text-xs text-blue-200"
                style={{ transform: 'translateY(4px, 8px)' }}
              >
                {formatTimestamp(message?.timestamp || timestamp)}
              </span>
            </div>
          </div>
          <MessageStatusIndicator
            status={currentMessageStatus}
            onClick={handleMessageResend}
          />
        </div>
        <div className="items-center space-x-2">
          <img
            src={avatarURL}
            alt="User Avatar"
            className="w-10 h-10 rounded-full border-2 border-gray-300"
          />
        </div>
      </div>
    </React.Fragment>
  );
};

interface SystemChatBubbleProps extends ChatBubbleProps {
  onDelete: (messageId: number) => void;
}

const SystemChatBubble: React.FC<SystemChatBubbleProps> = ({
  message: messageString,
  id: messageId,
  timestamp,
  onDelete = () => {},
}) => {
  const avatarURL =
    'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=bot_chat_gpt';

  const [currentMessageStatus, setCurrentMessageStatus] =
    useState<MessageStatus>(MessageStatus.Sent);
  const { deleteMessage } = useChat();

  const handleMessageDelete = async () => {
    if (!messageId) return;

    try {
      setCurrentMessageStatus(MessageStatus.Deleting);

      await deleteMessage(messageId);
      onDelete(messageId);
    } catch (error) {
      setCurrentMessageStatus(MessageStatus.Sent);
    }
  };

  return (
    <div className={`flex items-end space-x-4 justify-start`}>
      <img
        src={avatarURL}
        alt="User Avatar"
        className="w-10 h-10 rounded-full border-2 border-gray-300"
      />
      <div
        className={`flex items-end space-x-4 justify-end bg-gray-800 p-4 rounded-lg`}
      >
        <p className="text-white">{messageString}</p>
        <span
          className="text-xs text-gray-400"
          style={{ transform: 'translate(4px, 8px)' }}
        >
          {formatTimestamp(timestamp)}
        </span>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={handleMessageDelete}
        disabled={!messageId || currentMessageStatus === MessageStatus.Deleting}
      >
        <TrashIcon className="w-4 h-4 text-red-700" />
      </Button>
    </div>
  );
};

const ChatBubble: React.FC<ChatBubbleProps> = ({
  sender_type,
  id,
  message,
  timestamp,
  avatarSeed,
  status = MessageStatus.Sent,
  onSystemMessage = () => {},
  onDelete = () => {},
}) => {
  return sender_type === 'USER' ? (
    <UserChatBubble
      id={id}
      message={message}
      status={status}
      timestamp={timestamp}
      avatarSeed={avatarSeed}
      onSystemMessage={onSystemMessage}
      onDelete={onDelete}
      sender_type={sender_type}
    />
  ) : (
    <SystemChatBubble
      id={id}
      message={message}
      timestamp={timestamp}
      avatarSeed={avatarSeed}
      status={MessageStatus.Sent}
      sender_type={sender_type}
      onSystemMessage={() => {}}
      onDelete={onDelete}
    />
  );
};

export default ChatBubble;
export type { Message };
export { MessageStatus };
