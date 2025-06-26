const CACHE_NAME = 'toko-app-cache-v4'; // Ganti ke v4 (atau v5, dst.) untuk memaksa pembaruan
const urlsToCache = [
    '/APLIKASI-TOKO/',
    '/APLIKASI-TOKO/index.html',
    '/APLIKASI-TOKO/style.css',
    '/APLIKASI-TOKO/script.js',
    '/APLIKASI-TOKO/manifest.json',
    '/APLIKASI-TOKO/icons/icon-192x192.png',
    '/APLIKASI-TOKO/icons/icon-512x512.png',
    // --- Gambar Menu Baru (dengan ekstensi .jpg) ---
    '/APLIKASI-TOKO/images/minas-ayam.jpg', // Diubah ke .jpg
    '/APLIKASI-TOKO/images/minas-sate.jpg', // Diubah ke .jpg
    '/APLIKASI-TOKO/images/minas-telor.jpg', // Diubah ke .jpg
    '/APLIKASI-TOKO/images/minuman.jpg' // Diubah ke .jpg
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