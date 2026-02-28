import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/messages';

export interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
    userType: 'alumni' | 'student';
  }>;
  lastMessage?: {
    _id: string;
    content: string;
    sender: string;
    createdAt: string;
  };
  unreadCount: number;
  isArchived: boolean;
  isMuted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  receiver: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  content: string;
  attachments?: Array<{
    url: string;
    type: string;
  }>;
  isRead: boolean;
  readAt?: string;
  isDeleted: boolean;
  deletedFor?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SendMessagePayload {
  receiverId: string;
  content: string;
  attachments?: Array<{
    url: string;
    type: string;
  }>;
}

// Get all conversations for current user
export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await axios.get(`${API_URL}/conversations`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

// Get all messages in a specific conversation
export const getMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    const response = await axios.get(`${API_URL}/conversations/${conversationId}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// Send a message
export const sendMessage = async (payload: SendMessagePayload): Promise<Message> => {
  try {
    const response = await axios.post(`${API_URL}/send`, payload);
    return response.data.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Mark a message as read
export const markMessageAsRead = async (messageId: string): Promise<Message> => {
  try {
    const response = await axios.patch(`${API_URL}/${messageId}/read`);
    return response.data.data;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

// Get unread message count
export const getUnreadMessageCount = async (): Promise<number> => {
  try {
    const response = await axios.get(`${API_URL}/unread-count`);
    return response.data.data || 0;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};

// Archive a conversation
export const archiveConversation = async (conversationId: string): Promise<Conversation> => {
  try {
    const response = await axios.patch(`${API_URL}/conversations/${conversationId}/archive`);
    return response.data.data;
  } catch (error) {
    console.error('Error archiving conversation:', error);
    throw error;
  }
};

// Get other participant from conversation
export const getOtherParticipant = (conversation: Conversation, currentUserId: string) => {
  return conversation.participants.find(p => p._id !== currentUserId);
};
