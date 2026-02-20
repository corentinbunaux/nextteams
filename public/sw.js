self.addEventListener('push', (event) => {
  const data = event.data.json()
  const title = data.title || 'Nouvelle notification'
  const options = {
    body: data.body || '',
    icon: data.icon || '/icon-192.png',
    data: { url: data.url || '/' },
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data.url
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientsList => {
      for (const client of clientsList) {
        if (client.url === url && 'focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})