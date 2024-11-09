/**
 * controller.end
 * @param  {object} $	Library
 * @param  {object} ns	NameSpace
 */
/*global nsLibrary:false, nsObject:false */
(function ($, ns, controller)
{
	'use strict';

	/**
	 * controller.end Constructor.
	 * @constructor
	 */
	controller.end = function ()
	{
		var event = ns.EventHandlerInstance,
			data = controller.getData('end'),
			id = data.misc.id,
			htmlWrapper = $('#' + id),
			tmplSelector = $(data.misc.tmplSelector),
			tmplData = {},
			watchEl, driveEl, shareEl, buyEl, tvcVideoEl, stopEl, outroVideoEl,
			ext = ns.useMp4 ? 'mp4' : 'webm',
			subs = [],
		    videoEventInterval = 10,
		    videoPosition,

		init = function ()
		{
			tmplData.title = data.copy['title'];
			tmplData.subtitle = data.copy['subtitle'];
			tmplData.share_cta = data.copy['share_cta'];
			tmplData.buy_cta = data.copy['buy_cta'];
			tmplData.watch_cta = data.copy['watch_cta'];
			tmplData.play_again_cta = data.copy['play_again_cta'];

			tmplData.facebook_title = data.copy['facebook_title'];
			tmplData.facebook_summary = data.copy['facebook_summary'];
			tmplData.facebook_image = data.copy['facebook_image'];
			tmplData.facebook_url = data.copy['facebook_url'];
			tmplData.twitter_url = data.copy['facebook_url'];
			tmplData.twitter_tweet = data.copy['twitter_tweet'];

			tmplData.useMp4 = ns.useMp4;

			for (var i = 1; i < parseInt(controller.getData('intro').misc.subtitle_count) + 1; i++)
			{
				subs.push({ start: controller.getData('intro').copy['subtitles_' + i + '_start'], end: controller.getData('intro').copy['subtitles_' + i + '_end'], text: controller.getData('intro').copy['subtitles_' + i + '_text'] })
			}

			tmplData.subtitles = JSON.stringify(subs);

			$.each(data.assets['tvc'], function ()
			{
				var src = this.src.split('.')[0];
				tmplData['tvc_' + ext] = ns.BaseUrl + ns.AssetPreloaderInstance.getCacheBustedUrl(src + '.' + ext);
				tmplData['tvc_type_' + ext] = 'video/' + ext;
			});

			$.each(data.assets['outro'], function ()
			{
				var src = this.src.split('.')[0];
				tmplData['outro_' + ext] = ns.BaseUrl + ns.AssetPreloaderInstance.getCacheBustedUrl(src + '.' + ext);
				tmplData['outro_type_' + ext] = 'video/' + ext;
			});

			var tmplHtml = tmplSelector.html(),
				tmpl = controller.getTmpl(tmplHtml, tmplData);

			controller.renderTmpl(htmlWrapper, tmpl, function ()
			{
				htmlWrapper.addClass('active');
				controller.scanTmpl(htmlWrapper);

				event.endPageLoad();

				watchEl = htmlWrapper.find('#watch-tvc');
				driveEl = htmlWrapper.find('#drive');
				shareEl = htmlWrapper.find('#share');
				buyEl = htmlWrapper.find('#buy');
				tvcVideoEl = htmlWrapper.find('.choice-content-tvc video');
				outroVideoEl = htmlWrapper.find('.outro video');
				stopEl = htmlWrapper.find('.stop');

				watchEl.on('click', handleWatchClick);
				driveEl.on('click', handleDriveClick);
				shareEl.on('click', handleShareClick);
				buyEl.on('click', handleBuyClick);
				stopEl.on('click', stopTvc);

				watchEl.on('mouseenter', handleWatchHover);
				driveEl.on('mouseenter', handleDriveHover);
				shareEl.on('mouseenter', handleShareHover);
				buyEl.on('mouseenter', handleBuyHover);

				outroVideoEl[0].play();
				event.endOutroStart(outroVideoEl[0]);

				outroVideoEl[0].addEventListener('ended', function ()
				{
					event.endOutroEnd(outroVideoEl[0]);
					outroVideoEl.remove();
					$('.end-page-wrapper').fadeIn();

				}, false);
			});
		},

		handleWatchHover = function (e)
		{
			event.endTvcHover();
		},

		handleDriveHover = function (e)
		{
			event.endDriveHover();
		},

		handleShareHover = function (e)
		{
			event.endShareHover();
		},

		handleBuyHover = function (e)
		{
			event.endBuyHover();
		},

		handleWatchClick = function (e)
		{
			e.preventDefault();
			htmlWrapper.find('.choice-content-tvc')[0].style.opacity = 1;
			tvcVideoEl[0].play();
			htmlWrapper.find('.end-page-wrapper').fadeOut(400);

			event.endTvcStart(tvcVideoEl[0]);

			// tvc time update
			tvcVideoEl[0].addEventListener('timeupdate', function (e)
			{
				var newPosition = e.target.currentTime / e.target.duration * 100;

				// send event for every interval of 10%.
				if (newPosition % videoEventInterval < (videoPosition % videoEventInterval))
				{
					var eventPosition = Math.floor(newPosition / videoEventInterval) * videoEventInterval;

					if (eventPosition !== 100) event.endTvcPlaying(Math.floor(newPosition / videoEventInterval) * videoEventInterval);
				}

				videoPosition = newPosition;

			}, false);

			// tvc ended
			tvcVideoEl[0].addEventListener('ended', stopTvc, false);
		},

		stopTvc = function ()
		{
			htmlWrapper.find('.end-page-wrapper').fadeIn(400, function ()
			{
				ns.Scanner.destroyWidgetBySelector(outroVideoEl[0], 'VideoPlayer');
				$('.outro').remove();
				htmlWrapper.find('.choice-content-tvc')[0].style.opacity = 0;
			});

			event.endTvcEnd(tvcVideoEl[0]);
		},

		handleDriveClick = function (e)
		{
			e.preventDefault();
			event.endDriveClick();
			window.location.reload();
		},

		handleShareClick = function (e)
		{
			$('.share-end').fadeIn(500);
			$(this).find('img').fadeOut(500);

			$('.share-end').on('click', handleShare);

			e.preventDefault();
			event.endShareClick();
		},

		handleShare = function ()
		{
			if ($(this).hasClass('facebook'))
			{
				ns.Share['facebook']($(this).data());
				event.endShare('facebook');
			}

			if ($(this).hasClass('twitter'))
			{
				event.endShare('twitter');
				ns.Share['twitter']($(this).data());
			}
		},

		handleBuyClick = function ()
		{
			event.endBuyClick();
		},

		destroy = function ()
		{
			watchEl.off('click', handleWatchClick);
			driveEl.off('click', handleDriveClick);
			shareEl.off('click', handleShareClick);
			buyEl.off('click', handleBuyClick);
			stopEl.off('click', stopTvc);

			watchEl.off('mouseover', handleWatchHover);
			driveEl.off('mouseover', handleDriveHover);
			shareEl.off('mouseover', handleShareHover);
			buyEl.off('mouseover', handleBuyHover);

			controller.cleanData('end');
			controller.destroy(htmlWrapper, function ()
			{
				htmlWrapper.fadeOut(400, function ()
				{
					htmlWrapper.empty().removeClass('active');
				});
			});
		};

		init();

		return {
			controller: 'scenethreesixty',
			destroy: destroy,
			id: id
		};
	};

}(nsLibrary, nsObject, nsObject.Controller = nsObject.Controller || {}));