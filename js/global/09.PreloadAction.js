/**
 * PreloadAction
 * @param  {object} ns NameSpace
 */
/*global nsObject:false */
(function (ns) {
  "use strict";

  /**
   * PreloadAction Constructor.
   * @constructor
   */
  ns.PreloadAction = function (preloader, action, events) {
    var assets = action,
      toLoad = [];

    $.each(assets, function () {
      if (!this.loaded) {
        toLoad.push(ns.BaseUrl + this.src);
      }
    });

    if (toLoad.length === 0) {
      if (events.onStart && typeof events.onStart === "function")
        events.onStart(assets);
      if (events.onProgress && typeof events.onProgress === "function")
        events.onProgress(false, assets);
      if (events.onComplete && typeof events.onComplete === "function")
        events.onComplete(assets);
    } else {
      preloader.load({
        media: toLoad,
        onStart: function () {
          if (events.onStart && typeof events.onStart === "function")
            events.onStart(assets);
        },

        onProgress: function (data) {
          var url = data.resource.getName();

          $.each(assets, function () {
            var cachBustedUrl = preloader.getCacheBustedUrl(this.src);
            if (cachBustedUrl === url.replace(ns.BaseUrl, "")) {
              this.loaded = true;
              this.tag = data.resource.img;
              this.ext = preloader.getExt(url);
            }
          });

          if (events.onProgress && typeof events.onProgress === "function")
            events.onProgress(data, assets);
        },

        onComplete: function (data) {
          if (events.onComplete && typeof events.onComplete === "function")
            events.onComplete(assets);
        },
      });
    }
  };
})(nsObject);
