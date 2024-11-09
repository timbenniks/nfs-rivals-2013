/**
 * AssetPreloader
 * @param  {object} ns NameSpace
 */
/*global nsLibrary:false, nsObject:false, PxLoader:false, PxLoaderImage:false */
(function (ns)
{
	'use strict';

	/**
	 * AssetPreloader Constructor.
	 * @constructor
	 */
	ns.AssetPreloader = function ()
	{
		var load = function(options)
		{
			var media = options.media,
				handle = 'NFS',
				onStart = options.onStart,
				onProgress = options.onProgress,
				onComplete = options.onComplete,
				loader = new PxLoader(),
				i, thing, ext;

			for(i = 0; i < media.length; i++)
			{
				ext = getExt(media[i]);

				var cacheBustedUrl = getCacheBustedUrl(media[i]);

				thing = new PxLoaderImage(cacheBustedUrl, handle);
				thing.handle = handle;
				thing.index = i;
				thing.type = 'image';
				thing.ext = ext;

				loader.add(thing);
			}

			if(onStart && typeof onStart === 'function') onStart({ resource: { handle: handle } });
			if(onProgress && typeof onProgress === 'function') loader.addProgressListener(onProgress, handle);
			if(onComplete && typeof onComplete === 'function') loader.addCompletionListener(onComplete, handle);

			loader.start([handle]);
		},

		getCacheBustedUrl = function (url)
		{
			return url + '?v=' + ns.ReleaseVersionNumber;
		},

		getExt = function(filename)
		{
			return stripQueryParameters(filename).split('.').pop();
		},

		getType = function(filename)
		{
			var video = ['mp4', 'webm'],
				image = ['jpg', 'png'],
				ext = stripQueryParameters(filename).split('.').pop();

			if($.inArray(ext, image) !== -1) return 'image';
			if($.inArray(ext, video) !== -1) return 'video';

			return false;
		},

		stripQueryParameters = function(filename)
		{
			return filename.split('?')[0];
		};

		return {
			load: load,
			getType: getType,
			getExt: getExt,
			getCacheBustedUrl: getCacheBustedUrl
		};
	};

}(nsObject));