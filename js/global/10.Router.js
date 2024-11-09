/**
 * Router
 * @param  {object} $	Library
 * @param  {object} ns	NameSpace
 * @param  {object} routie	Router
 */
/*global nsLibrary:false, nsObject:false */
(function ($, ns) {
  "use strict";

  /**
   * Router Constructor.
   * @constructor
   */
  ns.Router = function () {
    var startPreloader = function () {
        destroyController();
        ns.controllerInstance = new ns.Controller["preloader"]();
      },
      startIntro = function () {
        destroyController();
        ns.controllerInstance = new ns.Controller["intro"]();
      },
      startSceneOneSetup = function () {
        destroyController();
        ns.controllerInstance = new ns.Controller["scenesetup"]({ scene: 1 });
      },
      startSceneOneChoice = function () {
        destroyController();
        ns.controllerInstance = new ns.Controller["scenechoice"]({ scene: 1 });
      },
      startSceneOneThreeSixty = function () {
        destroyController();
        ns.controllerInstance = new ns.Controller["scenethreesixty"]({
          scene: 1,
        });
      },
      startSceneTwoSetup = function () {
        destroyController();
        ns.controllerInstance = new ns.Controller["scenesetup"]({ scene: 2 });
      },
      startSceneTwoChoice = function () {
        destroyController();
        ns.controllerInstance = new ns.Controller["scenechoice"]({ scene: 2 });
      },
      startSceneTwoThreeSixty = function () {
        destroyController();
        ns.controllerInstance = new ns.Controller["scenethreesixty"]({
          scene: 2,
        });
      },
      startSceneThreeSetup = function () {
        destroyController();
        ns.controllerInstance = new ns.Controller["scenesetup"]({ scene: 3 });
      },
      startSceneThreeChoice = function () {
        destroyController();
        ns.controllerInstance = new ns.Controller["scenechoice"]({ scene: 3 });
      },
      startSceneThreeThreeSixty = function () {
        destroyController();
        ns.controllerInstance = new ns.Controller["scenethreesixty"]({
          scene: 3,
        });
      },
      startEndScreen = function () {
        destroyController();
        ns.controllerInstance = new ns.Controller["end"]();
      },
      destroyController = function () {
        if (ns.controllerInstance) {
          ns.controllerInstance.destroy();
          ns.controllerInstance = null;
        }
      };

    return {
      startPreloader: startPreloader,
      startIntro: startIntro,
      startSceneOneSetup: startSceneOneSetup,
      startSceneOneChoice: startSceneOneChoice,
      startSceneOneThreeSixty: startSceneOneThreeSixty,
      startSceneTwoSetup: startSceneTwoSetup,
      startSceneTwoChoice: startSceneTwoChoice,
      startSceneTwoThreeSixty: startSceneTwoThreeSixty,
      startSceneThreeSetup: startSceneThreeSetup,
      startSceneThreeChoice: startSceneThreeChoice,
      startSceneThreeThreeSixty: startSceneThreeThreeSixty,
      startEndScreen: startEndScreen,
      destroyController: destroyController,
    };
  };
})(nsLibrary, nsObject);
