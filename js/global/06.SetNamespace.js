
// * @Method:		Namespace
// * @Description:	Creates a global namespace object
// * @Code style:	http://docs.jquery.com/JQuery_Core_Style_Guidelines
// * @Dependencies:	jQuery >= 1.7.x / Zepto >= 1.0.1
// * @Author:		Jorrit Salverda <jorrit.salverda@akqa.com>
//					Pim Hoogendoorn <pim.hoogendoorn@akqa.com>
// ---------------------------------------------------------------------- */

/*global window:false */
/*
*	Create a namespace
*	@param  {string} NameSpace
*/
function Namespace(identifier)
{
    var parts = identifier.split('.'),
        ns = window;

    for (var i = 0; i < parts.length; i++)
    {
		if (!ns[parts[i]])
        {
            ns[parts[i]] = {};
        }

        ns = ns[parts[i]];
    }

    return ns;
}

window.nsLibrary = window.jQuery; // Set the JS library that you want to use
window.nsString = 'NFSR'; // Set the namespace for your project
window.nsObject = Namespace(window.nsString);