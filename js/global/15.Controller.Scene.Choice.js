/**
 * controller.scenechoice
 * @param  {object} $	Library
 * @param  {object} ns	NameSpace
 */
 /*global nsLibrary:false, nsObject:false, tween:false */
(function ($, ns, controller, tween)
{
	'use strict';

	/**
	 * controller.scenechoice Constructor.
	 * @constructor
	 */
	controller.scenechoice = function (params)
	{
		var event = ns.EventHandlerInstance,
			scene = params.scene,
			data = controller.getData('scene_' + scene + '_choice'),
			id = data.misc.id,
			htmlWrapper = $('#' + id),
			tmplSelector = $(data.misc.tmplSelector),
			tmplData = {},
			leftComplete = false,
			rightComplete = false,
			videoAssets = data.assets['video'],
			completeInt = false,
			leftChoiceEl, rightChoiceEl,
			leftBtnEl, rightBtnEl, 
			headerH1, leftCanvas, rightCanvas,
			wrongChoiceEl, choiceContentWrapperEl,
			choiceVideoWrapperEl,
			leftCanvasInstance, rightCanvasInstance,
			badgeEl, videoEl, shareBtnEl, sparkleEl,
			wrongChoiceContentCopyEl, wrongChoiceContentBadgeEl,
			ease = Expo.easeInOut,
			speed = 0.5,
			lang = ns.lang,
			leftHoverBound = false,
			leaveBound = false,
			wrongChoiceShown = false,
			ext = ns.useMp4 ? 'mp4' : 'webm',
			doNotCancelMe = false,
			videoPlayer,

		init = function()
		{	
			preloadSceneThreesixty();

			tmplData.scene = scene;
			tmplData.lang = lang;
			tmplData.btn_left = data.copy['left'];
			tmplData.btn_right =  data.copy['right'];
			tmplData.title = data.copy['title'];
			tmplData.wrong_title = data.copy['wrong_title'];
			tmplData.wrong_subtitle = data.copy['wrong_subtitle'];
			tmplData.wrong_badge_title = data.copy['wrong_badge_title'];
			tmplData.wrong_share = data.copy['wrong_share'];
			tmplData.facebook_title = data.copy['facebook_title'];
			tmplData.facebook_summary = data.copy['facebook_summary'];
			tmplData.facebook_image = data.copy['facebook_image'];
			tmplData.facebook_url = data.copy['facebook_url'];
			tmplData.twitter_url = data.copy['twitter_url'];
			tmplData.twitter_tweet = data.copy['twitter_tweet'];
			tmplData.useMp4 = ns.useMp4;
			tmplData.previousPoster = ns.currentPosterImage;

			if(scene === 1) tmplData.wrongChoiceOffset = 0;
			if(scene === 2) tmplData.wrongChoiceOffset = 0;
			if(scene === 3) tmplData.wrongChoiceOffset = -100;
			
			controller.getAssets(data.assets['left'], { onComplete: function () { leftComplete = true; } }); 
			controller.getAssets(data.assets['right'], { onComplete: function () { rightComplete = true; } });

			$.each(videoAssets, function ()
			{
				var splittedSrc = this.src.split('.');

				if(splittedSrc[1] === 'jpg')
				{
					tmplData.poster = ns.BaseUrl + ns.AssetPreloaderInstance.getCacheBustedUrl(this.src);
				}
				else
				{
					var src = splittedSrc[0];
					tmplData['video_' + ext] = ns.BaseUrl + ns.AssetPreloaderInstance.getCacheBustedUrl(src + '.' + ext);
					tmplData['video_type_' + ext] = 'video/' + ext;
				}
			});
					
			completeInt = setInterval(function ()
			{
				if(leftComplete && rightComplete)
				{
					clearInterval(completeInt);
					completeInt = false;
					
					onAssetsLoadedComplete();
				}
			}, 200);
		},

		onAssetsLoadedComplete = function()
		{
			var tmplHtml = tmplSelector.html(),
				tmpl = controller.getTmpl(tmplHtml, tmplData);

			controller.renderTmpl(htmlWrapper, tmpl, function ()
			{
				htmlWrapper.addClass('active');
				controller.scanTmpl(htmlWrapper);
	
				event.choicePageLoad(scene);

				buildScreen();
			});
		},

		buildScreen = function ()
		{
			leftChoiceEl = htmlWrapper.find('.choice.left');
			rightChoiceEl = htmlWrapper.find('.choice.right');
			leftBtnEl = leftChoiceEl.find('button');
			rightBtnEl = rightChoiceEl.find('button');
			headerH1 = htmlWrapper.find('h1');
			leftCanvas = htmlWrapper.find('canvas.left');
			rightCanvas = htmlWrapper.find('canvas.right');
			wrongChoiceEl = htmlWrapper.find('.wrong-choice');
			choiceContentWrapperEl = htmlWrapper.find('.choice-content-canvas-copy');
			choiceVideoWrapperEl = htmlWrapper.find('.choice-content-video');
			videoEl = choiceVideoWrapperEl.find('video');
			shareBtnEl = wrongChoiceEl.find('button');
			wrongChoiceContentCopyEl = wrongChoiceEl.find('.wrong-choice-content-copy');
			wrongChoiceContentBadgeEl = wrongChoiceEl.find('.wrong-choice-content-badge');
			badgeEl = wrongChoiceEl.find('.badge');
			sparkleEl = wrongChoiceEl.find('.sparkle');

			event.choiceAnimateIn(scene);
			
			tween.to(leftCanvas[0], speed, { left: 0, ease: ease });
			tween.to(rightCanvas[0], speed, { left: 0, ease: ease });

			bindEvents();

			tween.killTweensOf(headerH1[0]);
			tween.to(headerH1[0], speed * 2,
			{ 
				opacity: 1, 
				ease: ease, 
				onComplete: function ()
				{
					tween.to(headerH1[0], speed * 2, 
					{
						opacity: 0,
						ease: ease,
						onComplete: function ()
						{
							headerH1.hide();

							tween.killTweensOf(leftBtnEl[0]);
							tween.killTweensOf(rightBtnEl[0]);
							
							tween.to(leftBtnEl[0], speed, { opacity: 1, left: '128px', ease: ease });
							tween.to(rightBtnEl[0], speed, { opacity: 1, right: '112px', ease: ease });

							controller.destroy($('#scene_setup'), function ()
							{
								$('#scene_setup').removeClass('active').empty();
							});
						}
					});
				}
			});
		},

		preloadSceneThreesixty = function ()
		{
			controller.getAssets(controller.getData('scene_' + scene + '_threesixty').assets['threesixty'], {});
			controller.getAssets(controller.getData('scene_' + scene + '_threesixty').assets['threesixty_hotspots'], {}); 
		},

		bindEvents = function ()
		{
			leftHoverBound = true;
			leaveBound = true;
			
			leftCanvasInstance = getCanvasInstance(leftCanvas[0]);
			rightCanvasInstance = getCanvasInstance(rightCanvas[0]);

			leftChoiceEl.on('mouseenter', function () { handleEnter('left'); });
			rightChoiceEl.on('mouseenter', function () { handleEnter('right'); });
			
			leftChoiceEl.on('click', function () { handleClick('left'); });
			rightChoiceEl.on('click', function () { handleClick('right'); });

			choiceContentWrapperEl.on('mouseleave', handleLeave);

			shareBtnEl.on('click', handleShare);
		},

		handleClick = function (side)
		{
			if(leaveBound) 
			{
				choiceContentWrapperEl.off('mouseleave');
				leaveBound = false;
			}
			
			if(side === 'left')
			{
				openWrongChoice();
				
				event.choiceLeftClick(scene);

				leftChoiceEl.off('mouseenter');
				leftHoverBound = false;
			}

			if(side === 'right')
			{
				event.choiceRightClick(scene);
				
				doNotCancelMe = true;

				if(wrongChoiceShown)
				{	
					closeWrongChoice();
					onAfterRightClick();
				}
				else
				{
					onAfterRightClick();
				}
			}
		},

		onAfterRightClick = function ()
		{
			var videoInstance = getVideoPlayerInstance();
			
			videoPlayer = videoInstance.getPlayer();

			tween.to(leftBtnEl[0], speed, { left: '-1100px', opacity: 0, ease: ease });
			tween.to(rightBtnEl[0], speed, { right: '350px', opacity: 0, ease: ease });

			choiceVideoWrapperEl[0].style.opacity = 1;

			videoInstance.play();
			event.choiceResolutionPlay(scene, videoPlayer);
			
			leftCanvasInstance.shrinkMax();
			rightCanvasInstance.growMax(function ()
			{
				tween.killAll();
				choiceContentWrapperEl.fadeOut(speed * 1000);
			});

			$(videoPlayer).on('click', function (e)
			{
				if(videoPlayer.paused) videoPlayer.play(true);
				e.preventDefault();
			});

			// resolution video ended
			videoPlayer.addEventListener('ended', function ()
			{
				$('#poster').show();
				event.choiceResolutionEnd(scene, videoPlayer);
				if(scene === 1) ns.RouterInstance.startSceneOneThreeSixty();
				if(scene === 2) ns.RouterInstance.startSceneTwoThreeSixty();
				if(scene === 3) ns.RouterInstance.startSceneThreeThreeSixty();

			}, false);
		},

		getVideoPlayerInstance = function ()
		{
			return ns.Scanner.getWidgetBySelector(videoEl[0], 'VideoPlayer');
		},

		handleEnter = function (side)
		{
			if(doNotCancelMe) return false;
			
			if(side === 'left')
			{
				event.choiceLeftHover(scene);
				
				leftCanvasInstance.growHover();
				rightCanvasInstance.shrinkHover();
				
				if (!leftCanvasInstance.isSequensing()) {
					event.choiceLeftPlaySequence(scene);
				}

				leftCanvasInstance.playSequence();
				setBtnPos('left');
			}
			
			if(side === 'right')
			{
				event.choiceRightHover(scene);
				
				leftCanvasInstance.shrinkHover();
				rightCanvasInstance.growHover();
				
				if (!rightCanvasInstance.isSequensing()) {
					event.choiceRightPlaySequence(scene);
				}

				rightCanvasInstance.playSequence();
				setBtnPos('right');
				
				if(wrongChoiceShown)
				{
					tween.killTweensOf(badgeEl[0]);
					tween.to(badgeEl[0], speed, { left: '-80px', ease: ease });
					tween.to(sparkleEl[0], speed * 1.1, { left: '-80px', ease: ease });
					
					wrongChoiceEl.find('.do-fade').fadeOut(speed * 1000);
					wrongChoiceEl.find('.facebook').fadeOut(speed * 1000);
					wrongChoiceEl.find('.twitter').fadeOut(speed * 1000);

					rightChoiceEl.on('mouseleave', handleLeave);
				}
				
				if(!leaveBound)
				{
					choiceContentWrapperEl.on('mouseleave', handleLeave);
					leaveBound = true;
				}
			}
		},

		handleLeave = function ()
		{
			if(doNotCancelMe) return false;
			event.choiceMouseLeave(scene);
			
			if(wrongChoiceShown)
			{
				resetBtnPos('right');

				tween.to(badgeEl[0], speed, { left: '0', ease: ease });
				tween.to(sparkleEl[0], speed * 1.1, { left: '0', ease: ease });

				wrongChoiceEl.find('.do-fade').fadeIn(speed * 1000);
				wrongChoiceEl.find('.facebook').fadeIn(speed * 1000);
				wrongChoiceEl.find('.twitter').fadeIn(speed * 1000);

				rightChoiceEl.off('mouseleave');
			}
			else
			{
				resetBtnPos();
			}
	
			leftCanvasInstance.animateReset();
			rightCanvasInstance.animateReset();
		},

		setBtnPos = function (side)
		{
			if(side === 'left')
			{
				tween.killTweensOf(leftBtnEl[0]);
				tween.killTweensOf(rightBtnEl[0]);
				
				tween.to(leftBtnEl[0], speed, { left: '180px', ease: ease });
				tween.to(rightBtnEl[0], speed, { right: '50px', ease: ease });
			}

			if(side === 'right')
			{
				tween.killTweensOf(leftBtnEl[0]);
				tween.killTweensOf(rightBtnEl[0]);

				tween.to(leftBtnEl[0], speed, { left: '40px', ease: ease });
				tween.to(rightBtnEl[0], speed, { right: '180px', ease: ease });
			}
		},

		resetBtnPos = function (side)
		{
			if(side === 'right')
			{
				tween.killTweensOf(rightBtnEl[0]);
				tween.to(rightBtnEl[0], speed, { right: '112px', opacity: 1, ease: ease });
			}
			else if(side === 'left')
			{
				tween.killTweensOf(leftBtnEl[0]);
				tween.to(leftBtnEl[0], speed, { left: '128px', opacity: 1, ease: ease });
			}
			else
			{
				tween.killTweensOf(rightBtnEl[0]);
				tween.killTweensOf(leftBtnEl[0]);
				
				tween.to(leftBtnEl[0], speed, { left: '128px', opacity: 1, ease: ease });
				tween.to(rightBtnEl[0], speed, { right: '112px', opacity: 1, ease: ease });
			}
		},
		
		openWrongChoice = function ()
		{
			event.choiceShowWrongChoice(scene);
			
			wrongChoiceEl.show();

			tween.killTweensOf(leftBtnEl[0]);
			tween.killTweensOf(leftCanvas[0]);
			tween.to(leftBtnEl[0], speed, { left: '-1100px', opacity: '0', ease: ease });
			tween.to(leftCanvas[0], speed,
			{
				left: '-1100px', 
				ease: ease, 
				onComplete: function ()
				{
					leftChoiceEl.hide();
					setTimeout(swipeWrongChoiceElements, 2750);

					sparkleEl.delay(3000).fadeIn(500);
				}
			});
			
			leftCanvasInstance.animateReset();
			rightCanvasInstance.animateReset();
			resetBtnPos('right');
			
			wrongChoiceShown = true;
		},

		swipeWrongChoiceElements = function ()
		{
			tween.killTweensOf(wrongChoiceContentCopyEl[0]);
			tween.killTweensOf(wrongChoiceContentBadgeEl[0]);
			tween.to(wrongChoiceContentCopyEl[0], speed * 2, { left: '-500', ease: ease });
			tween.to(wrongChoiceContentBadgeEl[0], speed * 2, { left: '0', ease: ease });
		},

		handleShare = function (e)
		{
			e.preventDefault();

			event.choiceWrongChoiceShare(scene, this.className);
			ns.Share[this.className]($(this).data());
		},

		closeWrongChoice = function ()
		{
			event.choiceCloseWrongChoice(scene);
			tween.killTweensOf(badgeEl[0]);
			tween.to(badgeEl[0], speed, { left: '-1100', ease: ease });

			wrongChoiceShown = false;
		},

		getCanvasInstance = function (canvas)
		{
			return ns.Scanner.getWidgetBySelector(canvas, 'ChoiceCanvas');
		},

		destroy = function ()
		{
			leftChoiceEl.off('mouseenter');
			rightChoiceEl.off('mouseenter');
			leftChoiceEl.off('click');
			rightChoiceEl.off('click');
			$(videoPlayer).off('click');
			choiceContentWrapperEl.off('mouseleave');
			controller.cleanData('scene_' + scene + '_choice');
		};

		init();

		return { 
			controller: 'scenechoice',
			scene: scene,
			destroy: destroy,
			id: id
		};
	};

}(nsLibrary, nsObject, nsObject.Controller = nsObject.Controller || {}, Tween));