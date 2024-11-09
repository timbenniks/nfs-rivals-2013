/**
 * VideoPlayer
 * @param  {object} $	Library
 * @param  {object} ns	NameSpace
 */
/*global nsLibrary:false, nsObject:false, mediaElementPlayer:false,popcorn:false*/
(function ($, ns, mediaElementPlayer, popcorn) {
  "use strict";

  (function (pop) {
    pop.plugin("subtitle", {
      start: function (event, options) {
        $("#subtitle-container").text(options.text);
      },

      end: function (event, options) {
        $("#subtitle-container").text("");
      },
    });
  })(popcorn);

  (function (pop) {
    pop.plugin("caption", {
      _setup: function () {
        $("#setup-copy-overlay").show();
      },

      _teardown: function () {
        $("#setup-copy-overlay").hide();
      },

      start: function (event, options) {
        $("#setup-copy-overlay").find("h1").text(options.text).fadeIn(400);
      },

      end: function (event, options) {
        $("#setup-copy-overlay").find("h1").text(options.text).fadeOut(400);
      },
    });
  })(popcorn);

  /**
   * VideoPlayer Constructor.
   * @constructor
   */
  ns.VideoPlayer = function (el, options) {
    var player,
      controls = options.controls || false,
      me,
      poster = options && options.poster ? options.poster : false,
      subtitles = $(el).data("subtitles"),
      captions = $(el).data("captions"),
      pop = false,
      init = function () {
        player = new mediaElementPlayer(el, {
          startVolume: 0.8,
          enableAutosize: true,
          features: [controls ? "progress" : ""],
          alwaysShowControls: true,
          iPadUseNativeControls: true,
          iPhoneUseNativeControls: true,
          AndroidUseNativeControls: true,
          enableKeyboard: false,
          pauseOtherPlayers: true,
          type: "",
          success: function (mediaElement) {
            me = mediaElement;

            $(el).parents(".mejs-container").find(".mejs-controls").hide();
            $(el)
              .parents(".mejs-container")
              .next(".video-overlay")
              .find("button")
              .off("click", handleIconClick);
            $(el)
              .parents(".mejs-container")
              .next(".video-overlay")
              .find("button")
              .on("click", handleIconClick)
              .on("mouseenter", handleIconEnter);
            $(el).parents(".mejs-container").next(".video-overlay").hide();

            if (!controls) mediaElement.muted = true;

            mediaElement.addEventListener("play", function () {
              if (controls)
                $(el).parents(".mejs-container").find(".mejs-controls").show();
              $(el)
                .parents(".mejs-container")
                .next(".video-overlay")
                .fadeOut(400);
            });

            mediaElement.addEventListener("progress", function (e) {
              //console.log('loading:', (e.target.buffered.end(0) / e.target.duration) * 100 + '%');
            });

            if (controls) {
              mediaElement.addEventListener("pause", function () {
                $(el)
                  .parents(".mejs-container")
                  .next(".video-overlay")
                  .fadeIn(400);
              });

              mediaElement.addEventListener("ended", function () {
                $(el).parents(".mejs-container").next(".video-overlay").hide();
              });
            }

            if (poster) {
              $(el).after(
                '<div id="poster"><img src="' + poster + '" /></div>'
              );
            }

            if (subtitles) {
              $(el).after('<div id="subtitle-container"></div>');

              if (!pop) pop = popcorn(me);
              $.each(subtitles, function () {
                pop.subtitle(this);
              });
            }

            if (captions) {
              if (!pop) pop = popcorn(me);
              $.each(captions, function () {
                pop.caption(this);
              });
            }
          },
        });
      },
      handleIconClick = function () {
        if ($(this).hasClass("play")) {
          el.play();
          ns.EventHandlerInstance.tvcPlayClick();
        }

        if ($(this).hasClass("stop")) {
          ns.EventHandlerInstance.tvcStopClick();
        }

        if ($(this).hasClass("facebook")) ns.Share["facebook"]($(this).data());
        if ($(this).hasClass("twitter")) ns.Share["twitter"]($(this).data());
      },
      handleIconEnter = function () {
        ns.EventHandlerInstance.tvcButtonHover();
      },
      getPlayer = function () {
        return me;
      },
      setSource = function (src) {
        player.setSrc(src);
      },
      play = function () {
        player.play();
      },
      destroy = function () {
        if (mejs.players[$(el).parents(".mejs-container").attr("id")])
          mejs.players[$(el).parents(".mejs-container").attr("id")].remove();
        $(el)
          .parents(".mejs-container")
          .next(".video-overlay")
          .find("button")
          .off("click", handleIconClick)
          .off("mouseenter", handleIconEnter);
      };

    init();

    return {
      widget: "VideoPlayer",
      play: play,
      getPlayer: getPlayer,
      setSource: setSource,
      destroy: destroy,
    };
  };
})(nsLibrary, nsObject, MediaElementPlayer, Popcorn);
