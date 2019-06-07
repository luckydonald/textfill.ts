# textfill.js

A JavaScript library to resize text to make it fit into a container. The font size
gets as big as possible (or within limits that you set). Adapted from https://github.com/jquery-textfill/jquery-textfill to remove the jquery dependency.

* [Homepage (for the project this was forked from)][index].
* [Simple example (for the project this was forked from)][demo].
* [Unit tests (for the project this was forked from)][tests].

![logo](http://jquery-textfill.github.io/images/logo.png)

## Quick Start Guide

### NPM

Install the package:

```
npm install --save textfilljs
```
Create your elements. Make sure to:
  - Put the text inside of a `<span>` child by default (see _innerTag_ in _Options_ to change this)

```html
<div id='my-element' style='width:100px;height:50px;'>
  <span>The quick brown fox jumps over the lazy dog</span>
</div>
```

Import and run the TextFill function:

```javascript
import TextFill from 'textfilljs';

TextFill("#myelement",{
  ...options...
});
```

### Elsewhere

Get the [latest release](https://github.com/Jetroid/textfill.js/releases) or [download the raw script direct from GitHub](https://raw.githubusercontent.com/Jetroid/textfill.js/master/dist/textfill.min.js):

Include _textfill.min.js_:

```html
<script src="textfill.min.js"></script>
```

Create your elements. Make sure to:
  - Put the text inside of a `<span>` child by default (see _innerTag_ in _Options_ to change this)

```html
<div id='my-element' style='width:100px;height:50px;'>
  <span>The quick brown fox jumps over the lazy dog</span>
</div>
```

Run the TextFill function:

```html
<script>
  TextFill("#myelement",{
    ...options...
  });
</script>
```

## Options

Remember, **container** means the _parent_ element, while **child** is the
element that will _resize_. In the examples above (in the _Quick Start Guide_),
the parent was the `div` and the child was the `span`.

**Note: Unlike [the jQuery plugin][plugin] that this project is based on, the `maxFontPixels` default is now `0`.**

| Name              | Description | Default Value |
| ----------------- | ----------- | ------------- |
| `minFontPixels`   | Minimal font size (in pixels). The text will shrink down to this value. | `4` |
| `maxFontPixels`   | Maximum font size (in pixels). The text will stretch up to this value.. If it's a negative value (`size <= 0`), the text will stretch to as big as the container can accommodate. | `0` |
| `innerTag`        | The selector for the direct child element tag to resize. We select it by using the `container > innerTag` selector. | `span` |
| `widthOnly`       | Will only resize to the width restraint, keeping the text all on one line. The font might become tiny when using a small container.  | `false` |
| `explicitWidth`   | Explicit width to resize. Defaults to the container's width. | `null` |
| `explicitHeight`  | Explicit height to resize. Defaults to the container's height. | `null` |
| `changeLineHeight`| Also change the `line-height` of the parent container. This might be useful when shrinking to a small container. | `false` |
| `correctLineHeightOffset` | When set to true, this removes vertical offset that appears when using TextFill with large line heights (and causes the text to overflow the element). This is done by inserting a div between the container and the child. | `true` |
| `allowOverflow`   | To be used with `minFontPixels`. Allows text to overflow when minFontPixels is reached, rather than failing to resize. Note that the `fail` callback will not be executed with `allowOverflow` set to `true`. | `false` |
| `autoResize`      | When the page resizes, re-run TextFill (with the same options) on the elements resized by the current call. Note: Does not rerun the selector you use, it only targets elements that were already resized by TextFill. Eg if your selector is `.elements` and that matches 3 elements on the original TextFill call, and a fourth `.elements` is added to the page sometime before the resize, that fourth element will not be TextFilled. | `false` |
| `debug`           | Output debugging messages to console. | `false` |

For example,

```javascript
TextFill("#myelement",{
  maxFontPixels: 36
});
```

## Callbacks


| Name       | Called when...                       | Default Value |
| ---------- | ------------------------------------ | ------------- |
| `success`  | Called when a resizing is successful | `null`        |
| `fail`     | Called when a resizing is failed     | `null`        |
| `complete` | Called when all elements are done    | `null`        |

For example,

```javascript
TextFill("#myelement",{
  success: function() {
    console.log("yay!");
  },
  fail: function() {
    alert("boo hoo!");
	}
});
```

## Contributing

You are very welcome to contribute!
Changes are welcome, no matter how small the changes might be.

Just _make sure_ to read the file [`CONTRIBUTING.md`](CONTRIBUTING.md) first.

Want to help but not sure how? We have some ideas for _Future_ features in [`CHANGELOG.md`](CHANGELOG.md).

If you found something critical or just want to make a suggestion or ask a question, [open an issue][issue] and start typing right away. It might be valuable to check the [issues of the project that this one is based on.](https://github.com/jquery-textfill/jquery-textfill/issues)

## Credits

[JQuery-Textfill] The [jQuery plugin][plugin] was created by [Russ Painter][russ] around May 2009,
beginning with a StackOverflow [question][soq].

[JQuery-Textfill] In very early 2012, [Yu-Jie Lin][yu] helped to move the project to GitHub with
version _0.1_ and obtained the clearly stated open source licensing from Russ.

[JQuery-Textfill] Around July 2014, [Alexandre Dantas][alex] was made a contributor.

[TextFill.js] In June 2019, [Jet Holt][jet] forked the jQuery plugin to remove the jQuery dependency

## License

`textfill.js` is licensed under the _MIT License_. See file
[`LICENSE.md`](LICENSE.md) to see what you can and cannot do with the source.

[index]:  http://jquery-textfill.github.io/
[demo]:   http://jquery-textfill.github.io/example/
[tests]:  http://jquery-textfill.github.io/unit-tests
[issue]:  https://github.com/jquery-textfill/jquery-textfill/issues
[plugin]: https://github.com/jquery-textfill/jquery-textfill/
[soq]:    http://stackoverflow.com/questions/687998/auto-size-dynamic-text-to-fill-fixed-size-container
[russ]:   https://github.com/GeekyMonkey
[yu]:     https://github.com/livibetter
[alex]:   https://github.com/alexdantas
[jet]:    https://github.com/Jetroid

