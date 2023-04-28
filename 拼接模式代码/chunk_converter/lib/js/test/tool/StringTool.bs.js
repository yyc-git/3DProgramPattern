'use strict';

var Js_string = require("rescript/lib/js/js_string.js");

function removeBlankNewLine(str) {
  return Js_string.replaceByRe(/[\s\n]+/g, "", str);
}

function removeSegmentDataBlankNewLine(param) {
  var match = param[6];
  var match$1 = param[5];
  var match$2 = param[4];
  var match$3 = param[3];
  var match$4 = param[2];
  var match$5 = param[1];
  return [
          param[0],
          [
            match$5[0],
            removeBlankNewLine(match$5[1])
          ],
          [
            match$4[0],
            removeBlankNewLine(match$4[1])
          ],
          [
            match$3[0],
            removeBlankNewLine(match$3[1])
          ],
          [
            match$2[0],
            removeBlankNewLine(match$2[1])
          ],
          [
            match$1[0],
            removeBlankNewLine(match$1[1])
          ],
          [
            match[0],
            removeBlankNewLine(match[1])
          ]
        ];
}

exports.removeBlankNewLine = removeBlankNewLine;
exports.removeSegmentDataBlankNewLine = removeSegmentDataBlankNewLine;
/* No side effect */
