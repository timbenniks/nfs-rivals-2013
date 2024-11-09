/**
 * controller.scenethreesixty
 * @param  {object} $	Library
 * @param  {object} ns	NameSpace
 */
/*global nsLibrary:false, nsObject:false,controller:false, tween:false */
(function ($, ns, controller, tween)
{
	'use strict';

	/**
	 * controller.scenethreesixty Constructor.
	 * @constructor
	 */
	controller.scenethreesixty = function (params)
	{
		var event = ns.EventHandlerInstance,
			scene = params.scene,
			data = controller.getData('scene_' + scene + '_threesixty'),
			id = data.misc.id,
			htmlWrapper = $('#' + id),
			tmplSelector = $(data.misc.tmplSelector),
			assets = data.assets['threesixty'],
			threesixtyComplete = false,
			threesixtyHotspotsComplete = false,
			canvas,
			context,
			hotspots,
			sequenceData = {},
			sequensing = false,
			currentFrame = 0,
			currentSnapPoint = 0,
			completeInt = false,
			animSpeed = 300,
			currentHotspotId,
			nextSceneEl,
			ease = Quad.easeInOut,
			threesixtyIntroEl,
			threesixtyIntroLineOneEl,
			threesixtyIntroLineTwoEl,
			threesixtyIntroCopyEl,
			buyNowEl,
			ie9 = ns.Detect.has('ie'),
			pathPoints =
			{
				topLeftX: 0, topLeftY: 0,
				bottomLeftX: 0, bottomLeftY: ns.height,
				topRightX: 0, topRightY: 0,
				bottomRightX: 0, bottomRightY: ns.height
			},

		init = function ()
		{
			controller.getAssets(data.assets['threesixty'], { onComplete: function () { threesixtyComplete = true; } }); 
			controller.getAssets(data.assets['threesixty_hotspots'], { onComplete: function () { threesixtyHotspotsComplete = true; } }); 

			completeInt = setInterval(function ()
			{
				if(threesixtyComplete && threesixtyHotspotsComplete)
				{
					clearInterval(completeInt);
					completeInt = false;
					
					onAssetsLoadedComplete();
				}
			}, 200);
		},

		onAssetsLoadedComplete = function ()
		{
			var hotspotData = [],
				introData = [];
			
			$.each(data.hotspots, function(i, e)
			{
				var hotspotDataObject = 
				{
					hotspot: e, 
					position: data.snapPoints[0][i], 
					subtitle: (data.copy[e.id + '_subtitle']) ? data.copy[e.id + '_subtitle'] : false, 
					title: (data.copy[e.id + '_title']) ? data.copy[e.id + '_title'] : false,
					description: (data.copy[e.id + '_description']) ? data.copy[e.id + '_description'] : false
				};

				if(e.id !== 'hotspot_intro')
				{
				    hotspotDataObject.image = ns.AssetPreloaderInstance.getCacheBustedUrl(ns.BaseUrl + 'scene_' + scene + '_threesixty_hotspots/scene_' + scene + '_threesixty_' + e.id + '.jpg');
					hotspotDataObject.renderCanvas = !ie9;
				}

				hotspotData.push(hotspotDataObject);
			});
		
			introData.image = ns.AssetPreloaderInstance.getCacheBustedUrl(ns.BaseUrl + 'scene_' + scene + '_threesixty_hotspots/scene_' + scene + '_threesixty_hotspot_0.jpg');
			introData.copy1 = data.copy['intro_copy1'];
			introData.copy2 = data.copy['intro_copy2'];

			var tmplHtml = tmplSelector.html(),
				tmpl = controller.getTmpl(tmplHtml, { scene: scene, intro: introData, hotspots: hotspotData });

			controller.renderTmpl(htmlWrapper, tmpl, function ()
			{
				event.threeSixtyPageLoad(scene);
				htmlWrapper.addClass('active');
				onTemplateRendered();
			});
		},

		onTemplateRendered = function ()
		{
			canvas = htmlWrapper.find('canvas')[0];
			context = canvas.getContext('2d');
			
			canvas.width = ns.width;
			canvas.height = ns.height;
			context.globalCompositeOperation = 'copy';
			
			hotspots = htmlWrapper.find('.hotspot');
			threesixtyIntroEl = htmlWrapper.find('.threesixty-intro');
			threesixtyIntroCopyEl = threesixtyIntroEl.find('.intro-copy');
			threesixtyIntroLineOneEl = threesixtyIntroEl.find('.line-one');
			threesixtyIntroLineTwoEl = threesixtyIntroEl.find('.line-two');
			nextSceneEl = htmlWrapper.find('.go-to-next-scene');
			buyNowEl = htmlWrapper.find('.buy-now');

			hotspots.on('click', handleHotspotClick);

			hotspots.on('mouseenter', handleHotspotEnter);
			nextSceneEl.on('mouseenter', goToNextEnter);

			buyNowEl.on('click', buyNowClick);
				
			showIntro(function ()
			{
				showFrame(0);
				drawHotspots(0);
				nextSceneEl.on('click', goToNextScene).fadeIn(animSpeed * 8);
				controller.destroy($('#scene_choice'), function () { $('#scene_choice').removeClass('active').empty(); });
			});
		},

		handleHotspotEnter = function ()
		{
			event.threeSixtyHotspotHover(scene, $(this).index());
		},
		
		goToNextEnter = function()
		{
			event.threeSixtyGoToNextScreenHover(scene);
		},

		buyNowClick = function ()
		{
			event.threeSixtyBuyNow(scene);
		},

		handleHotspotClick = function ()
		{
			var spot = $(this),
				snapPoint = spot.index(),
				goToPercentage = spot.data('go');

			currentHotspotId = spot[0].id;
	
			if(snapPoint === currentSnapPoint) return;

			event.threeSixtyHotspotClick(scene, snapPoint);

			hideIntro();
			hideAllHotspotOverlays();
			
			hideAllHotspots(function ()
			{
				tweenToFrame(goToPercentage, function()
				{
					currentSnapPoint = snapPoint;
					drawHotspots(snapPoint);
					showHotspotOverlay(currentHotspotId, snapPoint);

					htmlWrapper.find('.hotspot.current').removeClass('current');
					spot.addClass('current').attr('data-clicked', true);
				});
			});
		},

		drawHotspots = function(snapPoint)
		{
			$.each(data.snapPoints[snapPoint], function(i, snap)
			{
				var z = snap.z,
					left = snap.x,
					top = snap.y,
					visible = snap.visible;

				hotspots[i].style.left = left + 'px';
				hotspots[i].style.top = top + 'px';
				hotspots[i].className = '';

				$(hotspots[i]).data('visible', visible);
				$(hotspots[i]).addClass('hotspot z-value-' + getZ(z));
			});
			
			showAllHotspots();
		},

		showAllHotspots = function ()
		{
			event.threeSixtyShowHotspots(scene);
			hotspots.each(function()
			{
				if($(this).data('visible'))
				{
					tween.to(this, (animSpeed * 2) / 1000, { opacity: 1, ease: ease });
				}
			});
		},

		getZ = function (z)
		{
			return parseInt(z / 10 + 1);
		},

		showIntro = function (callback)
		{
			event.threeSixtyShowIntro(scene);

			threesixtyIntroEl.fadeIn(animSpeed * 2, function ()
			{
				threesixtyIntroCopyEl.fadeIn(animSpeed / 2, function()
				{
					$(this).addClass('active');

					threesixtyIntroLineTwoEl.delay(animSpeed * 7).fadeIn(animSpeed).delay(animSpeed * 5);
					threesixtyIntroLineOneEl.fadeIn(animSpeed).delay(animSpeed * 5).fadeOut(animSpeed, function()
					{
						if(callback && typeof callback === 'function') callback();
					});
				});
			});
		},

		hideIntro = function (callback)
		{
			threesixtyIntroEl.fadeOut(animSpeed, callback);
		},

		showHotspotOverlay = function (hotspotId, hotspotIndex, callback)
		{
			event.threeSixtyHotspotOverlayShown(scene, hotspotIndex);
			
			var	contentWrapper = $('#' + hotspotId + '-content'),
				hotspotImg = contentWrapper.find('img'),
				hotspotCanvas = contentWrapper.find('.hotspot-canvas'),
				hotspotContent = contentWrapper.find('.hotspot-copy'),
				hotspotCanvasContext;

			if(!ie9)
			{
				hotspotContent.hide();
				hotspotImg.hide();
				contentWrapper.show();
				
				hotspotCanvasContext = hotspotCanvas[0].getContext('2d');
				
				hotspotCanvas[0].width = ns.width;
				hotspotCanvas[0].height = ns.height;
				hotspotCanvasContext.globalCompositeOperation = 'copy';

				Tween.to(pathPoints, 1,
				{
					topRightX: 1100,
					bottomRightX: 1014,
					ease: Expo.easeOut,
					onUpdate: function()
					{
						animateHotspotOverlayCanvas(hotspotCanvasContext, hotspotImg[0]);
					},

					onComplete: function ()
					{
						pathPoints.topRightX = 0;
						pathPoints.bottomRightX = 0;
						hotspotContent.fadeIn(500);
						if(callback) callback();
					}
				});
			}
			else
			{
				contentWrapper.fadeIn(300, callback);
				hotspotContent.fadeIn(300);
			}
		},
		
		hideAllHotspotOverlays = function ()
		{
			$('.hotspot-content-wrapper').fadeOut(300);
		},

		animateHotspotOverlayCanvas = function (ctx, img)
		{
			ctx.save();
			ctx.clearRect(0, 0, ns.width, ns.height);
			ctx.beginPath();
 			ctx.moveTo(pathPoints.topLeftX, pathPoints.topLeftY);
 			ctx.lineTo(pathPoints.topRightX, pathPoints.topRightY);
 			ctx.lineTo(pathPoints.bottomRightX, pathPoints.bottomRightY);
 			ctx.lineTo(pathPoints.bottomLeftX, pathPoints.bottomLeftY);
 			ctx.lineTo(pathPoints.topLeftX, pathPoints.topLeftY);
 			ctx.closePath();
 			ctx.clip();
			ctx.drawImage(img, 0, 0, ns.width, ns.height, 0, 0, ns.width, ns.height);
			ctx.restore();
		},

		showFrame = function (frame)
		{
			if(assets[frame] && assets[frame].tag)
			{
				context.drawImage(assets[frame].tag, 0, 0, ns.width, ns.height, 0, 0, ns.width, ns.height);
			}
		},

		tweenToFrame = function(to, callback)
		{
			to = to;
			
			sequenceData.value = currentFrame;
			
			sequensing = true;

			tween.to(sequenceData, (animSpeed * 2) / 1000,
			{
				value: to,
				ease: ease,
				onUpdate: function()
				{
					currentFrame = ~~sequenceData.value;
					showFrame(currentFrame);
				},

				onComplete: function()
				{
					sequensing = false;

					if(callback && typeof callback === 'function') callback();
				}
			});
		},
		
		hideAllHotspots = function (callback)
		{
			hotspots.each(function(index, el)
			{
				tween.to(this, animSpeed / 1000,
				{
					opacity: 0,
					ease: ease,
					onComplete: function()
					{
						if(index === hotspots.length - 1 && callback && typeof callback === 'function') callback();
					}
				});
			});
		},
		
		goToNextScene = function ()
		{
			event.threeSixtyGoToNextScreen(scene);
			if(scene === 1) ns.RouterInstance.startSceneTwoSetup();
			if(scene === 2) ns.RouterInstance.startSceneThreeSetup();
			if(scene === 3) ns.RouterInstance.startEndScreen();
		},

		destroy = function ()
		{
			if(hotspots) hotspots.off('click');
			if(nextSceneEl) nextSceneEl.off('click');
			if(buyNowEl) buyNowEl.off('click');
			if(hotspots) hotspots.off('mouseenter', handleHotspotEnter);
			if(nextSceneEl) nextSceneEl.off('mouseenter', goToNextEnter);
			
			controller.cleanData('scene_' + scene + '_threesixty');
			controller.destroy(htmlWrapper, function()
			{
				htmlWrapper.empty().removeClass('active');
			});
		};

		init();

		return { 
			controller: 'scenethreesixty',
			scene: scene,
			destroy: destroy,
			id: id
		};
	};

}(nsLibrary, nsObject, nsObject.Controller = nsObject.Controller || {}, Tween));