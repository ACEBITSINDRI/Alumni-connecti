import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/notifications';

export interface Actor {
  _id: string;
  name: string;
  email?: string;
  profilePicture?: string;
}

export interface Notification {
  _id: string;
  type: 'connection' | 'message' | 'like' | 'comment' | 'event' | 'opportunity' | 'mention' | 'achievement';
  title: string;
  message: string;
  actor?: Actor;
  actionUrl?: string;
  isRead: boolean;
  recipient: string;
  createdAt: string;
  updatedAt: string;
}

// Get all notifications for current user
export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Get unread notification count
export const getUnreadCount = async (): Promise<number> => {
  try {
    const response = await axios.get(`${API_URL}/unread-count`);
    return response.data.data || 0;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};

// Mark notification as read
export const markAsRead = async (notificationId: string): Promise<Notification> => {
  try {
    const response = await axios.patch(`${API_URL}/${notificationId}/mark-as-read`);
    return response.data.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllAsRead = async (): Promise<void> => {
  try {
    await axios.patch(`${API_URL}/mark-all-as-read`);
  } catch (error) {
    console.error('Error marking all as read:', error);
    throw error;
  }
};

// Delete a notification
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${notificationId}`);
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Delete all notifications
export const deleteAllNotifications = async (): Promise<void> => {
  try {
    await axios.delete(`${API_URL}`);
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    throw error;
  }
};

// Format timestamp for display
export const formatNotificationTime = (timestamp: string | Date): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};
