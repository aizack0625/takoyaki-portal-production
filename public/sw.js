const CACHE_NAME = 'takopoo-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/takoyaki.png',
  '/takoyaki.jpg',
  '/default-user-icon.png',
  '/takoyaki_a.jpg',
  '/takoyaki_a_2.jpg',
  '/takoyaki_a_3.jpg',
  '/takoyaki_b.jpg',
  '/takoyaki_c_2.jpg',
  '/takoyaki_c_3.jpg',
  '/takoyaki_d.jpg',
  '/takoyaki_d_2.jpg',
  '/takoyaki_d_3.jpg'
];

// インストール時にリソースをキャッシュする
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('キャッシュを開きました');
        return cache.addAll(urlsToCache);
      })
  );
});

// ネットワークリクエストを傍受してキャッシュから提供する
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュが見つかった場合、キャッシュからレスポンスを返す
        if (response) {
          return response;
        }

        // キャッシュが見つからなかった場合、ネットワークリクエストを行う
        return fetch(event.request)
          .then(response => {
            // 有効なレスポンスでない場合はそのまま返す
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // レスポンスをクローンしてキャッシュと返却で使用する
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});

// 古いキャッシュを削除する
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
