(function() {
  let resourceCache = {},
    loading = [],
    readyCallbacks = [];

  let urls = [];

  function load(urlOrArr) {
    if (urlOrArr instanceof Array) {
      urlOrArr.forEach(function(url) {
        _load(url);
        urls.push(url);
      });
    } else {
      _load(urlOrArr);
    }
  }

  function _load(url) {
    if (resourceCache[url]) {
      return resourceCache[url];
    } else {
      let img = new Image();
      img.onload = function() {
        resourceCache[url] = img;

        if (isReady()) {
          readyCallbacks.forEach(function(func) {
            func();
          });
        }
      };
      resourceCache[url] = false;
      img.src = url;
    }
  }

  function get(url) {
    if (url instanceof String) {
      return resourceCache[url];
    }

    return resourceCache[urls[url]];
  }
  
  function getLen() {
    return Object.keys(resourceCache).length;
  }

  function isReady() {
    let ready = true;
    for (var k in resourceCache) {
      if (resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
        ready = false;
      }
    }
    return ready;
  }

  function onReady(func) {
    readyCallbacks.push(func);
  }

  window.resources = {
    load: load,
    get: get,
    getLen: getLen,
    onReady: onReady,
    isReady: isReady,
    time: Date.now(),
  };
})();
