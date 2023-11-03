/*
Adapted from Jetroid/textfill.js v1.0.3a, Jun 2019
Adapted from jquery-textfill/jquery-textfill, v0.6.2, Feb 2018

Usage:
TextFill(".some-selector",{
	minFontPixels: {Number}, {4}
	maxFontPixels: {Number}, {0}
	innerTag: {Selector}, {span}
	widthOnly: {Boolean}, {false}
	explicitWidth: {Number}, {null}
	explicitHeight: {Number}, {null}
	changeLineHeight: {Boolean}, {false}
	allowOverflow: {Boolean}, {false}
	debug: {Boolean}, {false}
});

Options:

minFontPixels:              Minimal font size (in pixels). The text will shrink up to this value.
maxFontPixels:              Maximum font size (in pixels). The text will stretch up to this value.. If it's a negative value (size <= 0), the text will stretch to as big as the container can accommodate.
innerTag:                   The child element tag to resize. We select it by using container.querySelector(innerTag)
widthOnly:                  Will only resize to the width restraint. The font might become tiny under small containers.
explicitWidth:              Explicit width to resize. Defaults to the container's width.
explicitHeight:             Explicit height to resize. Defaults to the container's height.
changeLineHeight:           Also change the line-height of the parent container. This might be useful when shrinking to a small container.
allowOverflow:              Allows text to overflow when minFontPixels is reached. Won't fail resizing, but instead will overflow container.
correctLineHeightOffset:    When set to true, this removes vertical offset that appears when using TextFill with large line heights.
autoResize:                 When the page resizes, re-run TextFill (with the same options) on the elements resized by the current call.
debug:                      Output debugging messages to console.


Original Projects:
- https://github.com/jquery-textfill/jquery-textfill
- https://github.com/Jetroid/textfill.js

luckydonald - 2023

Copyright (C) 2023 luckydonald
Copyright (C) 2019 Jet Holt
Copyright (C) 2009-2018 Russ Painter (GeekyMonkey)
Copyright (C) 2012-2013 Yu-Jie Lin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
export type ResizingCallback = (parent: Element) => void;
export type CompleteCallback = () => void;
export type Options = {
  debug: boolean;
  maxFontPixels: number;
  minFontPixels: number;
  innerTag: string;
  widthOnly: boolean;
  success: null | ResizingCallback; // callback when a resizing is done
  fail: null | ResizingCallback; // callback when a resizing is failed
  complete: null | CompleteCallback; // callback when all is done
  explicitWidth: null | number;
  explicitHeight: null | number;
  changeLineHeight: boolean;
  correctLineHeightOffset: boolean;
  allowOverflow: boolean; // If true, text will stay at minFontPixels but overflow container w/out failing
  autoResize: boolean; // If true, text will resize again when the page does
};

// Output arguments to the Warning console
function _warn(...args: any[]): void {
  if (typeof console == "undefined" || typeof console.warn == "undefined") {
    return;
  }
  console.warn(...args);
}

export const TextFill = function (
  selector: string | Element,
  incomingOptions: Options | undefined | null
): void {
  const incomingOptionsCopy: Options | {} = incomingOptions || {};

    //  _____  _______ _______ _____  _____  __   _ _______
    // |     | |_____|    |      |   |     | | \  | |______
    // |_____| |          |    __|__ |_____| |  \_| ______|

    const options: Options = {
      debug: false,
      maxFontPixels: 0,
      minFontPixels: 4,
      innerTag: "span",
      widthOnly: false,
      success: null, // callback when a resizing is done
      fail: null, // callback when a resizing is failed
      complete: null, // callback when all is done
      explicitWidth: null,
      explicitHeight: null,
      changeLineHeight: false,
      correctLineHeightOffset: true,
      allowOverflow: false, // If true, text will stay at minFontPixels but overflow container w/out failing
      autoResize: false, // If true, text will resize again when the page does
    };

    // Merge provided options and default options
    let opt: keyof Options;
    for (opt in options) {
      if (Object.hasOwn(incomingOptionsCopy, opt)) {
        // @ts-ignore
        options[opt] = incomingOptionsCopy[opt];
      }
    }

    // _______ _     _ __   _ _______ _______ _____  _____  __   _ _______
    // |______ |     | | \  | |          |      |   |     | | \  | |______
    // |       |_____| |  \_| |_____     |    __|__ |_____| |  \_| ______|
    //
    // Predefining the awesomeness

    // Output arguments to the Debug console
    // if "Debug Mode" is enabled
    function _debug(...args: any[]): void {
      if (
        !options.debug ||
        typeof console == "undefined" ||
        typeof console.debug == "undefined"
      ) {
        return;
      }
      console.debug(...args);
    }

    // Output arguments to the Warning console
    function _warn(...args: any[]): void {
      if (typeof console == "undefined" || typeof console.warn == "undefined") {
        return;
      }
      console.warn(...args);
    }

    // Outputs all information on the current sizing
    // of the font.
    // For arguments, see _sizing(), below
    function _debug_sizing(
      prefix: string,
      ourText: HTMLElement,
      maxHeight: number,
      maxWidth: number,
      minFontPixels: number,
      maxFontPixels: number,
      fontSize: string | number,
      lineHeight: number
      // letterSpacing: number
    ) {
      function _m(v1: number, v2: number): string {
        let marker = " / ";

        if (v1 > v2) {
          marker = " > ";
        } else if (v1 == v2) {
          marker = " = ";
        }
        return marker;
      }
      if (options.debug) {
        _debug(
          `[TextFill] ${prefix} { font-size: ${fontSize}, Height: ${
            ourText.offsetHeight
          }px ${_m(ourText.offsetHeight, maxHeight)}${maxHeight}px, Width: ${
            ourText.offsetWidth
          }${_m(
            ourText.offsetWidth,
            maxWidth
          )}${maxWidth}, minFontPixels: ${minFontPixels}px, maxFontPixels: ${maxFontPixels}px, }`
        );
      }
    }

    /**
     * Calculates which size the font can get resized,
     * according to constrains.
     *
     * @param prefix Gets shown on the console before all the arguments, if debug mode is on.
     * @param ourText The DOM element to resize that contains the text.
     * @param measurement Property called on `ourText` that's used to compare with `max`.
     * @param max Maximum value, that gets compared with `measurement` called on `ourText`.
     * @param maxHeight Maximum width, either via setting's `explicitWidth` or the container's width.
     * @param maxWidth Maximum height, either via setting's `explicitHeight` or the container's height.
     * @param minFontPixels Minimum value the font can get resized to (in pixels).
     * @param maxFontPixels Maximum value the font can get resized to (in pixels).
     * @param oldFontSize Previously set font size (best via `getComputedProperty`)
     * @param calculatedLineHeight ratio of the line height to the font size (`lineHeight / fontSize`)
     * @param calculatedLetterSpacing ratio of the letter spacing to the font size (`letterSpacing / fontSize`)
     *
     * @return {number} The size (in pixels) that the font can be resized.
     */
    function _sizing(
      prefix: string,
      ourText: HTMLElement,
      measurement: "offsetWidth" | "offsetHeight",
      max: number,
      maxHeight: number,
      maxWidth: number,
      minFontPixels: number,
      maxFontPixels: number,
      oldFontSize: string,
      calculatedLineHeight: number,
      calculatedLetterSpacing: number
    ): number {
      _debug_sizing(
        prefix,
        ourText,
        maxHeight,
        maxWidth,
        minFontPixels,
        maxFontPixels,
        oldFontSize,
        calculatedLineHeight
      );

      // The kernel of the whole plugin, take most attention
      // on this part.
      //
      // This is a loop that keeps increasing the `font-size`
      // until it fits the parent element.
      //
      // - Start from the minimal allowed value (`minFontPixels`)
      // - Guesses an average font size (in pixels) for the font,
      // - Resizes the text and sees if its size is within the
      //   boundaries (`minFontPixels` and `maxFontPixels`).
      //   - If so, keep guessing until we break.
      //   - If not, return the last calculated size.
      //
      // I understand this is not optimized and we should
      // consider implementing something akin to
      // Daniel Hoffmann's answer here:
      //
      //     http://stackoverflow.com/a/17433451/1094964
      //

      ourText.style.letterSpacing = calculatedLetterSpacing.toString();
      ourText.style.lineHeight = calculatedLineHeight.toString();

      // Need the text element to be inline, or it ignores the parent width
      // we reset this later.
      ourText.style.display = "inline";

      while (minFontPixels < Math.floor(maxFontPixels) - 1) {
        const fontSize = Math.floor((minFontPixels + maxFontPixels) / 2);
        ourText.style.fontSize = fontSize + "px";

        const curSize = ourText[measurement];

        if (curSize <= max) {
          minFontPixels = fontSize;

          if (curSize == max) {
            break;
          }
        } else {
          maxFontPixels = fontSize;
        }

        _debug_sizing(
          prefix,
          ourText,
          maxHeight,
          maxWidth,
          minFontPixels,
          maxFontPixels,
          fontSize,
          calculatedLineHeight
        );
      }

      ourText.style.fontSize = maxFontPixels + "px";

      if (ourText[measurement] <= max) {
        minFontPixels = maxFontPixels;

        _debug_sizing(
          prefix + "* ",
          ourText,
          maxHeight,
          maxWidth,
          minFontPixels,
          maxFontPixels,
          `${maxFontPixels} px`,
          calculatedLineHeight
        );
      }
      return minFontPixels;
    }

    function deleteCLHOdiv(parent: HTMLElement): void {
      // If we've previously called TextFill on parent with
      // correctLineHeightOffset turned on, there will be a div between
      // the innerTag we want and the parent.
      // So first, let's delete that div if we find it.
      const unwantedDiv = parent.getElementsByClassName("textfill-clho")[0];
      if (unwantedDiv != null) {
        while (unwantedDiv.firstChild) {
          parent.insertBefore(unwantedDiv.firstChild, unwantedDiv);
        }
        parent.removeChild(unwantedDiv);
      }
    }

    // _______ _______ _______  ______ _______
    // |______    |    |_____| |_____/    |
    // ______|    |    |     | |    \_    |
    //

    _debug("[TextFill] Start Debug");

    let elements: HTMLElement[];
    if (typeof selector === "string") {
      _debug(
        "[TextFill] First Parameter was a string; applying querySelectorAll."
      );
      const selectedNodes = document.querySelectorAll(selector);
      elements = [];
      for (let i = 0; i < selectedNodes.length; i++) {
        const selectedNode = selectedNodes.item(i);
        if (selectedNode instanceof HTMLElement) {
          elements.push(selectedNode);
        } else {
          _warn(
            "[TextFill] Selected Element is not a HTMLElement, just an Element.",
            selectedNode
          );
          throw "[TextFill] Selected Element is not a HTMLElement, just an Element.";
        }
      }
    } else if (selector instanceof HTMLElement) {
      _debug("[TextFill] First Parameter was a DOM element");
      // Support for DOM nodes
      elements = [selector];
      // } else if (selector.length) {
      //   _debug(
      //     "[TextFill] First Parameter had the length property; probably jQuery."
      //   );
      //   // Support for array based queries (such as jQuery)
      //   elements = selector;
    } else {
      _warn(
        "[TextFill] Selector seems invalid. Neither string nor HTMLElement.",
        selector,
      );
      throw "[TextFill] Selector seems invalid. Neither string nor HTMLElement.";
    }
    for (let i = 0; i < elements.length; i++) {
      const parent: HTMLElement = elements[i];
      _debug("[TextFill] Parent Element: ", parent);

      // If autoresize, we want to store our options as a data attribute on the parent
      if (options.autoResize) {
        parent.setAttribute(
          "data-textfill-resize-options",
          JSON.stringify(incomingOptionsCopy)
        );
      } else {
        parent.removeAttribute("data-textfill-resize-options");
      }

      // The Correct Line Height Overflow div causes problems for the ourText selection
      // It might have been added on a previous run of TextFill
      // so let's remove it
      deleteCLHOdiv(parent);

      // Find a child that matches `innerTag` that is a direct descendent of the parent
      // Sadly there is no selector for this (:scope not implemented by all browsers)
      // So we will temporarily set an id, making sure to backup and restore any existing ID
      const parentId = parent.id;
      parent.id = "textfill-parent-id";
      const ourText: HTMLElement | null = parent.querySelector(
        "#textfill-parent-id > " + options.innerTag
      );
      parent.id = parentId;

      // Want to make sure our text is visible
      if (ourText === null) {
        if (options.fail) options.fail(parent);

        _warn(
          "[TextFill] Failure: Element has no direct children matching the `" +
            options.innerTag +
            "` selector.\n",
          parent
        );

        continue;
      }

      const ourTextComputedStyle: CSSStyleDeclaration =
        window.getComputedStyle(ourText);

      _debug("[TextFill] Inner text: " + ourText.textContent);
      _debug("[TextFill] All options: ", options);

      // Want to make sure our text is visible
      // if (ourTextComputedStyle === "none") {
      //   if (options.fail) options.fail(parent);
      //
      //   _debug("[TextFill] Failure: Inner element not visible.");
      //
      //   continue;
      // }

      // Will resize to these dimensions.
      // Use explicit dimensions when specified
      const maxHeight: number = options.explicitHeight || parent.offsetHeight;
      const maxWidth: number = options.explicitWidth || parent.offsetWidth;
      _debug(`[TextFill] Maximum sizes: { Height: ${maxHeight}px, Width: ${maxWidth}px }`);

      // This has the actual computed value - useful for calculations
      const oldFontSize = ourTextComputedStyle.getPropertyValue("font-size");
      const oldLineHeight =
        ourTextComputedStyle.getPropertyValue("line-height");
      const oldLetterSpacing =
        ourTextComputedStyle.getPropertyValue("letter-spacing");

      // This has the inline style value - we use this to 'reset' without
      // destroying any existing (but overridden) inline styles
      const oldFontSizeStyle = ourText.style.fontSize;
      const oldLineHeightStyle = ourText.style.lineHeight;
      const oldLetterSpacingStyle = ourText.style.letterSpacing;
      const oldDisplayStyle = ourText.style.display;

      // Line height ratio is essentially the em value
      const lineHeightRatio =
        parseFloat(oldLineHeight) / parseFloat(oldFontSize);
      const letterSpacingRatio =
        parseFloat(oldLetterSpacing) / parseFloat(oldFontSize);

      const minFontPixels = options.minFontPixels;

      // Remember, if this `maxFontPixels` is negative,
      // the text will resize to as long as the container
      // can accomodate
      const maxFontPixels =
        options.maxFontPixels <= 0 ? maxHeight : options.maxFontPixels;

      // 1. Calculate which `font-size` would
      //    be best for the Height
      let fontSizeHeight = undefined;

      // If width-only, we don't care about height
      if (!options.widthOnly) {
        fontSizeHeight = _sizing(
          "Height",
          ourText,
          "offsetHeight",
          maxHeight,
          maxHeight,
          maxWidth,
          minFontPixels,
          maxFontPixels,
          oldFontSize,
          lineHeightRatio,
          letterSpacingRatio
        );
      }

      // 2. Calculate which `font-size` would
      //    be best for the Width
      let fontSizeWidth = undefined;

      // We need to measure with nowrap if we only care about width,
      // otherwise wrapping occurs and the measurement is wrong
      if (options.widthOnly) {
        ourText.style.whiteSpace = "nowrap";
      }

      fontSizeWidth = _sizing(
        "Width",
        ourText,
        "offsetWidth",
        maxWidth,
        maxHeight,
        maxWidth,
        minFontPixels,
        maxFontPixels,
        oldFontSize,
        lineHeightRatio,
        letterSpacingRatio
      );

      // 3. Actually resize the text!
      let fontSizeFinal: number;
      if (options.widthOnly) {
        fontSizeFinal = fontSizeWidth;
      } else if (fontSizeHeight === undefined) {
        fontSizeFinal = fontSizeWidth;
      } else {
        fontSizeFinal = Math.min(fontSizeHeight, fontSizeWidth);
      }

      // Set the font size to the value we found
      ourText.style.fontSize = fontSizeFinal + "px";

      // Remove display - we temporarily set it to inline earlier.
      ourText.style.display = oldDisplayStyle;

      // line-height of 2 or above causes the text to leave the container
      // due to offset at the top.
      // The text is sized to fit the container but
      if (
        options.correctLineHeightOffset &&
        !(isNaN(lineHeightRatio) || lineHeightRatio === 1)
      ) {
        const lhCorrectDiv = document.createElement("div");
        parent.replaceChild(lhCorrectDiv, ourText);
        lhCorrectDiv.appendChild(ourText);

        lhCorrectDiv.className = "textfill-clho";

        // We want to offset the div up by half of the total line height (in lines)
        // (after ignore the actual line of text).
        lhCorrectDiv.style.top = -(lineHeightRatio - 1) / 2 + "em";
        lhCorrectDiv.style.fontSize = fontSizeFinal + "px";
        lhCorrectDiv.style.position = "relative";
      }

      if (options.changeLineHeight) {
        parent.style.lineHeight = lineHeightRatio * fontSizeFinal + "px";
      }

      // Test if something wrong happened
      // If font-size increasing, we weren't supposed to exceed the original size
      // If font-size decreasing, we hit minFontPixels, and still won't fit
      if (
        (ourText.offsetWidth > maxWidth && !options.allowOverflow) ||
        (ourText.offsetHeight > maxHeight &&
          !options.widthOnly &&
          !options.allowOverflow)
      ) {
        // Restore our old styles because we had a failure.
        ourText.style.fontSize = oldFontSizeStyle;
        ourText.style.letterSpacing = oldLetterSpacingStyle;
        ourText.style.lineHeight = oldLineHeightStyle;
        deleteCLHOdiv(parent);

        // Failure callback
        if (options.fail) {
          options.fail(parent);
        }

        _debug(
          "[TextFill] Failure { " +
            "Reason: Either exceeded original size or attempted to go below minFontPixels... " +
            "Current Width: " +
            ourText.offsetWidth +
            ", " +
            "Maximum Width: " +
            maxWidth +
            ", " +
            "Current Height: " +
            ourText.offsetHeight +
            ", " +
            "Maximum Height: " +
            maxHeight +
            " }"
        );

        continue;
      } else if (options.success) {
        options.success(parent);
      }

      _debug(
        "[TextFill] Finished { " +
          "Old font-size: " +
          oldFontSize +
          ", " +
          "New font-size: " +
          fontSizeFinal +
          " }"
      );
    }

    // Complete callback
    if (options.complete) {
      options.complete();
    }

    _debug("[TextFill] End Debug");
  };
  window.addEventListener("resize", function () {
    const resizeElems = document.querySelectorAll(
      "*[data-textfill-resize-options]"
    );
    for (let i = 0; i < resizeElems.length; i++) {
      const parent = resizeElems[i];
      const resizeOptions = parent.getAttribute("data-textfill-resize-options")
      if (resizeOptions) {
        const options = JSON.parse(resizeOptions);
        TextFill(parent, options);
      } else {
        _warn("[TextFill] Couldn't parse `data-textfill-resize-options` attribute.");
      }
    }
  });
  if (typeof module !== "undefined" && typeof module.exports !== "undefined")
    module.exports = TextFill;
  else window.TextFill = TextFill;
})();
