//imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v4';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'js/app.js',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/sw-utils.js'
    
]

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'css/animate.css',
    'js/libs/jquery.js'
];


self.addEventListener('install', e => {

    const saveStaticCache = caches.open(STATIC_CACHE)
        .then(cache => cache.addAll(APP_SHELL));

    const saveInmutableCache = caches.open(INMUTABLE_CACHE)
        .then(cache => cache.addAll(APP_SHELL_INMUTABLE))

    const saveAll = Promise.all([saveStaticCache, saveInmutableCache]);

    e.waitUntil(saveAll)
});

self.addEventListener('activate', e => {
    const response = caches.keys()
        .then(keys => {
            keys.forEach(key => {
                if(key !== STATIC_CACHE && key.includes('static')) return caches.delete(key);
                if(key !== DYNAMIC_CACHE && key.includes('dynamic')) return caches.delete(key)
            })
        });
    e.waitUntil(response);
});

self.addEventListener('fetch', e => {
    const response = caches.match(e.request)
        .then(res => {
            if (res) return res;

            return fetch(e.request)
                .then(fetchRes =>  updateCache(DYNAMIC_CACHE, e.request, fetchRes));
        });

    e.respondWith(response);
});