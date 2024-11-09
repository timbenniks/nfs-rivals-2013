/**
 * ChoiceCanvas
 * @param  {object} $	Library
 * @param  {object} ns	NameSpace
 */
/*global nsLibrary:false, nsObject:false*/
(function ($, ns)
{
	'use strict';

	/**
	 * ChoiceCanvas Constructor.
	 * @constructor
	 */
	ns.ChoiceCanvas = function (el, options)
	{
		var assetBase = options.assetBase,
			assetRoot = options.assetRoot,
			pos = options.pos,
			assets = ns.Controller.getData(assetBase)['assets'][assetRoot],
			frames = assets.length,
			canvas = el,
			context = canvas.getContext('2d'),
			pathPoints,
			offset = (options && options.offset) ? options.offset : 0,
			currentFrame = 0,
			sequenceData = { value: 0 },
			sequensing = false,
			ease = Expo.easeInOut,
			time = 0.5,

		init = function()
		{
			canvas.width = ns.width;
			canvas.height = ns.height;
			
			setInitialPathPoints();

			context.globalCompositeOperation = 'copy';
			showFrame(0);
		},

		setInitialPathPoints = function ()
		{
			if(pos === 'left')
			{
				pathPoints =
				{
					topLeftX: 86, topLeftY: 0,
					bottomLeftX: 0, bottomLeftY: ns.height,
					topRightX: 593, topRightY: 0,
					bottomRightX: 507, bottomRightY: ns.height,
					offset: offset
				};
			}
			else
			{
				pathPoints =
				{
					topLeftX: 593, topLeftY: 0,
					bottomLeftX: 507, bottomLeftY: ns.height,
					topRightX: ns.width, topRightY: 0,
					bottomRightX: ns.width - 86, bottomRightY: ns.height,
					offset: offset
				};
			}
		},

		playSequence = function ()
		{	
			if(sequensing) return;
			
			sequenceData.value = 0;
			
			sequensing = true;

			Tween.killTweensOf(sequenceData);
			Tween.to(sequenceData, frames / 30,
			{
				value: frames - 1,
				onUpdate: function()
				{
					currentFrame = ~~sequenceData.value;
					showFrame(currentFrame);
				},

				onComplete: function()
				{
					sequensing = false;
				}
			});
		},

		setSequencing = function (bool)
		{
			sequensing = bool;
		},

		isSequensing = function()
		{
			return sequensing;
		},

		reset = function ()
		{
			setInitialPathPoints();
			showFrame(0);
		},

		growMax = function (callback)
		{
			Tween.killTweensOf(pathPoints);
			if(pos === 'left')
			{
				Tween.to(pathPoints, time,
				{
					topRightX: 1100,
					bottomRightX: 1014,
					ease: ease,
					onUpdate: function()
					{
						showFrame(currentFrame);
					},

					onComplete: function ()
					{
						if(callback) callback();
					}
				});
			}
			else
			{
				Tween.to(pathPoints, time,
				{
					topLeftX: 86,
					bottomLeftX: 0,
					ease: ease,
					onUpdate: function()
					{
						showFrame(currentFrame);
					},

					onComplete: function ()
					{
						if(callback) callback();
					}
				});
			}
		},
		
		shrinkMax = function (callback)
		{
			Tween.killTweensOf(pathPoints);
			if(pos === 'left')
			{
				Tween.to(pathPoints, time,
				{
					topRightX: 86,
					bottomRightX: 0,
					ease: ease,
					onUpdate: function()
					{
						showFrame(currentFrame);
					},

					onComplete: function ()
					{
						if(callback) callback();
					}
				});
			}
			else
			{
				Tween.to(pathPoints, time,
				{
					topLeftX: 1100,
					bottomLeftX: 1014,
					ease: ease,
					onUpdate: function()
					{
						showFrame(currentFrame);
					},

					onComplete: function ()
					{
						if(callback) callback();
					}
				});
			}
		},

		growHover = function (callback)
		{
			Tween.killTweensOf(pathPoints);
			if(pos === 'left')
			{
				Tween.to(pathPoints, time,
				{
					topRightX: 747,
					bottomRightX: 661,
					ease: ease,
					onUpdate: function()
					{
						showFrame(currentFrame);
					},

					onComplete: function ()
					{
						if(callback) callback();
					}
				});
			}
			else
			{
				Tween.to(pathPoints, time,
				{
					topLeftX: 454,
					bottomLeftX: 368,
					ease: ease,
					onUpdate: function()
					{
						showFrame(currentFrame);
					},

					onComplete: function ()
					{
						if(callback) callback();
					}
				});
			}
		},
		
		shrinkHover = function (callback)
		{
			Tween.killTweensOf(pathPoints);
			if(pos === 'left')
			{
				Tween.to(pathPoints, time,
				{
					topRightX: 454,
					bottomRightX: 368,
					ease: ease,
					onUpdate: function()
					{
						showFrame(currentFrame);
					},

					onComplete: function ()
					{
						if(callback) callback();
					}
				});
			}
			else
			{
				Tween.to(pathPoints, time,
				{
					topLeftX: 747,
					bottomLeftX: 661,
					ease: ease,
					onUpdate: function()
					{
						showFrame(currentFrame);
					},

					onComplete: function ()
					{
						if(callback) callback();
					}
				});
			}
		},
		
		animateReset = function (callback)
		{
			Tween.killTweensOf(pathPoints);
			if(pos === 'left')
			{
				Tween.to(pathPoints, time,
				{
					topRightX: 593,
					bottomRightX: 507,
					ease: ease,
					onUpdate: function()
					{
						showFrame(currentFrame);
					},

					onComplete: function ()
					{
						if(callback) callback();
					}
				});
			}
			else
			{
				Tween.to(pathPoints, time,
				{
					topLeftX: 593,
					bottomLeftX: 507,
					ease: ease,
					onUpdate: function()
					{
						showFrame(currentFrame);
					},

					onComplete: function ()
					{
						if(callback) callback();
					}
				});
			}
		},

		showFrame = function (frame)
		{
			context.save();
			context.clearRect(0, 0, ns.width, ns.height);
			context.beginPath();
 			context.moveTo(pathPoints.topLeftX, pathPoints.topLeftY);
 			context.lineTo(pathPoints.topRightX, pathPoints.topRightY);
 			context.lineTo(pathPoints.bottomRightX, pathPoints.bottomRightY);
 			context.lineTo(pathPoints.bottomLeftX, pathPoints.bottomLeftY);
 			context.lineTo(pathPoints.topLeftX, pathPoints.topLeftY);
 			context.closePath();
 			context.clip();
			
			if(assets[frame] && assets[frame].tag)
			{
				context.drawImage(assets[frame].tag, 0, 0, ns.width, ns.height, parseInt(offset), 0, ns.width, ns.height);
			}
			
			context.restore();
		},

		destroy = function ()
		{
			return true;
		};

		init();

		return { 
			widget: 'ChoiceCanvas',
			playSequence: playSequence,
			growMax: growMax,
			shrinkMax: shrinkMax,
			growHover: growHover,
			shrinkHover: shrinkHover,
			animateReset: animateReset,
			reset: reset,
			showFrame: showFrame,
			sequensing: sequensing,
			isSequensing: isSequensing,
			setSequencing: setSequencing,
			destroy: destroy
		};
	};

}(nsLibrary, nsObject));