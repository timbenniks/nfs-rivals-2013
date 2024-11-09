/**
 * Controller.preloader
 * @param  {object} $	Library
 * @param  {object} ns	NameSpace
 * @param  {object} controller	Controller base object
 */
(function ($, ns, controller, tween) {
  "use strict";

  /**
   * controller.preloader Constructor.
   * @constructor
   */
  controller.preloader = function () {
    var event = ns.EventHandlerInstance,
      data = controller.getData("preloader"),
      id = data.misc.id,
      preloadAssetBase = controller.getData("intro"),
      htmlWrapper = $("#" + id),
      tmplSelector = $(data.misc.tmplSelector),
      leftComplete = false,
      rightComplete = false,
      soundComplete = false,
      completeInt = false,
      video,
      loader,
      tmplData = {},
      canvasWidth = 527,
      canvasHeight = 511,
      startHeading = 180,
      degToRad = Math.PI / 180,
      radToDeg = 180 / Math.PI,
      rightTopCornerHeading,
      rightBottomCornerHeading,
      leftBottomCornerHeading,
      leftTopCornerHeading,
      canvas,
      sequensing,
      amountLoadedAssets = 0,
      context,
      loaderBg,
      loaderOverlay,
      accoladeItems,
      accoladeInt = false,
      soundEl,
      ext = ns.useMp4 ? "mp4" : "webm",
      currentAccolade = 0,
      init = function () {
        tmplData.accolades = [];

        if (data.copy.accolade1 && data.copy.accolade1 !== "")
          tmplData.accolades.push($.trim(data.copy.accolade1));
        if (data.copy.accolade2 && data.copy.accolade2 !== "")
          tmplData.accolades.push($.trim(data.copy.accolade2));
        if (data.copy.accolade3 && data.copy.accolade3 !== "")
          tmplData.accolades.push($.trim(data.copy.accolade3));
        if (data.copy.accolade4 && data.copy.accolade4 !== "")
          tmplData.accolades.push($.trim(data.copy.accolade4));
        if (data.copy.accolade5 && data.copy.accolade5 !== "")
          tmplData.accolades.push($.trim(data.copy.accolade5));
        if (data.copy.accolade6 && data.copy.accolade6 !== "")
          tmplData.accolades.push($.trim(data.copy.accolade6));

        tmplData["turn_sound_on"] = data.copy["turn_sound_on"];

        $.each(data.assets["logo_anim"], function () {
          var src = this.src.split(".")[0];
          tmplData["logo_anim_" + ext] =
            ns.BaseUrl +
            ns.AssetPreloaderInstance.getCacheBustedUrl(src + "." + ext);
          tmplData["logo_anim_type_" + ext] = "video/" + ext;
        });

        tmplData.useMp4 = ns.useMp4;

        var tmplHtml = tmplSelector.html(),
          tmpl = controller.getTmpl(tmplHtml, tmplData);

        controller.renderTmpl(htmlWrapper, tmpl, function () {
          htmlWrapper.addClass("active");
          controller.scanTmpl(htmlWrapper);
          video = htmlWrapper.find("video");
          loader = htmlWrapper.find(".loader");
          canvas = htmlWrapper.find("canvas");
          context = canvas[0].getContext("2d");
          loaderBg = htmlWrapper.find("#loaderBg");
          loaderOverlay = htmlWrapper.find("#loaderOverlay");
          accoladeItems = htmlWrapper.find("li");
          soundEl = htmlWrapper.find(".turn-sound-on");

          initCornerHeadings();

          soundEl.delay(1000).fadeOut(300, function () {
            animateAccolades();

            accoladeInt = setInterval(function () {
              animateAccolades();
            }, 2000);
          });
        });

        controller.getAssets(preloadAssetBase.assets["left"], {
          onComplete: function () {
            leftComplete = true;
          },
        });
        controller.getAssets(preloadAssetBase.assets["right"], {
          onComplete: function () {
            rightComplete = true;
          },
        });

        event.preloaderStart();

        var isIe = ns.Detect.has("ie") || ns.Detect.has("ie10");
        var forceSound =
          window.location.search && window.location.search == "?sound";

        if (!isIe || forceSound) {
          dmaf.fail(function () {
            soundComplete = true;
          });

          dmaf.ready(function () {
            dmaf.tell(ns.lang === "en" ? "load_english" : "load_other");
          });

          dmaf.addEventListener("audio_loaded", function () {
            soundComplete = true;
            dmaf.tell("sound_on");
          });

          dmaf.init(
            ns.StaticUrl.indexOf("http://") >= 0
              ? ns.StaticUrl + "/sfx"
              : "/sfx"
          );
        } else {
          soundComplete = true;
        }

        completeInt = setInterval(function () {
          updateLoader();

          if (leftComplete && rightComplete && soundComplete) {
            clearInterval(completeInt);
            completeInt = false;
            clearInterval(accoladeInt);
            accoladeInt = false;

            handleOnAssetsLoaded();
            event.preloaderEnd();
          }
        }, 200);
      },
      animateAccolades = function () {
        accoladeItems.hide();

        if (currentAccolade > accoladeItems.length - 1) currentAccolade = 0;
        $(accoladeItems[currentAccolade]).fadeIn(1000, function () {
          currentAccolade++;
        });
      },
      updateLoader = function () {
        if (sequensing) return;

        sequensing = true;
        tween.to({ value: amountLoadedAssets }, 0.1, {
          value: amountLoadedAssets,
          ease: Quad.easeInOut,
          onUpdate: function () {
            var progress = 1;

            if (leftComplete) progress++;
            if (rightComplete) progress++;
            if (soundComplete) progress++;

            amountLoadedAssets =
              progress >= 4
                ? 100
                : amountLoadedAssets +
                  progress * (100 - amountLoadedAssets - 1) * 0.03;

            renderMask(amountLoadedAssets);
          },

          onComplete: function () {
            sequensing = false;
            renderMask(amountLoadedAssets);
          },
        });
      },
      initCornerHeadings = function () {
        var diagonalHeading = Math.atan(canvasHeight / canvasWidth) * radToDeg;

        rightTopCornerHeading = 90 - diagonalHeading;
        rightBottomCornerHeading = 180 - diagonalHeading;
        leftBottomCornerHeading = 270 - diagonalHeading;
        leftTopCornerHeading = 360 - diagonalHeading;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      },
      renderMask = function (percentage) {
        context.save();
        context.clearRect(0, 0, ns.width, ns.height);
        context.drawImage(loaderBg[0], 0, 0, canvasWidth, canvasHeight);

        createPath(percentage);

        context.closePath();
        context.clip();

        context.drawImage(loaderOverlay[0], 0, 0, canvasWidth, canvasHeight);
        context.restore();
      },
      createPath = function (percentage) {
        var edgeStartX = canvasWidth / 2,
          edgeStartY = canvasHeight;

        context.beginPath();
        context.moveTo(canvasWidth / 2, canvasHeight / 2);
        context.lineTo(edgeStartX, edgeStartY);
        createEdgeLines(percentage, edgeStartX, edgeStartY);
        context.lineTo(canvasWidth / 2, canvasHeight / 2);
      },
      createEdgeLines = function (percentage, startX, startY) {
        var degrees = percentage * 3.6,
          heading = (degrees + startHeading) % 360,
          fullCircle = percentage === 100;

        if (heading >= leftBottomCornerHeading || heading < 180 || fullCircle) {
          context.lineTo(0, canvasHeight);

          if (heading >= leftTopCornerHeading || heading <= 180) {
            context.lineTo(0, 0);

            if (heading >= rightTopCornerHeading && heading <= 180) {
              context.lineTo(canvasWidth, 0);

              if (heading >= rightBottomCornerHeading) {
                context.lineTo(canvasWidth, canvasHeight);
                createPartialBottomRightEdge(heading);
              } else {
                createPartialRightEdge(heading);
              }
            } else {
              createPartialTopEdge(heading);
            }
          } else {
            createPartialLeftEdge(heading);
          }
        } else {
          createPartialBottomLeftEdge(heading);
        }
      },
      createPartialBottomLeftEdge = function (heading) {
        var opposite = calculateOpposite(heading - 180, canvasHeight / 2);
        context.lineTo(canvasWidth / 2 - opposite, canvasHeight);
      },
      createPartialLeftEdge = function (heading) {
        var opposite = calculateOpposite(
            Math.abs(heading - 270),
            canvasWidth / 2
          ),
          y;

        if (heading <= 270) {
          y = canvasHeight / 2 + opposite;
        } else {
          y = canvasHeight / 2 - opposite;
        }

        context.lineTo(0, y);
      },
      createPartialTopEdge = function (heading) {
        var opposite, angle, x;

        if (heading > leftTopCornerHeading) {
          angle = 360 - heading;
        } else {
          angle = heading;
        }

        opposite = calculateOpposite(angle, canvasWidth / 2);

        if (heading <= 270) {
          x = canvasHeight / 2 + opposite;
        } else {
          x = canvasHeight / 2 - opposite;
        }

        context.lineTo(x, 0);
      },
      createPartialRightEdge = function (heading) {
        var opposite = calculateOpposite(
            Math.abs(heading - 90),
            canvasWidth / 2
          ),
          y;

        if (heading <= 90) {
          y = canvasHeight / 2 - opposite;
        } else {
          y = canvasHeight / 2 + opposite;
        }

        context.lineTo(canvasWidth, y);
      },
      createPartialBottomRightEdge = function (heading) {
        var opposite = calculateOpposite(
          Math.abs(heading - 180),
          canvasHeight / 2
        );
        context.lineTo(canvasWidth / 2 + opposite, canvasHeight);
      },
      calculateOpposite = function (angle, adjacent) {
        return Math.tan(angle * degToRad) * adjacent;
      },
      handleOnAssetsLoaded = function () {
        $(".loader").fadeOut();
        $("video")[0].play();

        $("video")[0].addEventListener(
          "play",
          function () {
            event.preloaderVideoStart($("video")[0]);
          },
          false
        );

        $("video")[0].addEventListener(
          "ended",
          function () {
            event.preloaderVideoEnd($("video")[0]);
            ns.RouterInstance.startIntro();
          },
          false
        );
      },
      destroy = function () {
        controller.cleanData("global");
        controller.cleanData("preloader");
      };

    init();

    return {
      controller: "preloader",
      destroy: destroy,
      id: id,
    };
  };
})(
  nsLibrary,
  nsObject,
  (nsObject.Controller = nsObject.Controller || {}),
  Tween
);
