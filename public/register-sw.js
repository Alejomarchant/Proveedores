if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => console.log('✅ Service worker registrado:', reg.scope))
    .catch(err => console.error('❌ Error al registrar el service worker:', err));
}