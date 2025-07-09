// /public/sw.js

self.addEventListener('push', event => {
  if (!event.data) return;

  let data = {};

  try {
    data = event.data.json();
  } catch (error) {
    console.error('❌ Push event data was not JSON:', error);
  }

  const title = data.title || 'New Notification';
  const options = {
    body: data.message || 'You have a new update!',
    icon: '/icon.png', // optional icon
    badge: '/badge-icon.png', // optional smaller badge icon
    data: {
      url: data.url || '/' // URL to open on click
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
