/**
 * Controller.intro
 * @param  {object} $	Library
 * @param  {object} ns	NameSpace
 * @param  {object} controller	Controller base object
 */
(function ($, ns, controller, tween) {
  "use strict";

  /**
   * controller.intro Constructor.
   * @constructor
   */
  controller.intro = function () {
    var event = ns.EventHandlerInstance,
      data = controller.getData("intro"),
      id = data.misc.id,
      htmlWrapper = $("#" + id),
      tmplSelector = $(data.misc.tmplSelector),
      rightComplete = false,
      leftComplete = false,
      completeInt = false,
      tmplData = {},
      leftChoiceEl,
      rightChoiceEl,
      leftBtnEl,
      rightBtnEl,
      leftBtnIconEl,
      rightBtnIconEl,
      leftBtnTextEl,
      rightBtnTextEl,
      headerH1,
      headerH2,
      leftCanvas,
      rightCanvas,
      choiceContentWrapperEl,
      choiceVideoWrapperEl,
      videoEl,
      leftCanvasInstance,
      rightCanvasInstance,
      stopEl,
      ease = Expo.easeInOut,
      speed = 0.5,
      headersAreHidden = false,
      leaveBound = true,
      ext = ns.useMp4 ? "mp4" : "webm",
      tvcAssets = data.assets["tvc"],
      subs = [],
      offset = 0,
      leftBtnPos,
      rightBtnPos,
      videoEventInterval = 10,
      videoPosition,
      leftClickBound = true,
      leftHoverBound = true,
      rightHoverBound = true,
      doNotCancelMe = false,
      init = function () {
        setButtonPositions();

        tmplData.btn_drive = data.copy["drive"];
        tmplData.btn_watch = data.copy["watch"];
        tmplData.subtitle = data.copy["subtitle"];
        tmplData.title = data.copy["title"];
        tmplData.useMp4 = ns.useMp4;
        tmplData.lang = ns.lang;
        tmplData.facebook_title = data.copy["facebook_title"];
        tmplData.facebook_summary = data.copy["facebook_summary"];
        tmplData.facebook_image = data.copy["facebook_image"];
        tmplData.facebook_url = data.copy["facebook_url"];
        tmplData.twitter_url = data.copy["twitter_url"];
        tmplData.twitter_tweet = data.copy["twitter_tweet"];

        for (var i = 1; i < parseInt(data.misc.subtitle_count, 10) + 1; i++) {
          subs.push({
            start: data.copy["subtitles_" + i + "_start"],
            end: data.copy["subtitles_" + i + "_end"],
            text: data.copy["subtitles_" + i + "_text"],
          });
        }

        tmplData.subtitles = JSON.stringify(subs);

        controller.getAssets(data.assets["left"], {
          onComplete: function () {
            leftComplete = true;
          },
        });
        controller.getAssets(data.assets["right"], {
          onComplete: function () {
            rightComplete = true;
          },
        });

        $.each(tvcAssets, function () {
          var src = this.src.split(".")[0];
          tmplData["tvc_" + ext] =
            ns.BaseUrl +
            ns.AssetPreloaderInstance.getCacheBustedUrl(src + "." + ext);
          tmplData["tvc_type_" + ext] = "video/" + ext;
        });

        completeInt = setInterval(function () {
          if (leftComplete && rightComplete) {
            clearInterval(completeInt);
            completeInt = false;

            onAssetsLoadedComplete();
          }
        }, 200);
      },
      onAssetsLoadedComplete = function () {
        var tmplHtml = tmplSelector.html(),
          tmpl = controller.getTmpl(tmplHtml, tmplData);

        controller.renderTmpl(htmlWrapper, tmpl, function () {
          htmlWrapper.addClass("active");
          controller.scanTmpl(htmlWrapper);

          event.introPageLoad();

          handleChoices();
        });
      },
      handleChoices = function () {
        leftChoiceEl = htmlWrapper.find(".choice.left");
        rightChoiceEl = htmlWrapper.find(".choice.right");
        leftBtnEl = leftChoiceEl.find(".cta");
        rightBtnEl = rightChoiceEl.find(".cta");
        leftBtnIconEl = leftBtnEl.find("img");
        rightBtnIconEl = rightBtnEl.find("img");
        leftBtnTextEl = leftBtnEl.find("span");
        rightBtnTextEl = rightBtnEl.find("span");
        headerH1 = htmlWrapper.find("h1");
        headerH2 = htmlWrapper.find("h2");
        leftCanvas = htmlWrapper.find("canvas.left");
        rightCanvas = htmlWrapper.find("canvas.right");
        choiceContentWrapperEl = htmlWrapper.find(
          ".choice-content-canvas-copy"
        );
        choiceVideoWrapperEl = htmlWrapper.find(".choice-content-tvc");
        videoEl = choiceVideoWrapperEl.find("video");
        stopEl = htmlWrapper.find(".stop");

        buildUpScreen();
      },
      buildUpScreen = function () {
        tween.to(headerH1[0], speed * 2, { opacity: 1, ease: ease });
        tween.to(headerH2[0], speed * 2, { opacity: 1, ease: ease });
        tween.to(leftCanvas[0], speed, { left: 0, ease: ease });
        tween.to(rightCanvas[0], speed, {
          left: 0,
          ease: ease,
          onComplete: function () {
            tween.to(leftBtnEl[0], speed, { opacity: 1, ease: ease });
            tween.to(rightBtnEl[0], speed, { opacity: 1, ease: ease });

            bindEvents();

            setTimeout(function () {
              ns.Controller.destroy($("#preloader"), function () {
                $("#preloader").remove();
              });
            }, 1000);
          },
        });

        event.introAnimateIn();
      },
      setButtonPositions = function () {
        switch (ns.lang) {
          case "en":
            leftBtnPos = "-98px";
            rightBtnPos = "-83px";
            break;

          case "fr":
          case "de":
          case "it":
            leftBtnPos = "-198px";
            rightBtnPos = "-183px";
            break;

          case "es":
            leftBtnPos = "-128px";
            rightBtnPos = "-203px";
            break;

          case "pl":
            leftBtnPos = "-268px";
            rightBtnPos = "-133px";
            break;

          case "ru":
            leftBtnPos = "-268px";
            rightBtnPos = "-263px";
            break;
        }
      },
      bindEvents = function () {
        leftCanvasInstance = getCanvasInstance(leftCanvas[0]);
        rightCanvasInstance = getCanvasInstance(rightCanvas[0]);

        leftChoiceEl.on("mouseenter", function () {
          handleEnter("left", this);
        });
        rightChoiceEl.on("mouseenter", function () {
          handleEnter("right", this);
        });

        leftChoiceEl.on("click", function () {
          handleClick("left", this);
        });
        rightChoiceEl.on("click", function () {
          handleClick("right", this);
        });

        choiceContentWrapperEl.on("mouseleave", handleLeave);

        stopEl.on("click", stopVideo);
      },
      handleEnter = function (side, element) {
        if (side === "left") {
          leftCanvas.removeClass("blur");
          rightCanvas.addClass("blur");
          leftCanvasInstance.growHover();
          rightCanvasInstance.shrinkHover();
          resetBtnPos("right");
          setBtnPos("left");
          hideHeaders("left");

          if (!leftCanvasInstance.isSequensing()) {
            event.introLeftPlaySequence();
          }

          leftCanvasInstance.playSequence();
          event.introLeftHover();
        } else {
          rightCanvas.removeClass("blur");
          leftCanvas.addClass("blur");
          leftCanvasInstance.shrinkHover();
          rightCanvasInstance.growHover();
          resetBtnPos("left");
          setBtnPos("right");
          hideHeaders("right");

          if (!rightCanvasInstance.isSequensing()) {
            event.introRightPlaySequence();
          }

          rightCanvasInstance.playSequence();
          event.introRightHover();
        }
      },
      stopVideo = function () {
        leftCanvasInstance.reset();
        rightCanvasInstance.reset();
        choiceContentWrapperEl.fadeIn(500);
        resetBtnPos("left");
        resetBtnPos("right");
        showHeaders("left");

        if (!leaveBound) {
          choiceContentWrapperEl.on("mouseleave", handleLeave);
          leaveBound = true;
        }

        event.introTvcEnd(videoEl[0]);

        if (!leftHoverBound) {
          leftChoiceEl.on("mouseenter", function () {
            handleEnter("left", this);
          });
          leftHoverBound = true;
        }

        if (!rightHoverBound) {
          rightChoiceEl.on("mouseenter", function () {
            handleEnter("right", this);
          });
          rightHoverBound = true;
        }

        if (!leftClickBound) {
          leftChoiceEl.on("click", function () {
            handleClick("left", this);
          });
          leftClickBound = true;
        }
      },
      handleClick = function (side) {
        var videoInstance = getVideoPlayerInstance();

        tween.killTweensOf(leftBtnEl[0]);
        tween.killTweensOf(rightBtnEl[0]);

        if (leftHoverBound) {
          leftChoiceEl.off("mouseenter");
          leftHoverBound = false;
        }

        if (rightHoverBound) {
          rightChoiceEl.off("mouseenter");
          rightHoverBound = false;
        }

        if (leaveBound) {
          choiceContentWrapperEl.off("mouseleave");
          leaveBound = false;
        }

        if (side === "left") {
          event.introLeftClick();

          tween.to(leftBtnEl[0], speed, {
            left: "350px",
            opacity: 0,
            ease: ease,
          });
          tween.to(rightBtnEl[0], speed, {
            right: "-1100px",
            opacity: 0,
            ease: ease,
          });

          choiceVideoWrapperEl[0].style.opacity = 1;

          leftCanvasInstance.setSequencing(false);
          rightCanvasInstance.setSequencing(false);

          var player = videoInstance.getPlayer();
          videoInstance.play();

          if (leftClickBound) {
            leftChoiceEl.off("click");
            leftClickBound = false;
          }

          event.introTvcPlay(player);

          leftCanvasInstance.growMax(function () {
            tween.killAll();
            choiceContentWrapperEl.fadeOut(300);
          });

          rightCanvasInstance.shrinkMax();

          // tvc time update
          player.addEventListener(
            "timeupdate",
            function (e) {
              var newPosition =
                (e.target.currentTime / e.target.duration) * 100;

              // send event for every interval of 10%.
              if (
                newPosition % videoEventInterval <
                videoPosition % videoEventInterval
              ) {
                var eventPosition =
                  Math.floor(newPosition / videoEventInterval) *
                  videoEventInterval;

                if (eventPosition !== 100) {
                  event.introTvcPlaying(
                    Math.floor(newPosition / videoEventInterval) *
                      videoEventInterval
                  );
                }
              }

              videoPosition = newPosition;
            },
            false
          );

          // tvc ended
          player.addEventListener(
            "ended",
            function () {
              stopVideo();
            },
            false
          );
        }

        if (side === "right") {
          doNotCancelMe = true;
          event.introRightClick();

          tween.to(leftBtnEl[0], speed, {
            left: "-1100px",
            opacity: 0,
            ease: ease,
          });
          tween.to(rightBtnEl[0], speed, {
            right: "350px",
            opacity: 0,
            ease: ease,
          });

          leftCanvasInstance.shrinkMax();
          rightCanvasInstance.growMax(function () {
            tween.killAll();
            ns.RouterInstance.startSceneOneSetup();
          });
        }
      },
      handleLeave = function () {
        if (doNotCancelMe) return false;

        resetBtnPos("left");
        resetBtnPos("right");
        leftCanvasInstance.animateReset();
        rightCanvasInstance.animateReset();
        leftCanvas.removeClass("blur");
        rightCanvas.removeClass("blur");

        event.introMouseLeave();

        setTimeout(showHeaders, 100);
      },
      hideHeaders = function (side) {
        if (headersAreHidden) return false;

        tween.killTweensOf(headerH1[0]);
        tween.killTweensOf(headerH2[0]);

        tween.to(headerH1[0], speed * 1.1, {
          left: side === "left" ? "1100px" : "-1100px",
          ease: ease,
        });
        tween.to(headerH2[0], speed, {
          left: side === "left" ? "1100px" : "-1100px",
          ease: ease,
        });

        headerH1.addClass("animate");
        headersAreHidden = true;
      },
      showHeaders = function () {
        tween.killTweensOf(headerH1[0]);
        tween.killTweensOf(headerH2[0]);

        tween.to(headerH1[0], speed * 1.1, { left: "299px", ease: ease });
        tween.to(headerH2[0], speed, { left: "253px", ease: ease });

        headerH1.removeClass("animate");
        headersAreHidden = false;
      },
      setBtnPos = function (side) {
        var right = ns.lang === "ru" ? "130px" : "200px",
          left = ns.lang === "ru" ? "130px" : "200px";

        if (side === "left") {
          tween.killTweensOf(leftBtnEl[0]);
          tween.killTweensOf(leftBtnTextEl[0]);
          tween.to(leftBtnEl[0], speed, { left: left, ease: ease });
          tween.to(leftBtnTextEl[0], speed * 1.2, {
            opacity: 1,
            left: "-20px",
            ease: ease,
          });
        }

        if (side === "right") {
          tween.killTweensOf(rightBtnEl[0]);
          tween.killTweensOf(rightBtnTextEl[0]);
          tween.to(rightBtnEl[0], speed, { right: right, ease: ease });
          tween.to(rightBtnTextEl[0], speed * 1.2, {
            opacity: 1,
            left: "20px",
            ease: ease,
          });
        }
      },
      resetBtnPos = function (side) {
        if (side === "left") {
          tween.killTweensOf(leftBtnEl[0]);
          tween.killTweensOf(leftBtnTextEl[0]);
          tween.to(leftBtnEl[0], speed, {
            left: leftBtnPos,
            opacity: 1,
            ease: ease,
          });
          tween.to(leftBtnTextEl[0], speed, {
            opacity: 0,
            left: "0px",
            ease: ease,
          });
        }

        if (side === "right") {
          tween.killTweensOf(rightBtnEl[0]);
          tween.killTweensOf(rightBtnTextEl[0]);
          tween.to(rightBtnEl[0], speed, {
            right: rightBtnPos,
            opacity: 1,
            ease: ease,
          });
          tween.to(rightBtnTextEl[0], speed, {
            opacity: 0,
            left: "60px",
            ease: ease,
          });
        }
      },
      getVideoPlayerInstance = function () {
        return ns.Scanner.getWidgetBySelector(videoEl[0], "VideoPlayer");
      },
      getCanvasInstance = function (canvas) {
        return ns.Scanner.getWidgetBySelector(canvas, "ChoiceCanvas");
      },
      destroy = function () {
        leftChoiceEl.off("mouseenter");
        rightChoiceEl.off("mouseenter");

        leftChoiceEl.off("click");
        rightChoiceEl.off("click");

        choiceContentWrapperEl.off("mouseleave");

        stopEl.off("click");

        controller.cleanData("intro");
        controller.destroy(htmlWrapper, function () {
          htmlWrapper.fadeOut(400, function () {
            htmlWrapper.empty().removeClass("active");
          });
        });
      };

    init();

    return {
      controller: "intro",
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
