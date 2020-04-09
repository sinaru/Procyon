if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('lib/serviceworker/worker.js').then(registration => {
      console.log('Service Worker is registered', registration);
    }).catch(err => {
      console.error('Registration failed:', err);
    });
  });
}
