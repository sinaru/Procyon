self.addEventListener('install', _event => {
  console.log('Service worker installing...');
  // Add a call to skipWaiting here
});

self.addEventListener('activate', _event => {
  console.log('Service worker activating...');
});

self.addEventListener('fetch', event => {
  console.log('Fetching:', event.request.url);
});
