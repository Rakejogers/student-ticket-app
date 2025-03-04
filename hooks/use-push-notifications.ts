import { useState, useEffect } from 'react';
import pb from '@/app/pocketbase';

export const usePushNotifications = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    // Check if the browser supports service workers and push notifications
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      registerServiceWorker();
      checkSubscription();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      // First check if there's an existing registration
      const existingRegistration = await navigator.serviceWorker.getRegistration();
      
      if (existingRegistration?.active) {
        console.log('Service Worker already active:', existingRegistration);
        return existingRegistration;
      }

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      // Wait for the service worker to be ready
      if (registration.installing) {
        console.log('Service Worker installing');
        
        return new Promise((resolve) => {
          registration.installing?.addEventListener('statechange', (e) => {
            if ((e.target as ServiceWorker).state === 'activated') {
              console.log('Service Worker activated');
              resolve(registration);
            }
          });
        });
      } else if (registration.waiting) {
        console.log('Service Worker waiting');
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      } else if (registration.active) {
        console.log('Service Worker active');
      }

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  };

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      console.log('Service Worker is ready');
      
      const existingSubscription = await registration.pushManager.getSubscription();
      console.log('Existing subscription:', existingSubscription);
      
      setIsSubscribed(!!existingSubscription);
      setSubscription(existingSubscription);
    } catch (error) {
      console.error('Error checking push subscription:', error);
    }
  };

  const subscribeToNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (!registration.active) {
        throw new Error('Service Worker not active');
      }
      console.log('Service Worker ready for subscription');
      
      const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      console.log('VAPID key available:', !!publicVapidKey);
      
      if (!publicVapidKey) {
        throw new Error('VAPID public key not found');
      }

      // Check if iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      // Check if in standalone mode (PWA)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

      console.log('Requesting push notification permission...');
      // For iOS in standalone mode, we show our own UI and then request permission
      // This helps with iOS Safari PWA notification permission issues
      let permission = Notification.permission;
      if (permission !== 'granted') {
        permission = await Notification.requestPermission();
      }
      
      if (permission !== 'granted') {
        // If on iOS PWA, provide specific guidance
        if (isIOS && isStandalone) {
          throw new Error('For iOS PWA: Please enable notifications in your device settings for this app');
        } else {
          throw new Error('Permission not granted for notifications');
        }
      }

      console.log('Creating push subscription...');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });

      console.log('Push subscription created:', subscription);

      // Save the subscription to your backend
      if (pb.authStore.model) {
        console.log('Saving subscription to PocketBase...');
        await pb.collection('users').update(pb.authStore.model.id, {
          pushSubscription: JSON.stringify(subscription)
        });
        console.log('Subscription saved to PocketBase');
      } else {
        throw new Error('User not authenticated');
      }

      setIsSubscribed(true);
      setSubscription(subscription);
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      throw error;
    }
  };

  const unsubscribeFromNotifications = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        console.log('Unsubscribed from push notifications');
        
        // Remove the subscription from your backend
        if (pb.authStore.model) {
          await pb.collection('users').update(pb.authStore.model.id, {
            pushSubscription: null
          });
          console.log('Subscription removed from PocketBase');
        }

        setIsSubscribed(false);
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      throw error;
    }
  };

  return {
    isSubscribed,
    subscription,
    subscribeToNotifications,
    unsubscribeFromNotifications,
  };
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
} 