/**
 * Controller
 * @param  {object} ns NameSpace
 */
/*global nsObject:false,mustache:false, window:false */
(function (ns, mustache) {
  "use strict";

  ns.Controller = {
    getData: function (action) {
      return window.jsonData[action];
    },

    getAssets: function (action, events) {
      ns.PreloadAction(ns.AssetPreloaderInstance, action, events);
    },

    getTmpl: function (tmpl, data) {
      return mustache.render(tmpl, data);
    },

    renderTmpl: function (target, tmpl, callback) {
      target.html(tmpl);

      if (callback && typeof callback === "function") callback();
    },

    scanTmpl: function (target) {
      ns.Scanner.scan(target[0]);
    },

    cleanData: function (action) {
      if (action !== "intro") {
        window.jsonData[action] = [];
        window.jsonData[action] = null;
        delete window.jsonData[action];
      } else {
        window.jsonData[action].assets = [];
        window.jsonData[action].assets = null;
        delete window.jsonData[action].assets;

        window.jsonData[action].hotspots = [];
        window.jsonData[action].hotspots = null;
        delete window.jsonData[action].hotspots;

        window.jsonData[action].snapPoints = [];
        window.jsonData[action].snapPoints = null;
        delete window.jsonData[action].snapPoints;
      }
    },

    destroy: function (target, callback) {
      ns.Scanner.destroyWidgetsInContext(target[0]);

      if (callback && typeof callback === "function") callback();
    },
  };
})(nsObject, Mustache);
