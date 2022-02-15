if ('serviceWorker' in navigator) {
navigator.serviceWorker.register('./sw.js').then(function(reg) {
    console.log('Successfully registered service worker', reg);
  this.addEventListener('fetch', function (event) {
    // it can be empty if you just want to get rid of that error
});
}).catch(function(err) {
    console.warn('Error whilst registering service worker', err);
});
}
