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
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
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
    self.registration.showNotification('Student Ticket App', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/account/my-tickets')
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