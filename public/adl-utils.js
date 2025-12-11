(function () {
  const safeGet = (obj, path) => {
    if (!path) return undefined;
    return path.split('.').reduce((acc, key) => {
      if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
        return acc[key];
      }
      return undefined;
    }, obj);
  };

  const getLastPush = () => {
    const dl = window.adobeDataLayer || [];
    return dl.length ? dl[dl.length - 1] : null;
  };

  window.adl = {
    get: (path) => safeGet(getLastPush(), path),
    getLastPush
  };
})();

