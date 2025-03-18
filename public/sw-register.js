// サービスワーカーが利用可能な場合にのみ登録する
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // 登録成功
      console.log('ServiceWorker登録成功: ', registration.scope);
    }, function(err) {
      // 登録失敗
      console.log('ServiceWorker登録失敗: ', err);
    });
  });
}
