export const registerServiceWorker = () => {
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) return

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Keep boot resilient when a browser or host blocks service workers.
    })
  })
}

export const queueOfflineMutation = async (request) => {
  const pending = JSON.parse(localStorage.getItem('offline-mutations') || '[]')
  pending.push({ ...request, queuedAt: new Date().toISOString() })
  localStorage.setItem('offline-mutations', JSON.stringify(pending))

  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready
    await registration.sync.register('sync-board-mutations')
  }
}
