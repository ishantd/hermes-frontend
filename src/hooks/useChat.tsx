import { Message, MessageStatus } from '@/components/Chat/ChatBubble';
import { Request } from '@/networking';
import { ChatContext } from '@/pages/ChatPage';
import { useContext } from 'react';

export const useChat = () => {
  const context_id = useContext(ChatContext);
  const getChatHistory = async (): Promise<Message[] | undefined> => {
    try {
      const response = await Request('GET', '/chat/history', null);
      const messages = response.data.messages.map((message: any) => ({
        sender_type: message.sender_type,
        message: message.message,
        timestamp: message.timestamp,
        id: message.id,
        status: MessageStatus.Sent,
      }));
      return messages;
    } catch (error) {
      throw error;
    }
  };

  const sendMessageRequest = async (
    message: string
  ): Promise<{ user_message: Message; bot_message: Message } | undefined> => {
    try {
      const response = await Request('POST', '/chat/send', {
        message,
        context_id: Number(context_id),
      });

      const system_message = response.data.bot_message;
      const user_message = response.data.user_message;

      return {
        user_message: {
          sender_type: user_message.sender_type,
          message: user_message.message,
          timestamp: user_message.timestamp,
          id: user_message.id,
          status: MessageStatus.Sent,
        },
        bot_message: {
          sender_type: system_message.sender_type,
          message: system_message.message,
          timestamp: system_message.timestamp,
          id: system_message.id,
          status: MessageStatus.Sent,
        },
      };
    } catch (error) {
      throw error;
    }
  };

  const getUserMessage = (message: string): Message => {
    return {
      sender_type: 'USER',
      message,
      timestamp: new Date().getTime(),
      status: MessageStatus.Pending,
    };
  };

  const editMessage = async (messageString: string, messageId: number) => {
    try {
      await Request('PUT', `/chat/update`, {
        message: messageString,
        message_id: messageId,
      });
    } catch (error) {
      throw error;
    }
  };

  const deleteMessage = async (messageId: number) => {
    try {
      await Request('DELETE', `/chat/delete`, { message_id: messageId });
    } catch (error) {
      throw error;
    }
  };

  const getContexts = async () => {
    try {
      const response = await Request('GET', '/chat/context', null);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    getChatHistory,
    sendMessageRequest,
    getUserMessage,
    deleteMessage,
    editMessage,
    getContexts,
  };
};
