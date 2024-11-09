/**
 * controller.intro
 * @param  {object} $	Library
 * @param  {object} ns	NameSpace
 */
/*global nsLibrary:false, nsObject:false */
(function ($, ns, controller)
{
	'use strict';

	/**
	 * controller.intro Constructor.
	 * @constructor
	 */
	controller.scenesetup = function (params)
	{
		var event = ns.EventHandlerInstance,
			scene = params.scene,
			data = controller.getData('scene_' + scene + '_setup'),
			setupAssets = data.assets['scene_' + scene + '_setup'],
			id = data.misc.id,
			htmlWrapper = $('#' + id),
			tmplSelector = $(data.misc.tmplSelector),
			tmplData = {},
			videoEl, firstLineEl, secondLineEl,
			lineWrapperEl, subs = [],
			ext = ns.useMp4 ? 'mp4' : 'webm',
			instructionOneStart, instructionOneEnd,
			instructionTwoStart, instructionTwoEnd,

		init = function()
		{
			getChoiceAssetsForScene();
			
			if(scene === 1) { instructionOneStart = 10; instructionOneEnd = 12.5; instructionTwoStart = 14; instructionTwoEnd = 18; }
			if(scene === 2) { instructionOneStart = 3.7; instructionOneEnd = 6.2; instructionTwoStart = 6.5; instructionTwoEnd = 8.3; }
			if(scene === 3) { instructionOneStart = 0; instructionOneEnd = 2.5; instructionTwoStart = 5.5; instructionTwoEnd = 7; }
			
			tmplData.useMp4 = ns.useMp4;
			tmplData.captions = JSON.stringify([
			{
				start: instructionOneStart, 
				end: instructionOneEnd, 
				text: data.copy['instruction1']
			},
			{ 
				start: instructionTwoStart,
				end: instructionTwoEnd, 
				text: data.copy['instruction2']
			}]);

			for(var i = 1; i < parseInt(data.misc.subtitle_count, 10) + 1; i++)
			{
				subs.push({ start: data.copy['subtitles_' + i + '_start'], end: data.copy['subtitles_' + i + '_end'], text: data.copy['subtitles_' + i + '_text'] });
			}

			tmplData.subtitles = JSON.stringify(subs);

			$.each(setupAssets, function ()
			{
				var splittedSrc = this.src.split('.');

				if(splittedSrc[1] === 'jpg')
				{
					tmplData.poster = ns.BaseUrl + ns.AssetPreloaderInstance.getCacheBustedUrl(this.src);
				}
				else
				{
					var src = splittedSrc[0];
					tmplData['setup_' + ext] = ns.BaseUrl + ns.AssetPreloaderInstance.getCacheBustedUrl(src + '.' + ext);
					tmplData['setup_type_' + ext] = 'video/' + ext;
				}
			});

			onAssetsLoadedComplete();
		},

		onAssetsLoadedComplete = function()
		{
			var tmplHtml = tmplSelector.html(),
				tmpl = controller.getTmpl(tmplHtml, tmplData);

			ns.currentPosterImage = tmplData.poster;

			controller.renderTmpl(htmlWrapper, tmpl, function ()
			{
				htmlWrapper.addClass('active');
				controller.scanTmpl(htmlWrapper);
				
				event.setUpPageLoad(scene);

				videoEl = htmlWrapper.find('video');
				lineWrapperEl = htmlWrapper.find('.line-wrapper');
				firstLineEl = htmlWrapper.find('.first-line');
				secondLineEl = htmlWrapper.find('.second-line');

	 			var videoInstance = getVideoPlayerInstance(),
					player = videoInstance.getPlayer();
				
				videoInstance.play();	
				
				event.setUpMoviePlay(scene, player);

				player.addEventListener('ended', function ()
				{
					$('#poster').show();
					event.setUpMovieEnd(scene, player);

					if(scene === 1) ns.RouterInstance.startSceneOneChoice();
					if(scene === 2) ns.RouterInstance.startSceneTwoChoice();
					if(scene === 3) ns.RouterInstance.startSceneThreeChoice();
					
				}, false);
			});
		},

		getChoiceAssetsForScene = function ()
		{
			controller.getAssets(controller.getData('scene_'+ scene +'_choice').assets['left'], {});
			controller.getAssets(controller.getData('scene_'+ scene +'_choice').assets['right'], {});
		},

		getVideoPlayerInstance = function ()
		{
			return ns.Scanner.getWidgetBySelector(videoEl[0], 'VideoPlayer');
		},

		destroy = function ()
		{
			controller.cleanData('scene_' + scene + '_setup');
		};

		init();

		return { 
			controller: 'scenesetup',
			scene: scene,
			destroy: destroy,
			id: id
		};
	};

}(nsLibrary, nsObject, nsObject.Controller = nsObject.Controller || {}));