/**
 * Detect
 * @param  {object} ns NameSpace
 */
/*global nsObject:false */
(function ($, ns)
{
	'use strict';

	ns.Detect =
	{
		has: function (sniff)
		{
			var result = false,
				html = $('html'),
				ua = navigator.userAgent.toLowerCase();

			// ie, ie6, ie7, ie8, ie9, touch
			result = html.hasClass(sniff);

			switch (sniff)
			{
				case 'ielt9': result = html.hasClass('ie') && (html.hasClass('ie6') || html.hasClass('ie7') || html.hasClass('ie8')); break;
				case 'android': result = (ua.match(/android/i)) ? true : false; break;
				case 'safari': 
				{
					// chrome uses both safari and chrome.
					return ua.match(/safari/i) && !ua.match(/chrome/i);
				}
				case 'ios': result = (ua.match(/ipad/i) || ua.match(/ipod/i) || ua.match(/iphone/i)) ? true : false; break;
				case 'ff': result = ua.match(/firefox/i) ? true : false; break;
				case 'fflt20':
				{
					var version = ua.match(/firefox/i) ? ua.match(/firefox\/(.*)$/)[1] : -1;
					return ~~version > -1 && ~~version < 21;
				}
			}

			return result;
		}
	};

}(nsLibrary, nsObject));
