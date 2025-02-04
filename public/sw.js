// Listen for the install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  // Skip waiting to become active immediately
  self.skipWaiting();
});

// Listen for the activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  // Claim all clients to ensure the service worker is controlling the page
  event.waitUntil(clients.claim());
});

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('push', function(event) {
  try {
    const data = event.data.text();
    let payload;
    try {
      payload = JSON.parse(data);
    } catch (e) {
      payload = {
        title: 'New Notification',
        body: data
      };
    }

    const options = {
      body: payload.body || 'No message content',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '1'
      },
      actions: [
        {
          action: 'explore',
          title: 'View Details',
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(payload.title || 'Student Ticket App', options)
    );
  } catch (error) {
    console.error('Error showing notification:', error);
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('https://scholarseats.com/account/my-tickets')
    );
  }
});

// Only cache responses for navigation requests
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/');
        })
    );
  }
}); 