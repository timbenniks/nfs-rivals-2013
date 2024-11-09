
//	@Description:
//	The workflow for CSS is according to the SMACSS principle.
//	This readme.txt explains how to structure your code according 
//	to the SMACSS principle. For more info: http://smacss.com/
// ---------------------------------------------------------------------- */

In the Tools directory you can find a _settings.scss file. 
In this file are variables defined which you could use in your project. 
You can simply add your own variables, mixins and functions to this file.

----
:: What's SMACSS?
----

SHORT SUMMARY
-------------

SMACSS (pronounced "smacks" and stands for Scalable and Modular Architecture) 
is more style guide than rigid framework. It's not a library you can download or install. 
SMACSS is a way to examine your design process and as a way to fit those rigid frameworks 
into a flexible thought process. It is an attempt to document a consistent approach to 
site development when using CSS.

There are a couple of rules to follow which I will explain now.

The files in the Blueprint are structured like this:
- BASE.SCSS:		In this file we define just HTML elements. That means no .classes, no #id's.
- LAYOUT.SCSS:		In this file we define .classes and #id's used through the project. (#header, #footer, #container, .column)
- COMPONENT.SCSS:	Where 'component' is your components name. Something like 'navigation.scss'. 
					In this components file we define styles for this particular component. Group them by base-styles, layout-styles and state-styles.
					State is something like is-hidden, is-visible, is-success. Adding these state classes makes your HTML more readable.

Rules:
It's better to use .classes than to target element selectors like div, p or span.
Because classes have semantic value.
For example:

This: 
<div class="folder">
	<span class="folder-name">Folder Name</span>
	<span class="folder-items">(32 items)</span>
</div>

makes more sense than:
<div class="folder">
	<span>Folder Name</span>
	<span>(32 items)</span>
</div>

State overrides ALL other styles. State styles can apply to layout and/or component styles.
State styles often indicate a Javascript dependency.
And because state-styles need to override all other styles, .classname { attribute!important;} is allowed when using SMACSS.

********* REWRITE THIS ***************
If you add state classes to parent elements of modules, the modules always need to be wrapped.
And you can't split them. So it's better not to use parent classes to often.

File structure example:

- Base
  - 00.normalize.css
- Layout
  - L-00.header.css
- Component
  - C-00.navigation.css
- State
  - S-00.navigation-is-collapsed.css

:: CSS PROPERTIES ::

- Box & Positioning (display, width, height, margin, padding, position, left, right, top, bottom, z-index)
- Border (border, border-image, border-radius)
- Background (background, background-image, gradients)
- Text (font-family, font-size, text-transform, letter-spacing)
- Other (everything else)

:: COLOR DECLARATIONS 
- Use #hex colors and rgba() there where needed. 
  rgb() is not prefered because you'll have to use more than twice as many characters:
  #000 vs. rgb(0,0,0)

********* REWRITE THIS ***************

-----
:: What's Bourbon?
-----

Bourbon is a simple and lightweight mixin library for Sass.
There are handy mixins predefined in this library to make your SASS life better.

Documentation: http://thoughtbot.com/bourbon/
