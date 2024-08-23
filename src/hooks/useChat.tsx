import { Message, MessageStatus } from '@/components/Chat/ChatBubble';
import { Request } from '@/networking';

export const useChat = () => {
  const getChatHistory = async (): Promise<Message[] | undefined> => {
    try {
      const response = await Request('GET', '/chat/history', null);
      const messages = response.data.messages.map((message: any) => ({
        sender_type: message.sender_type,
        message: message.message,
        timestamp: new Date(message.timestamp),
        status: MessageStatus.Sent,
      }));
      return messages;
    } catch (error) {
      console.error('Get chat history failed:', error);
    }
  };

  const sendMessageRequest = async (
    message: string
  ): Promise<Message | undefined> => {
    try {
      const response = await Request('POST', '/chat/send', {
        message,
      });

      const system_message = response.data.bot_message;

      return {
        sender_type: system_message.sender_type,
        message: system_message.message,
        timestamp: system_message.timestamp,
        status: MessageStatus.Sent,
      };
    } catch (error) {
      console.error('Send message failed:', error);
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

  return { getChatHistory, sendMessageRequest, getUserMessage };
};
