import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../../config/firebase';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || 'BAiQKNgVJyUu7SUnijrDcYzO7TFLDmXm9RWHCOCcYPh9UG962_cPcDunUlw2nk8a6ebUww3kV-NSB0yf9sgbvgc';

/**
 * Request notification permission and get FCM token
 */
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    if (!messaging) {
      console.warn('Firebase Messaging is not supported in this browser');
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      // Get FCM token
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      console.log('FCM Token:', token);
      return token;
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

/**
 * Listen for foreground messages
 */
export const onMessageListener = (callback: (payload: any) => void) => {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    callback(payload);
  });
};

/**
 * Save FCM token to backend
 */
export const saveFCMToken = async (token: string) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    await fetch(`${API_URL}/users/fcm-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await getCurrentUserToken()}`,
      },
      body: JSON.stringify({ fcmToken: token }),
    });
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
};

/**
 * Helper to get current user token
 */
const getCurrentUserToken = async () => {
  const { getFirebaseIdToken } = await import('./auth.service');
  return await getFirebaseIdToken();
};
