/**
 * EventHandler
 * @param  {object} $	Library
 * @param  {object} ns	NameSpace
 * @param  {object} routie	Router
 */
/*global nsLibrary:false, nsObject:false */
(function ($, ns) {
  "use strict";

  /**
   * EventHandler Constructor.
   * @constructor
   */
  ns.EventHandler = function () {
    var shareTypes = { facebook: "share", twitter: "tweet" },
      hotspotMapping = [
        {
          1: "mercedes",
          2: "mercedes stats",
          3: "police barricade",
          4: "spikestrip",
          5: "esf",
          6: "ferrari",
          7: "escape route",
          8: "buy now",
        },
        {
          1: "lamborghini",
          2: "lamborghini details",
          3: "all drive",
          4: "emp",
          5: "spikestrip",
          6: "easy drive",
          7: "destruction",
          8: "buy now",
        },
        {
          1: "ferrari",
          2: "elevation",
          3: "lamborghini details",
          4: "police helicopters",
          5: "destruction",
          6: "momentum",
          7: "dynamic weather",
          8: "race multiplier",
          9: "buy now",
        },
      ],
      preloaderStart = function () {
        dmaf.tell("mainLoaderStart");
      },
      preloaderEnd = function () {
        dmaf.tell("mainLoaderEnd");
      },
      preloaderAccoladeShown = function (which) {},
      introPageLoad = function () {
        dmaf.tell("showLandingPage");
      },
      preloaderVideoStart = function (video) {
        dmaf.registerObject("intro", video);
      },
      preloaderVideoEnd = function (video) {
        dmaf.unregisterObject("intro");
      },
      introAnimateIn = function () {
        trackPage("home");
      },
      introLeftHover = function () {
        dmaf.tell("hooverWatch");
      },
      introLeftPlaySequence = function () {
        dmaf.tell("watchPlaying");
      },
      introLeftClick = function () {
        trackEvent("", "home", "open tvc");
        dmaf.tell("mouseDownWatch");
      },
      introRightPlaySequence = function () {
        dmaf.tell("drivePlaying");
      },
      introRightHover = function () {
        dmaf.tell("hooverDrive");
      },
      introRightClick = function () {
        trackEvent("", "home", "open scenario journey");
        dmaf.tell("mouseDownDrive");
      },
      introMouseLeave = function () {},
      introTvcPlay = function (video) {
        trackPage("tvc_video");
        trackEvent("", "video_start", "TVC");
        dmaf.registerObject("watch_tvc", video);
      },
      introTvcPlaying = function (percentage) {
        trackEvent("", "video_" + percentage, "TVC");
      },
      introTvcEnd = function (video) {
        trackEvent("", "video_complete", "TVC");
        dmaf.unregisterObject("watch_tvc");
      },
      setUpPageLoad = function (scene) {
        trackPage("scenario" + scene);
      },
      setUpMoviePlay = function (scene, video) {
        trackEvent("", "video_start", "scenario" + scene);

        switch (scene) {
          case 1:
            dmaf.registerObject("sceneOneIntro", video);
            break;
          case 2:
            dmaf.registerObject("sceneTwoIntro", video);
            break;
          case 3:
            dmaf.registerObject("sceneThreeIntro", video);
            break;
        }
      },
      setUpMovieEnd = function (scene, video) {
        trackEvent("", "video_complete", "scenario" + scene);

        switch (scene) {
          case 1:
            dmaf.unregisterObject("sceneOneIntro");
            break;
          case 2:
            dmaf.unregisterObject("sceneTwoIntro");
            break;
          case 3:
            dmaf.unregisterObject("sceneThreeIntro");
            break;
        }
      },
      choicePageLoad = function (scene) {
        trackPage("decision/scenario" + scene);

        switch (scene) {
          case 1:
            dmaf.tell("showSceneOneDescisionPoint");
            break;
          case 2:
            dmaf.tell("showSceneTwoDescisionPoint");
            break;
          case 3:
            dmaf.tell("showSceneThreeDescisionPoint");
            break;
        }
      },
      choiceAnimateIn = function (scene) {},
      choiceLeftClick = function (scene) {
        switch (scene) {
          case 1:
            trackEvent("", "decision", "speed");
            dmaf.tell("mouseDownSpeed");
            break;
          case 2:
            trackEvent("", "decision", "mercy");
            dmaf.tell("mouseDownMercy");
            break;
          case 3:
            trackEvent("", "decision", "honor");
            dmaf.tell("mouseDownHonor");
            break;
        }
      },
      choiceLeftPlaySequence = function (scene) {
        switch (scene) {
          case 1:
            dmaf.tell("speedPlaying");
            break;
          case 2:
            dmaf.tell("mercyPlaying");
            break;
          case 3:
            dmaf.tell("honorPlaying");
            break;
        }
      },
      choiceLeftHover = function (scene) {
        switch (scene) {
          case 1:
            dmaf.tell("hooverSpeed");
            break;
          case 2:
            dmaf.tell("hooverMercy");
            break;
          case 3:
            dmaf.tell("hooverHonor");
            break;
        }
      },
      choiceRightClick = function (scene) {
        switch (scene) {
          case 1:
            trackEvent("", "decision", "deception");
            dmaf.tell("mouseDownDeception");
            break;
          case 2:
            trackEvent("", "decision", "mayhem");
            dmaf.tell("mouseDownMayhem");
            break;
          case 3:
            trackEvent("", "decision", "glory");
            dmaf.tell("mouseDownGlory");
            break;
        }
      },
      choiceRightPlaySequence = function (scene) {
        switch (scene) {
          case 1:
            dmaf.tell("deceptionPlaying");
            break;
          case 2:
            dmaf.tell("mayhemPlaying");
            break;
          case 3:
            dmaf.tell("gloryPlaying");
            break;
        }
      },
      choiceRightHover = function (scene) {
        switch (scene) {
          case 1:
            dmaf.tell("hooverDeception");
            break;
          case 2:
            dmaf.tell("hooverMayhem");
            break;
          case 3:
            dmaf.tell("hooverGlory");
            break;
        }
      },
      choiceShowWrongChoice = function (scene) {
        trackPage("decision/scenario" + scene + "/answer");

        switch (scene) {
          case 1:
            dmaf.tell("sceneOneFailPage");
            break;
          case 2:
            dmaf.tell("sceneTwoFailPage");
            break;
          case 3:
            dmaf.tell("sceneThreeFailPage");
            break;
        }
      },
      choiceCloseWrongChoice = function (scene) {},
      choiceWrongChoiceShare = function (scene, platform) {
        trackEvent(
          "",
          "decision",
          "scene" + scene + "/" + platform + "/" + shareTypes[platform]
        );
      },
      choiceResolutionPlay = function (scene, video) {
        trackPage("decision/scenario" + scene + "/answer");

        switch (scene) {
          case 1:
            dmaf.registerObject("sceneOneTransition", video);
            break;
          case 2:
            dmaf.registerObject("sceneTwoTransition", video);
            break;
          case 3:
            dmaf.registerObject("sceneThreeTransition", video);
            break;
        }
      },
      choiceResolutionEnd = function (scene, video) {
        switch (scene) {
          case 1:
            dmaf.unregisterObject("sceneOneTransition");
            break;
          case 2:
            dmaf.unregisterObject("sceneTwoTransition");
            break;
          case 3:
            dmaf.unregisterObject("sceneThreeTransition");
            break;
        }
      },
      choiceMouseLeave = function (scene) {},
      threeSixtyPageLoad = function (scene) {},
      threeSixtyShowIntro = function (scene) {
        trackPage("scenario_360/scenario" + scene);

        switch (scene) {
          case 1:
            dmaf.tell("startSceneOne360Pan");
            break;
          case 2:
            dmaf.tell("startSceneTwo360Pan");
            break;
          case 3:
            dmaf.tell("startSceneThree360Pan");
            break;
        }
      },
      threeSixtyShowHotspots = function (scene) {
        switch (scene) {
          case 1:
            dmaf.tell("showSceneOne360");
            break;
          case 2:
            dmaf.tell("showSceneTwo360");
            break;
          case 3:
            dmaf.tell("showSceneThree360");
            break;
        }
      },
      threeSixtyHotspotHover = function (scene, hotspotId) {
        dmaf.tell("hooverHotSpot" + (scene * 10 + hotspotId));
      },
      threeSixtyHotspotClick = function (scene, hotspotId) {
        var hotspotName = hotspotMapping[scene - 1][hotspotId];

        trackPage("scenario_360/scenario" + scene + "/" + hotspotName);

        dmaf.tell("mouseDownHotSpot" + (scene * 10 + hotspotId));
      },
      threeSixtyHotspotOverlayShown = function (scene, hotspotId) {
        dmaf.tell("startPan" + (scene * 10 + hotspotId));
      },
      threeSixtyGoToNextScreenHover = function (scene) {
        dmaf.tell("hooverContinue");
      },
      threeSixtyGoToNextScreen = function (scene) {
        dmaf.tell("mouseDownContinue");
      },
      threeSixtyBuyNow = function (scene) {
        trackEvent("", "scenario" + scene, "buy now");
      },
      endPageLoad = function () {
        trackPage("end page");
      },
      endOutroStart = function (video) {
        trackEvent("", "video_start", "end video");
        dmaf.registerObject("outroVideo", video);
      },
      endOutroEnd = function (video) {
        trackEvent("", "video_complete", "end video");
        dmaf.unregisterObject("outroVideo");
        dmaf.tell("showEndPage");
      },
      endTvcHover = function () {
        dmaf.tell("hooverWatch");
      },
      endTvcStart = function (video) {
        trackEvent("", "end page", "open tvc");
        trackPage("tvc_video");
        trackEvent("", "video_start", "TVC");

        dmaf.tell("mouseDownWatch");
        dmaf.registerObject("watch_tvc", video);
      },
      endTvcPlaying = function (percentage) {
        trackEvent("", "video_" + percentage, "TVC");
      },
      endTvcEnd = function (video) {
        trackEvent("", "video_complete", "TVC");
        dmaf.unregisterObject("watch_tvc");
      },
      endDriveHover = function () {
        dmaf.tell("hooverPlayAgain");
      },
      endDriveClick = function () {
        trackEvent("", "end page", "open scenario journey");
        dmaf.tell("mouseDownPlayAgain");
      },
      endShareHover = function () {
        dmaf.tell("hooverShare");
      },
      endShareClick = function () {
        dmaf.tell("mouseDownShare");
      },
      endShare = function (platform) {
        trackEvent("", "end page", platform + "/" + shareTypes[platform]);

        dmaf.tell("mouseDownShare");
      },
      endBuyHover = function () {
        dmaf.tell("hooverBuyNow");
      },
      endBuyClick = function () {
        trackEvent("", "end page", "buy now");
        dmaf.tell("mouseDownBuyNow");
      },
      tvcButtonHover = function () {
        dmaf.tell("hooverVideoButtons");
      },
      tvcPlayClick = function () {
        dmaf.tell("mouseDownVideoPlay");
      },
      tvcStopClick = function () {
        dmaf.tell("mouseDownVideoStop");
      },
      trackPage = function (category) {
        if (typeof ga === "function") {
          ga("send", "pageview", prefixCategory(category));
        }
      },
      trackEvent = function (category, action, label) {
        if (typeof ga === "function") {
          ga("send", "event", prefixCategory(category), action, label);
        }
      },
      prefixCategory = function (category) {
        var splitLocale = ns.locale.split("-");

        var prefixedCategory =
          splitLocale[0].toLowerCase() +
          "/" +
          splitLocale[1].toLowerCase() +
          "/nfs_rivals/cross_the_line";

        if (category !== "") {
          prefixedCategory += "/" + category;
        }

        return prefixedCategory;
      };

    return {
      preloaderStart: preloaderStart,
      preloaderEnd: preloaderEnd,
      preloaderAccoladeShown: preloaderAccoladeShown,
      preloaderVideoStart: preloaderVideoStart,
      preloaderVideoEnd: preloaderVideoEnd,

      introPageLoad: introPageLoad,
      introAnimateIn: introAnimateIn,
      introLeftHover: introLeftHover,
      introLeftClick: introLeftClick,
      introRightHover: introRightHover,
      introRightClick: introRightClick,
      introMouseLeave: introMouseLeave,
      introLeftPlaySequence: introLeftPlaySequence,
      introRightPlaySequence: introRightPlaySequence,

      introTvcPlay: introTvcPlay,
      introTvcPlaying: introTvcPlaying,
      introTvcEnd: introTvcEnd,

      setUpPageLoad: setUpPageLoad,
      setUpMoviePlay: setUpMoviePlay,
      setUpMovieEnd: setUpMovieEnd,

      choicePageLoad: choicePageLoad,
      choiceAnimateIn: choiceAnimateIn,
      choiceLeftClick: choiceLeftClick,
      choiceLeftHover: choiceLeftHover,
      choiceRightClick: choiceRightClick,
      choiceRightHover: choiceRightHover,
      choiceShowWrongChoice: choiceShowWrongChoice,
      choiceCloseWrongChoice: choiceCloseWrongChoice,
      choiceResolutionPlay: choiceResolutionPlay,
      choiceResolutionEnd: choiceResolutionEnd,
      choiceMouseLeave: choiceMouseLeave,
      choiceLeftPlaySequence: choiceLeftPlaySequence,
      choiceRightPlaySequence: choiceRightPlaySequence,
      choiceWrongChoiceShare: choiceWrongChoiceShare,

      threeSixtyPageLoad: threeSixtyPageLoad,
      threeSixtyShowIntro: threeSixtyShowIntro,
      threeSixtyShowHotspots: threeSixtyShowHotspots,
      threeSixtyHotspotClick: threeSixtyHotspotClick,
      threeSixtyHotspotOverlayShown: threeSixtyHotspotOverlayShown,
      threeSixtyGoToNextScreen: threeSixtyGoToNextScreen,
      threeSixtyHotspotHover: threeSixtyHotspotHover,
      threeSixtyGoToNextScreenHover: threeSixtyGoToNextScreenHover,
      threeSixtyBuyNow: threeSixtyBuyNow,

      endPageLoad: endPageLoad,
      endTvcStart: endTvcStart,
      endTvcPlaying: endTvcPlaying,
      endTvcEnd: endTvcEnd,
      endDriveClick: endDriveClick,
      endShare: endShare,
      endShareClick: endShareClick,
      endBuyClick: endBuyClick,
      endTvcHover: endTvcHover,
      endDriveHover: endDriveHover,
      endShareHover: endShareHover,
      endBuyHover: endBuyHover,
      endOutroStart: endOutroStart,
      endOutroEnd: endOutroEnd,

      tvcButtonHover: tvcButtonHover,
      tvcPlayClick: tvcPlayClick,
      tvcStopClick: tvcStopClick,
    };
  };
})(nsLibrary, nsObject);
