/**
 * Share
 * @param  {object} ns NameSpace
 */
/*global nsObject:false */
(function (ns) {
  "use strict";

  ns.Share = {
    facebook: function (options) {
      var title = encodeURIComponent(options.title),
        summary = encodeURIComponent(options.summary),
        image = encodeURIComponent(options.image),
        url = encodeURIComponent(options.url),
        shareUrl =
          "http://facebook.com/sharer.php?s=100&p[url]=" +
          url +
          "&p[title]=" +
          title +
          "&p[summary]=" +
          summary +
          "&p[images][0]=" +
          image;

      window.open(shareUrl, "", "width=600,height=400");
    },

    twitter: function (options) {
      var tweet = encodeURIComponent(options.tweet),
        url = encodeURIComponent(options.url),
        shareUrl = "https://twitter.com/share?url=" + url + "&text=" + tweet;

      window.open(shareUrl, "", "width=600,height=400");
    },
  };
})(nsObject);
