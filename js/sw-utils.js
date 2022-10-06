//Esta funcion se encarga de guardar el cache dinamico
function updateCache(dynamic, req, res) {
    if (res) {
        return caches.open(dynamic)
            .then(cache => {
                cache.put(req, res.clone());
                return res.clone();
            });
    }
    else return res;

}