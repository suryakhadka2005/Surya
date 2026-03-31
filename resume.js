/**
 * Résumé page — external script (linked from resume.html)
 */
(function () {
  "use strict";

  if (typeof document === "undefined") {
    return;
  }

  var btn = document.getElementById("print-btn");
  if (btn) {
    btn.addEventListener("click", function () {
      window.print();
    });
  }
})();
