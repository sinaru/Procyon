if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/lib/serviceworker/worker.js').then(() => {}).catch(() => {});
  });
}
