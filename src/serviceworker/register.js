if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/src/serviceworker/worker.js').then(() => {}).catch(() => {});
  });
}
