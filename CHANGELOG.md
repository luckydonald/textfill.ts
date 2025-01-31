# CHANGES

## Future

Wait for fonts to load and re-size. Only available on some browsers.
https://stackoverflow.com/questions/5680013/how-to-be-notified-once-a-web-font-has-loaded
  document.fonts.ready.then(function () {
    alert('All fonts in use by visible text have loaded.');
      alert('Roboto loaded? ' + document.fonts.check('1em Roboto'));  // true
  });

Update size when page resizes for responsiveness. 

## Development

## Version 1.0.3
* Fixed block element `innerTag`s from overflowing in strange ways. 
* Added option to automatically resize the element when the page resizes
* Added option to automatically correct (remove) an offset that appears when using large line-height that causes the inner tag to offset outside the div. (corrected by inserting a new div between parent and child with a calculated de-offset)
* Text resizing now respects line-height and letter-spacing settings. (by zhengs)

## Version 1.0.2
* Change maxFontPixels default to 0; unless otherwise specified, the font-size will fill the container.

## Version 1.0.0
* Remove JQuery Dependency

## Version jquery-0.6.2 (2018-02-24)
* Performance improvement
* Added option to truncate without failing

## Version jquery-0.6.1 (2018-02-23)

* Using the widthOnly option will apply a white-space:nowrap style so that the measured text won't wrap and therefore not have a proper width calculation. (by Klemens Ullman-Marx)
* Potential infinite loop prevented (by joel Anna)
* Code cleanups (by Klemens Ulman-Marx and GeekyMonkey)
* Distributable files are now in the /dist/ folder. Makefile updated.
* Remove deprecated "callback" callback
* Compatable with webpack module jquery reference
* add `allowOverflow` option (by lepolt)

## Version jquery-0.6.0 (2014-08-19T21:12:07Z)

* add `changeLineHeight` (functionality to resize line-height of parent)
* greatly improved code readability and comments

## Version jquery-0.5.0 (2014-07-17T15:37:15Z)

* made option `widthOnly` imply 'whitespace:nowrap'

## Version jquery-0.4.0 (2013-08-16T17:17:02Z)

* add tests for callbacks
* add `fail` callback (#15)
* deprecate `callback` callback with `success` callback
* fix `widthOnly` option (#11, #4)

Height will not cause failure when `widthOnly` is set as long as width can fit into the container.

## Version jquery-0.3.5 (2013-05-08T00:40:22Z)

* merge patch for compatibility to ZeptoJS (by sagens42 #13)

## Version jquery-0.3.4 (2013-04-10T03:55:51Z)

* fix error when no console.debug.
* add test for debug flag.

## Version jquery-0.3.3 (2013-03-25T23:35:21Z)

* retag for including the manefest in the tag.

## Version jquery-0.3.2 (2013-02-09T02:43:32Z)

* fix introduced global variable fontSize by `_sizing()`
* fix container too small for bigger font size setting (#11)

## Version jquery-0.3.1 (2013-01-27T05:10:51Z)

* Add `debug` option.
* Fix a couple of bugs, they didn't size up as big as possible

## Version jquery-0.3 (2013-01-04T16:27:52Z)

* Allow to use *MaxFontPixels <= 0* to make sizing as big as possible.

## Version jquery-0.2.1 (2012-11-11T07:04:20Z)

* Add explicitWidth and explicitHeight options (#6)

## Version jquery-0.2 (2012-07-02T17:13:27Z)

* Fix resizing algorithm (#3)
* Add option widthOnly for header tags (#4)

## Version jquery-0.1.3 (2012-03-27T04:03:30Z)

* Add callbacks for each filled and all filled. (by alex-pex #2)

## Version jquery-0.1.2 (2012-01-29T12:46:12Z)

* Use binary search instead of plain do-while to accelerate the function.
  (by acsaga #1)

## Version jquery-0.1.1

*  Add minFontPixels parameter

## 2012-01-16T16:56:32Z

*  This project was moved to GitHub and licensed under the MIT License.

## Version jquery-0.1.0

*  Released in May 2009.

