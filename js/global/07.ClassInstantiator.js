/**
 * ClassInstantiator
 * @param  {object} ns	NameSpace
 * @dependencies JSON
 */
/*global nsLibrary:false, nsObject:false */
(function ($, ns)
{
	'use strict';

	/**
	 * ClassInstantiator Constructor.
	 * @param {String} dataAttr The data-attribute to scan for. Defaults to 'widget'.
	 * @constructor
	 */
	ns.ClassInstantiator = function (dataAttr)
	{
		var dataAttributeToScanFor = dataAttr || 'widget',
			widgetDictionary = [],
			widgetDictionaryLength = 0,

		/**
		 * Scan for elements that contain data-widget and instantiate the widget that is associated to the element.
		 * @param {HTMLElement} context The context in which to search for DOM nodes.
		 */
		scan = function (context)
		{
			context = context || document.body;

			var widgets = findWidgets(context),
			i = 0;

			if(widgets)
			{
				for(; i < widgets.length; i++)
				{
					instantiate(widgets[i].widget, widgets[i].widgetToInstantiate);
				}
			}
		},

		/**
		 * Find elements that contain data-widget and add the element and the widget to the widgets array.
		 * Multiple widgets can be added to a DOM node. Seperate them by a ';'.
		 * @param {HTMLElement} context The context in which to search for DOM nodes.
		 * @return {array} returns an array with the widget DOM node and the widget name.
		 */
		findWidgets = function (context)
		{
			context = context || document.body;

			var widgetsFound = getNode(context, '[data-' + dataAttributeToScanFor + ']'),
				i = 0, c,
				widgets = [];

			for (; i < widgetsFound.length; i++)
			{
				var widget = widgetsFound[i],
					widgetToInstantiate = getDataAttr(widget, dataAttributeToScanFor).split(';');

				for (c = 0; c < widgetToInstantiate.length; c++)
				{
					widgets.push({'widget': widget, 'widgetToInstantiate': widgetToInstantiate[c]});
				}
			}

			return widgets;
		},

		/**
		 * Instantiate a widget.
		 * @param {HTMLELement} node The DOM node from which to instantiate the widget.
		 * @param {string} widgetName The name of the widget to Instantiate.
		 * @return {instance} The instantiated widget.
		 */
		instantiate = function (node, widgetName)
		{
			var InstanceName = cleanUpInstanceName(widgetName),
				options, instance;

			if (!widgetName || typeof InstanceName !== 'function')
			{
				return false;
			}

			/**
			 * When multiple widgets are applied to a single DOM node, use data-<widgetName>-options attributes
			 * to give the widgets their own option objects.
			 */
			options = getDataAttr(node, widgetName.toLowerCase() + 'Options') || getDataAttr(node, 'options') || {};

			if (typeof options === 'string')
			{
				options = JSON.parse(options);
			}

			instance = new InstanceName(node, options);

			if(!getWidgetFromDict(node, widgetName))
			{
				setWidgetInDict(node, widgetName, instance);
			}

			return instance;
		},

		/**
		 * Convert from string to function.
		 * @param {string} widgetName The name of the widget.
		 * @return {function} Return the function the string translates to.
		 */
		cleanUpInstanceName = function (widgetName)
		{
			var parts = widgetName.split('.');

			if (!parts.length)
			{
				throw ('Cannot split ' + widgetName + '  into a parts');
			}

			switch (parts.length)
			{
				case 1: return ns[parts[0]];
				case 2: return ns[parts[0]][parts[1]];
				case 3: return ns[parts[0]][parts[1]][parts[2]];
				case 4: return ns[parts[0]][parts[1]][parts[2]][parts[3]];
				default: throw ('Cannot find [' + widgetName + '] as a function in your namespace.');
			}
		},

		/**
		 * Get the widget instance for a DOM node.
		 * @param {HTMLElement} node DOM on which the widget lives.
		 * @param {string} widgetName Name of the widget you are looking for.
		 * @return {instance} The instance of the widgetName.
		 */
		getWidgetBySelector = function (node, widgetName)
		{
			return getWidgetFromDict(node, widgetName);
		},

		/**
		 * Get widgets in the context of a DOM node.
		 * @param {HTMLElement} context The context in which to search for DOM nodes.
		 * @param {string} widgetName Name of the widget you are looking for.
		 * @return {instance} The instance of the widgetName.
		 */
		getWidgetsInContext = function (context, widgetName)
		{
			var widgets = [], widgetsFound, i = 0, c = 0;

			context = context || document.body;

			widgetsFound = getNode(context, '[data-' + dataAttributeToScanFor + ']');

			for (; i < widgetsFound.length; i++)
			{
				var widget = widgetsFound[i],
					widgetToReturn = getDataAttr(widget, dataAttributeToScanFor).split(';');

				for (; c < widgetToReturn.length; c++)
				{
					if(widgetName && widgetName === widgetToReturn[c])
					{
						widgets.push(getWidgetBySelector(widget, widgetToReturn[c]));
						break;
					}
					else
					{
						widgets.push(getWidgetBySelector(widget, widgetToReturn[c]));
					}
				}
			}

			return widgets;
		},

		/**
		 * Destroy the widget instance by calling the destroy function and by
		 * removing the data form the DOM node.
		 * @param {HTMLElement} selector The DOM node of the widget.
		 * @param {string} widgetName The widget you want to destroy.
		 */
		destroyWidgetBySelector = function (node, widgetName)
		{
			var widgetInstance = getWidgetBySelector(node, widgetName);

			if (widgetInstance)
			{
				if (typeof widgetInstance.destroy === 'function')
				{
					widgetInstance.destroy();
				}

				removeWidgetFromDict(node, widgetName);
			}
		},

		/**
		 * Destroy widgets in context.
		 * @param {HTMLElement} context The context in which to search for DOM nodes.
		 * @param {string} widgetName The widget you want to destroy.
		 */
		destroyWidgetsInContext = function (context, widgetName)
		{
			var widgetsFound;

			context = context || document.body;

			if (widgetName)
			{
				widgetsFound = getNode(context, '[data-' + dataAttributeToScanFor + '="' + widgetName + '"]');
			}
			else
			{
				widgetsFound = getNode(context, '[data-' + dataAttributeToScanFor + ']');
			}

			for (var i = 0; i < widgetsFound.length; i++)
			{
				var widget = widgetsFound[i],
					widgetToDestroy = getDataAttr(widget, dataAttributeToScanFor).split(';');

				for (var c = 0; c < widgetToDestroy.length; c++)
				{
					destroyWidgetBySelector(widget, widgetToDestroy[c]);
				}
			}
		},

		/**
		 * Internal function that returns the value of a data attribute.
		 * Uses jQuery or Zepto if defined, otherwise resorts to dataset or getAttribute().
		 * @param {HTMLElement} node The DOM node on which to find the data attribute.
		 * @param {string} attr The name of the data attribute to find the value of.
		 * @return {string / object} The value of the data attribute.
		 */
		getDataAttr = function (node, attr)
		{
			if ($ && typeof $ === 'function')
			{
				return $(node).data(attr);
			}
			else
			{
				if (node.dataset !== undefined && node.dataset !== null)
				{
					return node.dataset[attr];
				}
				else
				{
					return node.getAttribute('data-' + attr);
				}
			}
		},

		/**
		 * Returns a node. Uses jQuery or Zepto, otherwise resorts to querySelectorAll().
		 * @param  {HTMLElement} context The context in which to search for DOM nodes.
		 * @param  {string} selector DOM node to find in context.
		 * @return {object} Selected DOM node.
		 */
		getNode = function (context, node)
		{
			context = context || document.body;

			if ($ && typeof $ === 'function')
			{
				return $(context).find(node);
			}
			else
			{
				return context.querySelectorAll(node);
			}
		},

		/**
		 * Returns an instance from the widgetDictionary
		 * @param  {HTMLElement} node dictionary index.
		 * @param  {String} widgetName The name of the widget of which you want to get the instance.
		 * @return {object} Returns widget instance
		 */
		getWidgetFromDict = function(node, widgetName)
		{
			for (var i = 0; i < widgetDictionaryLength; i++)
			{
				if (widgetDictionary[i].node === node && widgetDictionary[i].widgetName === widgetName)
				{
					return widgetDictionary[i].instance;
				}
			}
			return false;
		},

		/**
		 * Sets and instance in the widgetDictionary with the node as index.
		 * @param  {HTMLElement} node dictionary index.
		 * @param  {String} widgetName The name of the widget. duhh:)
		 * @param  {object} instance the instance of the widget.
		 */
		setWidgetInDict = function(node, widgetName, instance)
		{
			for (var i = 0; i < widgetDictionaryLength; i++)
			{
				if (widgetDictionary[i].node === node && widgetDictionary[i].widgetName === widgetName)
				{
					widgetDictionary[i].instance = instance;
					return;
				}
			}

			widgetDictionary[widgetDictionaryLength++] = { node: node, widgetName: widgetName, instance: instance };
		},

		/**
		 * Remove a widget instance from the widgetDictionary
		 * @param  {HTMLElement} node dictionary index.
		 * @param  {String} widgetName The name of the widget. duhh:)
		 */
		removeWidgetFromDict = function(node, widgetName)
		{
			for (var i = 0; i < widgetDictionaryLength; i++)
			{
				if (widgetDictionary[i].node === node && widgetDictionary[i].widgetName === widgetName)
				{
					widgetDictionary[i] = null;
					widgetDictionary.splice(i, 1);
					widgetDictionaryLength--;
					return;
				}
			}
		};

		return {
			scan: scan,
			findWidgets: findWidgets,
			instantiate: instantiate,
			getWidgetBySelector: getWidgetBySelector,
			getWidgetsInContext: getWidgetsInContext,
			destroyWidgetsInContext: destroyWidgetsInContext,
			destroyWidgetBySelector: destroyWidgetBySelector,
			cleanUpInstanceName: cleanUpInstanceName,
			getDataAttr: getDataAttr,
			getNode: getNode,
			getWidgetFromDict: getWidgetFromDict,
			setWidgetInDict: setWidgetInDict,
			removeWidgetFromDict: removeWidgetFromDict,
			widgetDictionary: widgetDictionary
		};
	};

}(nsLibrary, nsObject));