/*global nsObject:false,jsonData:false,PointerEventsPolyfill:false*/
nsLibrary(
  (function (ns) {
    ns.UnsupportedBrowser =
      ns.Detect.has("ielt9") ||
      ns.Detect.has("android") ||
      ns.Detect.has("ios") ||
      ns.Detect.has("fflt20") ||
      ns.Detect.has("touch");

    if (ns.UnsupportedBrowser) {
      $(".fallback").show();
      $("#preloader").remove();

      return false;
    }

    ns.Wrapper = $("#wrapper");
    ns.BaseUrl = $("body").data("assetPath");
    ns.StaticUrl = $("body").data("staticPath");
    ns.ReleaseVersionNumber = $("body").data("releaseVersionNumber");
    ns.Scanner = new ns.ClassInstantiator("widget");
    ns.AssetPreloaderInstance = ns.AssetPreloader();
    ns.RouterInstance = new ns.Router();
    ns.width = 1100;
    ns.height = 618;
    ns.lang = $("html").attr("lang");
    ns.locale = $("body")[0].className;
    ns.useMp4 =
      ns.Detect.has("ie") || ns.Detect.has("ie10") || ns.Detect.has("safari");
    ns.currentPosterImage = false;
    ns.EventHandlerInstance = new ns.EventHandler();

    if (ns.Detect.has("ie")) PointerEventsPolyfill.initialize({});

    $(".fallback").remove();
    $("#wrapper").addClass("with-loader");

    if (window.location.search) {
      var query = window.location.search.replace("?", "").split("=");
      if (query[0] === "deeplink") {
        var deeplink = query[1];
        ns.RouterInstance[deeplink]();
      } else {
        ns.RouterInstance.startPreloader();
      }
    } else {
      ns.RouterInstance.startPreloader();
    }
  })(nsObject)
);
