const CACHE_NAME = 'toko-app-cache-v1'; // Jika Anda sering mengubah aset, Anda bisa mengubah 'v1' menjadi 'v2', 'v3', dst. untuk memastikan cache baru dimuat.
const urlsToCache = [
    '/APLIKASI-TOKO/',
    '/APLIKASI-TOKO/index.html',
    '/APLIKASI-TOKO/style.css',
    '/APLIKASI-TOKO/script.js',
    '/APLIKASI-TOKO/manifest.json',
    '/APLIKASI-TOKO/icons/icon-192x192.png',
    '/APLIKASI-TOKO/icons/icon-512x512.png',
    // --- Gambar Menu Baru ---
    '/APLIKASI-TOKO/images/minas-ayam.png',
    '/APLIKASI-TOKO/images/minas-sate.png',
    '/APLIKASI-TOKO/images/minas-telor.png',
    '/APLIKASI-TOKO/images/minuman.png'
    // Tambahkan semua aset statis lain yang ingin di-cache
];

// ... sisa kode Service Worker ...
navigator.serviceWorker.register('/APLIKASI-TOKO/sw.js')

// Event: Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Event: Fetch (mengambil sumber daya)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Event: Activate Service Worker (membersihkan cache lama)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});