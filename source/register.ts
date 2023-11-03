import { TextFill } from "./textfill";

(function () {
  if (typeof module !== "undefined" && typeof module.exports !== "undefined")
    module.exports = TextFill;
  else window.TextFill = TextFill;
})();
