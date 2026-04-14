import api from '../api/axios';

/**
 * Register the browser for push notifications via the Notification API.
 * Stores the subscription token on the backend.
 */
export const registerPushNotifications = async (userId: string, userType: 'student' | 'teacher') => {
  // Check browser support
  if (!('Notification' in window)) {
    return { success: false, reason: 'not-supported' };
  }

  // Request permission
  let permission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }

  if (permission !== 'granted') {
    return { success: false, reason: 'denied' };
  }

  // Register with backend — use a stable browser fingerprint as the token
  // Since we don't have a service worker / FCM setup, we use the Notification API
  // for showing local notifications and store a unique browser token
  const token = `web-${userId}-${navigator.userAgent.slice(0, 50).replace(/\s/g, '_')}-${Date.now()}`;

  try {
    await api.post('/push-tokens', {
      userId,
      userType,
      token,
      platform: 'web',
    });
    localStorage.setItem('push_token_registered', 'true');
    return { success: true };
  } catch (error: any) {
    return { success: false, reason: 'api-error' };
  }
};

/**
 * Show a local browser notification.
 */
export const showBrowserNotification = (title: string, body: string, onClick?: () => void) => {
  if (Notification.permission !== 'granted') return;

  const notif = new Notification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
  });

  if (onClick) {
    notif.onclick = () => {
      window.focus();
      onClick();
      notif.close();
    };
  }
};
